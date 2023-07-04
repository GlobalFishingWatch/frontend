import { AccessorFunction, Color, DefaultProps, Position } from '@deck.gl/core/typed'
import { ScatterplotLayer, ScatterplotLayerProps } from '@deck.gl/layers/typed'
import { EventTypes } from '@globalfishingwatch/api-types'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { hexToDeckColor } from '../../utils/colors'

export const EVENT_TYPES_ORDINALS: { [key in EventTypes]: number } = {
  port_visit: 0,
  encounter: 1,
  fishing: 2,
  gap: 3,
  loitering: 4,
}

export const EVENTS_COLORS: Record<string, Color> = {
  encounter: hexToDeckColor('#FAE9A0'),
  loitering: hexToDeckColor('#cfa9f9'),
  port_visit: hexToDeckColor('#99EEFF'),
  highlight: hexToDeckColor('#ffffff'),
}

export type _VesselEventsLayerProps<DataT = any> = {
  type: EventTypes
  zIndex?: number
  filterRange: Array<number>
  visibleEvents?: EventTypes[]
  highlightEventIds?: string[]
  getShape?: AccessorFunction<DataT, number>
  getPosition?: AccessorFunction<DataT, Position> | Position
  getFilterValue: AccessorFunction<DataT, number>
  getPickingInfo?: AccessorFunction<DataT, string>
  onEventsDataLoad?: AccessorFunction<DataT, void>
}

export type VesselEventsLayerProps<DataT = any> = _VesselEventsLayerProps<DataT> &
  ScatterplotLayerProps<DataT>

const defaultProps: DefaultProps<VesselEventsLayerProps> = {
  filled: { type: 'accessor', value: true },
  opacity: { type: 'accessor', value: 0.8 },
  stroked: { type: 'accessor', value: false },
  filterRange: { type: 'accessor', value: [] },
  radiusScale: { type: 'accessor', value: 30 },
  radiusMinPixels: { type: 'accessor', value: 2 },
  radiusMaxPixels: { type: 'accessor', value: 10 },
  lineWidthMinPixels: { type: 'accessor', value: 1 },
  onDataLoad: { type: 'function', value: () => {} },
  getShape: {
    type: 'accessor',
    value: (d) => EVENT_TYPES_ORDINALS[d.type as EventTypes] ?? EVENT_TYPES_ORDINALS.fishing,
  },
  getFillColor: { type: 'accessor', value: (d) => [255, 255, 255] },
  getPosition: { type: 'accessor', value: (d) => d.coordinates },
  getPickingInfo: { type: 'accessor', value: ({ info }) => info },
  zIndex: { type: 'accessor', value: GROUP_ORDER.indexOf(Group.Point) },
  visibleEvents: { type: 'accessor', value: [] },
}

export class VesselEventsLayer<DataT = any, ExtraProps = {}> extends ScatterplotLayer<
  DataT,
  Required<VesselEventsLayerProps> & ExtraProps
> {
  static layerName = 'VesselEventsLayer'
  static defaultProps = defaultProps

  initializeState() {
    super.initializeState()
    const attributeManager = this.getAttributeManager()
    if (attributeManager) {
      attributeManager.addInstanced({
        instanceShapes: {
          size: 1,
          accessor: 'getShape',
        },
      })
    }
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
        `,
        'fs:DECKGL_FILTER_COLOR': `
          vec2 uv = abs(geometry.uv);
          int shape = int(vShape);
          if (shape == SHAPE_SQUARE) {
            if (uv.x > 0.7 || uv.y > 0.7) discard;
          } else if (shape == SHAPE_DIAMOND) {
              if (uv.x + uv.y > 1.0) discard;
          }
        `,
      },
    }
  }

  draw(params: any) {
    super.draw(params)
  }
}
