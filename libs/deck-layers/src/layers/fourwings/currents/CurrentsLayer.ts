import { Geometry } from '@luma.gl/engine'
import { Model } from '@luma.gl/engine'
import type { LayerProps, Accessor, DefaultProps, LayerDataSource } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'

type _CurrentsLayerProps<DataT> = {
  data: LayerDataSource<DataT>
  time: number
  getVelocity?: Accessor<DataT, number>
  getDirection?: Accessor<DataT, number>
}

export type CurrentsLayerProps<DataT = unknown> = _CurrentsLayerProps<DataT> & LayerProps

const defaultProps: DefaultProps<CurrentsLayerProps> = {
  data: { type: 'data', value: [] },
  time: { type: 'number', value: 0 },
  getVelocity: { type: 'accessor', value: (d: any) => d.velocity || 0 },
  getDirection: { type: 'accessor', value: (d: any) => d.direction || 0 },
}

/** Render circles at given coordinates. */
export default class CurrentsLayer<
  DataT = unknown,
  ExtraPropsT extends object = object,
> extends ScatterplotLayer<ExtraPropsT & Required<_CurrentsLayerProps<DataT>>> {
  static defaultProps = defaultProps
  static layerName: string = 'Layer'

  protected _getModel() {
    // a square that minimally cover the unit circle
    // const positions = [-1, -1, 0, 0.5, 0.5, 0, 1, 1, 0];
    const positions = [0.0, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0]
    return new Model(this.context.device, {
      ...this.getShaders(),
      id: this.props.id,
      bufferLayout: this.getAttributeManager()!.getBufferLayouts(),
      geometry: new Geometry({
        topology: 'triangle-list',
        attributes: {
          positions: { size: 3, value: new Float32Array(positions) },
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
      })
      attributeManager.addInstanced({
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

  // updateState({ props, oldProps }: UpdateParameters<this>) {
  //   requestAnimationFrame(() => {
  //     this.setState({ time: (Date.now() % 1000) / 1000 });
  //   });
  // }

  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        'vs:#decl': `
          in float instanceDirections;
          in float instanceVelocity;

          vec2 rotate_by_angle(vec2 vertex, float angle) {
            float angle_radian = angle * PI / 180.0;
            float cos_angle = cos(angle_radian);
            float sin_angle = sin(angle_radian);
            mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
            return rotationMatrix * vertex;
          }
        `,
        'vs:DECKGL_FILTER_SIZE': `
          float minWidth = 0.0; // Minimum width in pixels
          float maxWidth = 1.0; // Define your maximum width here
          float normalizedVelocity = min(instanceVelocity / 100.0, 1.0);
          float widthFactor = mix(minWidth, maxWidth, normalizedVelocity); // Interpolate between min and max based on instanceVelocity
          size.x *= widthFactor; // Scale the size based on the variable
          size.xy = rotate_by_angle(size.xy, instanceDirections);
        `,
        'fs:#decl': `
          uniform float uTime;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          // float yPos = abs(geometry.uv.y - uTime);
          // color.a = mix(0.0, 1.0, 1.0 - (yPos * 2.0));
          float yPos = mod(geometry.uv.y - uTime, 1.0); // Use modulo for smooth transition
          color.a = mix(0.2, 1.0, 1.0 - sin(yPos * 3.14)); // Inverted opacity calculation
        `,
      },
    }
  }

  draw(params: any) {
    const { uniforms } = params
    uniforms.uTime = (this.props as any).time || 0
    super.draw(params)
  }
}
