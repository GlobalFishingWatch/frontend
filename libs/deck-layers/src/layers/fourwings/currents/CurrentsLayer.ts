import type { Accessor, DefaultProps, LayerDataSource, LayerProps } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'
import { Geometry, Model } from '@luma.gl/engine'

type _CurrentsLayerProps<DataT> = {
  data: LayerDataSource<DataT>
  time: number
  getVelocity?: Accessor<DataT, number>
  getDirection?: Accessor<DataT, number>
}

export type CurrentsLayerProps<DataT = unknown> = _CurrentsLayerProps<DataT> & LayerProps

const defaultProps: DefaultProps<CurrentsLayerProps> = {
  data: { type: 'data', value: [] },
  getVelocity: { type: 'accessor', value: (d: any) => d.velocity || 0 },
  getDirection: { type: 'accessor', value: (d: any) => d.direction || 0 },
}

export default class CurrentsLayer<
  DataT = unknown,
  ExtraPropsT extends object = object,
> extends ScatterplotLayer<ExtraPropsT & Required<_CurrentsLayerProps<DataT>>> {
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
    return {
      ...super.getShaders(),
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
          size.xy *= mix(0.5, 1.0, instanceVelocity);
          size.xy = rotate_by_angle(size.xy, instanceDirections);
        `,
        'vs:#main-end': `
          vVelocity = instanceVelocity;
        `,
        'fs:#decl': `
          in float vVelocity;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          float minOpacity = 0.2;
          float maxOpacity = 1.5;
          float speedFactor = mix(minOpacity, maxOpacity, vVelocity);
          color.a *= mix(minOpacity, maxOpacity, geometry.uv.y) * speedFactor;
        `,
      },
    }
  }
}
