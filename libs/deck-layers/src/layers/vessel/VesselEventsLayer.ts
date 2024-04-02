import { AccessorFunction, DefaultProps, Position, UpdateParameters } from '@deck.gl/core'
import { ScatterplotLayer, ScatterplotLayerProps } from '@deck.gl/layers'
import { EventTypes } from '@globalfishingwatch/api-types'
import { EVENT_SHAPES, SHAPES_ORDINALS } from './vessel.config'

export type _VesselEventsLayerProps<DataT = any> = {
  type: EventTypes
  filterRange?: Array<number>
  visibleEvents?: EventTypes[]
  highlightEventIds?: string[]
  getShape?: AccessorFunction<DataT, number>
  getPosition?: AccessorFunction<DataT, Position> | Position
  getFilterValue?: AccessorFunction<DataT, number>
  getPickingInfo?: AccessorFunction<DataT, string>
  onDataChange?: (type: EventTypes, dataChange: string) => void
}

export type VesselEventsLayerProps<DataT = any> = _VesselEventsLayerProps<DataT> &
  ScatterplotLayerProps<DataT>

const defaultProps: DefaultProps<VesselEventsLayerProps> = {
  filled: { type: 'accessor', value: true },
  opacity: { type: 'accessor', value: 0.8 },
  stroked: { type: 'accessor', value: false },
  filterRange: { type: 'accessor', value: [] },
  radiusScale: { type: 'accessor', value: 1 },
  radiusMinPixels: { type: 'accessor', value: 2 },
  radiusMaxPixels: { type: 'accessor', value: 10 },
  lineWidthMinPixels: { type: 'accessor', value: 1 },
  onDataLoad: { type: 'function', value: () => {} },
  onDataChange: { type: 'function', value: () => {} },
  getShape: {
    type: 'accessor',
    value: (d) => EVENT_SHAPES[d.type as EventTypes] ?? EVENT_SHAPES.fishing,
  },
  getFillColor: { type: 'accessor', value: (d) => [255, 255, 255] },
  getPosition: { type: 'accessor', value: (d) => d.coordinates },
  getPickingInfo: { type: 'accessor', value: ({ info }) => info },
  visibleEvents: { type: 'accessor', value: [] },
}

export class VesselEventsLayer<DataT = any, ExtraProps = {}> extends ScatterplotLayer<
  DataT,
  VesselEventsLayerProps & ExtraProps
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
          in float instanceShapes;
          in float instanceId;
          out float vShape;
        `,
        'vs:#main-end': `
          vShape = instanceShapes;
        `,
        'fs:#decl': `
          uniform mat3 hueTransform;
          in float vShape;
          const int SHAPE_CIRCLE = ${SHAPES_ORDINALS.circle};
          const int SHAPE_SQUARE = ${SHAPES_ORDINALS.square};
          const int SHAPE_DIAMOND = ${SHAPES_ORDINALS.diamond};
          const int SHAPE_DIAMOND_STROKE = ${SHAPES_ORDINALS.diamondStroke};
        `,
        'fs:DECKGL_FILTER_COLOR': `
          vec2 uv = abs(geometry.uv);
          int shape = int(vShape);
          if (shape == SHAPE_CIRCLE) {
            // if (uv.x > 0.3 ) discard;
          } else if (shape == SHAPE_SQUARE) {
            if (uv.x > 0.7 || uv.y > 0.7) discard;
          } else if (shape == SHAPE_DIAMOND) {
              if (uv.x + uv.y > 1.0) discard;
          } else if (shape == SHAPE_DIAMOND_STROKE) {
              if (uv.x + uv.y > 1.0 || uv.x + uv.y < 0.7) {
                discard;
              }
          }
        `,
      },
    }
  }

  updateState(params: UpdateParameters<any>) {
    super.updateState(params)
    const { dataChanged } = params.changeFlags
    if (dataChanged !== false && this.props.onDataChange) {
      this.props.onDataChange(params.props.type, dataChanged as string)
    }
  }

  draw(params: any) {
    super.draw(params)
  }
}
