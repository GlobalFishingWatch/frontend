import type { Accessor, DefaultProps, LayerDataSource, LayerProps } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'
import { Geometry, Model } from '@luma.gl/engine'

type _VectorsLayerProps<DataT> = {
  data: LayerDataSource<DataT>
  getVelocity?: Accessor<DataT, number>
  getDirection?: Accessor<DataT, number>
  maxVelocity?: number
}

export type VectorsLayerProps<DataT = unknown> = _VectorsLayerProps<DataT> & LayerProps

const defaultProps: DefaultProps<VectorsLayerProps> = {
  data: { type: 'data', value: [] },
  getVelocity: { type: 'accessor', value: (d: any) => d.velocity || 0 },
  getDirection: { type: 'accessor', value: (d: any) => d.direction || 0 },
  maxVelocity: 1,
}

const uniformBlock = `
  uniform vectorsUniforms {
    uniform float maxVelocity;
  } vectors;
`

const vectorsLayerUniforms = {
  name: 'vectors',
  vs: uniformBlock,
  fs: uniformBlock,
  uniformTypes: {
    maxVelocity: 'f32',
  },
}

export default class VectorsLayer<
  DataT = unknown,
  ExtraPropsT extends object = object,
> extends ScatterplotLayer<ExtraPropsT & Required<_VectorsLayerProps<DataT>>> {
  static defaultProps = defaultProps
  static layerName: string = 'CurrentsLayer'

  protected _getModel() {
    // Define the vertices of an arrow shape based
    const positions = new Float32Array([
      // Left triangle (tip to bottom-left via notch)
      0.0,
      0.5, // top tip
      -0.5,
      -0.5, // bottom left
      0.0,
      -0.286, // notch point
      // Right triangle (tip to bottom-right via notch)
      0.0,
      0.5, // top tip
      0.0,
      -0.286, // notch point
      0.5,
      -0.5, // bottom right
    ])

    return new Model(this.context.device, {
      ...this.getShaders(),
      id: this.props.id,
      bufferLayout: this.getAttributeManager()!.getBufferLayouts(),
      geometry: new Geometry({
        topology: 'triangle-list',
        attributes: {
          positions: { size: 2, value: positions },
        },
      }),
      isInstanced: true,
    })
  }

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        directions: {
          size: 1,
          accessor: 'getDirection',
          shaderAttributes: {
            instanceDirections: {},
          },
        },
        velocity: {
          size: 1,
          accessor: 'getVelocity',
          shaderAttributes: {
            instanceVelocity: {},
          },
        },
      })
    }
  }

  getShaders() {
    const shaders = super.getShaders()
    shaders.modules = [...(shaders.modules || []), vectorsLayerUniforms]
    return {
      ...shaders,
      inject: {
        'vs:#decl': `
          in float instanceDirections;
          in float instanceVelocity;
          out float vVelocity;
          out float vNormalizedVelocity;

          vec2 rotate_by_angle(vec2 vertex, float angle) {
            float angle_radian = angle * PI / 180.0;
            float cos_angle = cos(angle_radian);
            float sin_angle = sin(angle_radian);
            mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
            return rotationMatrix * vertex;
          }
        `,
        'vs:DECKGL_FILTER_SIZE': `
          // Don't render triangles with invalid or zero velocity
          if (instanceVelocity <= 0.0) {
            size.xy = vec2(0.0);
            return;
          }
          // Normalize velocity by maxVelocity and clamp to [0, 1] range
          float normalizedVelocity = clamp(instanceVelocity / vectors.maxVelocity, 0.0, 1.0);

          // Apply exponential scale: values above 0.6-0.7 approach full velocity
          // Using exponential function: 1.0 - exp(-k * normalizedVelocity)
          // k=5.0 ensures values at 0.6-0.7 map to ~0.95-0.97 (near full velocity)
          float compressedVelocity = 1.0 - exp(-5.0 * normalizedVelocity);

          // Base size is similar for all triangles (length)
          float baseLength = 0.65;

          // Width varies with velocity: lower velocities are narrower
          // Use a power curve to make lower velocities more narrow
          float widthFactor = pow(compressedVelocity, 0.5);
          float baseWidth = mix(0.3, 0.7, widthFactor);

          // Apply: x-axis (width) varies, y-axis (length) is more constant
          size.x *= baseWidth;
          size.y *= baseLength;

          // Clamp direction to valid range and normalize
          float normalizedDirection = mod(instanceDirections, 360.0);
          size.xy = rotate_by_angle(size.xy, normalizedDirection);
        `,
        'vs:#main-end': `
          // Normalize velocity by maxVelocity and pass to fragment shader (only if valid)
          // Apply same exponential scale as in size calculation for consistency
          float normalizedVelocity = instanceVelocity > 0.0 ? clamp(instanceVelocity / vectors.maxVelocity, 0.0, 1.0) : 0.0;
          vNormalizedVelocity = normalizedVelocity; // Pass original for brightness boost calculation
          // Apply exponential scale: values above 0.6-0.7 (3-3.5 out of 5) approach full velocity
          vVelocity = 1.0 - exp(-5.0 * normalizedVelocity);
        `,
        'fs:#decl': `
          in float vVelocity;
          in float vNormalizedVelocity;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          // Don't render if velocity is invalid or zero
          if (vNormalizedVelocity <= 0.0) {
            discard;
          }

          // Base opacity based on velocity using exponential scale
          // Apply exponential scale: values above 0.6-0.7 (3-3.5 out of 5) approach full opacity
          // Using exponential function: 1.0 - exp(-k * normalizedVelocity)
          // k=5.0 ensures values at 0.6-0.7 map to ~0.95-0.97 (near full opacity)
          float exponentialVelocity = 1.0 - exp(-5.0 * vNormalizedVelocity);
          float minOpacity = 0.1;
          float maxOpacity = 1.0;
          float baseSpeedOpacity = mix(minOpacity, maxOpacity, exponentialVelocity);


          // Apply gradient along triangle using geometry.uv
          // For triangle: base is at lower y (0), tip is at higher y (1)
          // Create a smooth gradient that makes the tip more visible
          float gradientFactor = mix(0.4, 1.0, geometry.uv.y);

          // Combine velocity-based opacity with brightness boost and gradient
          color.a *= baseSpeedOpacity * gradientFactor;
          // Clamp to valid range
          color.a = clamp(color.a, 0.0, 1.0);
        `,
      },
    }
  }

  draw(params: any) {
    const maxVelocity = (this.props as any).maxVelocity ?? 1.0

    if (this.state.model) {
      this.state.model.shaderInputs.setProps({
        vectors: {
          maxVelocity,
        },
      })
    }

    super.draw(params)
  }
}
