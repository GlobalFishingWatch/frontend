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
    // Define the vertices of a single triangle
    const positions = new Float32Array([-0.5, -0.5, 0.5, -0.5, 0.0, 0.5])

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
          // Use a tighter size range to reduce overlap (0.4 to 0.8 instead of 0.5 to 1.0)
          size.xy *= mix(0.4, 0.8, normalizedVelocity);
          // Clamp direction to valid range and normalize
          float normalizedDirection = mod(instanceDirections, 360.0);
          size.xy = rotate_by_angle(size.xy, normalizedDirection);
        `,
        'vs:#main-end': `
          // Normalize velocity by maxVelocity and pass to fragment shader (only if valid)
          vVelocity = instanceVelocity > 0.0 ? clamp(instanceVelocity / vectors.maxVelocity, 0.0, 1.0) : 0.0;
        `,
        'fs:#decl': `
          in float vVelocity;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          // Don't render if velocity is invalid or zero
          if (vVelocity <= 0.0) {
            discard;
          }
          float minOpacity = 0.5;
          float maxOpacity = 0.9;
          // Velocity is already normalized to [0, 1] range in vertex shader
          float speedFactor = mix(minOpacity, maxOpacity, vVelocity);
          color.a *= mix(minOpacity, maxOpacity, geometry.uv.y) * speedFactor;
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
