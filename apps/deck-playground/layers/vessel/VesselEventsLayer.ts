import { AccessorFunction, DefaultProps } from '@deck.gl/core/typed'
import { ScatterplotLayer, ScatterplotLayerProps } from '@deck.gl/layers/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'

export type _VesselEventsLayerProps<DataT = any> = {
  eventType?: string
  zIndex?: number
  filterRange?: Array<number>
  getShape?: AccessorFunction<DataT, number>
  getPosition?: AccessorFunction<DataT, number>
  getFilterValue?: AccessorFunction<DataT, number>
  getPickingInfo?: AccessorFunction<DataT, string>
  onEventsDataLoad?: AccessorFunction<DataT, void>
}

export type VesselEventsLayerProps<DataT = any> = _VesselEventsLayerProps<DataT> &
  Partial<ScatterplotLayerProps<DataT>>

const defaultProps: DefaultProps<VesselEventsLayerProps> = {
  filled: { type: 'accessor', value: true },
  opacity: { type: 'accessor', value: 0.8 },
  stroked: { type: 'accessor', value: false },
  filterRange: { type: 'accessor', value: [] },
  radiusScale: { type: 'accessor', value: 30 },
  radiusMinPixels: { type: 'accessor', value: 5 },
  radiusMaxPixels: { type: 'accessor', value: 10 },
  lineWidthMinPixels: { type: 'accessor', value: 1 },
  onDataLoad: { type: 'function', value: () => {} },
  getShape: { type: 'accessor', value: (d) => d.shapeIndex },
  getFilterValue: { type: 'accessor', value: (d) => d.start },
  getPosition: { type: 'accessor', value: (d) => d.coordinates },
  getPickingInfo: { type: 'accessor', value: ({ info }) => info },
  zIndex: { type: 'accessor', value: GROUP_ORDER.indexOf(Group.Point) },
}

export class VesselEventsLayer<DataT = any, ExtraProps = {}> extends ScatterplotLayer<
  DataT,
  Required<VesselEventsLayerProps> & ExtraProps
> {
  static layerName = 'VesselEventsLayer'
  static defaultProps = defaultProps

  initializeState() {
    super.initializeState()
    this.getAttributeManager().addInstanced({
      instanceShapes: {
        size: 1,
        accessor: 'getShape',
      },
    })
  }

  getShaders() {
    return {
      ...super.getShaders(),
      inject: {
        'vs:#decl': `
          attribute float instanceShapes;
          attribute float instanceId;
          varying float vShape;
        `,
        'vs:#main-end': `
          vShape = instanceShapes;
        `,
        'fs:#decl': `
          uniform mat3 hueTransform;
          varying float vShape;
          const int SHAPE_SQUARE = 0;
          const int SHAPE_DIAMOND = 1;
          const int SHAPE_CIRCLE = 2;
        `,
        'fs:DECKGL_FILTER_COLOR': `
          vec2 uv = abs(geometry.uv);
          int shape = int(vShape);
          if (shape == SHAPE_SQUARE) {
            color = vec4(1.0, 1.0, 1.0, 1.0);
            if (uv.x > 0.7 || uv.y > 0.7) discard;
          } else if (shape == SHAPE_DIAMOND) {
              color = vec4(1.0, 1.0, 0.0, 1.0);
              if (uv.x + uv.y > 1.0) discard;
          } else {
            color.rgb = vec3(1.0, 0.0, 0.0);
          }
        `,
      },
    }
  }
}
