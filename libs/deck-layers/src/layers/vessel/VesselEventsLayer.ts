import { type Color, CompositeLayer } from '@deck.gl/core'
import { DataFilterExtension } from '@deck.gl/extensions'
import { PathLayer } from '@deck.gl/layers'

import { EventTypes } from '@globalfishingwatch/api-types'
import { getLayerGroupOffset, hexToDeckColor, LayerGroup } from '@globalfishingwatch/deck-layers'
import type { VesselDeckLayersEventData } from '@globalfishingwatch/deck-loaders'
import { EVENTS_COLORS } from '@globalfishingwatch/deck-loaders'

import { DEFAULT_FISHING_EVENT_COLOR, SHAPES_ORDINALS } from './vessel.config'
import type { _VesselEventIconLayerProps, VesselEventIconLayerProps } from './VesselEventIconLayer'
import { VesselEventIconLayer } from './VesselEventIconLayer'

export type _VesselEventsLayerProps = Omit<
  _VesselEventIconLayerProps<VesselDeckLayersEventData[]>,
  'data'
> & {
  id: string
  data: string
  type: EventTypes
  singleTrack: boolean
  startTime: number
  endTime: number
  highlightEventIds: string[]
  highlightStartTime: number
  highlightEndTime: number
  color: Color
}

export class VesselEventsLayer extends CompositeLayer<_VesselEventsLayerProps> {
  static layerName = 'VesselEventsLayer'

  renderLayers() {
    const { id, type, singleTrack, highlightEventIds, color, startTime, endTime } = this.props

    const baseLayerProps: VesselEventIconLayerProps = {
      ...this.props,
      id: `${id}-points`,
      data: this.props.data,
      name: this.props.name,
      vesselId: this.props.id.replace('vessel-', ''),
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
      getFillColor: (d: any): Color => {
        if (highlightEventIds?.includes(d.id)) return DEFAULT_FISHING_EVENT_COLOR
        if (d.type === EventTypes.Fishing) {
          return singleTrack ? DEFAULT_FISHING_EVENT_COLOR : color
        }
        return hexToDeckColor(EVENTS_COLORS[d.type as EventTypes])
      },
      radiusUnits: 'pixels',
      getRadius: (d: any) => {
        return d.type === EventTypes.Fishing ? 3 : 6
      },
    }

    const chunkLayers: (VesselEventIconLayer | PathLayer)[] = [
      new VesselEventIconLayer({
        ...baseLayerProps,
        pickable: true,
        getFilterValue: (d: VesselDeckLayersEventData) => [d.start, d.end],
        filterRange: [
          [Number.MIN_SAFE_INTEGER, endTime] as any,
          [startTime, Number.MAX_SAFE_INTEGER],
        ],
        extensions: [new DataFilterExtension({ filterSize: 2 })],
        updateTriggers: {
          getFillColor: [color, highlightEventIds],
          getFilterValue: [endTime, startTime],
        },
      }),
    ]
    if (type === EventTypes.Gap) {
      chunkLayers.push(
        new VesselEventIconLayer({
          ...baseLayerProps,
          id: `${id}-gap`,
          pickable: false,
          getShape: SHAPES_ORDINALS.plus,
          getFilterCategory: (d: VesselDeckLayersEventData): string => {
            return d.id ?? ''
          },
          filterCategories: highlightEventIds,
          extensions: [
            new DataFilterExtension({
              categorySize: 1,
            }),
          ],
          getPosition: (d: VesselDeckLayersEventData) => {
            return d.gaps ? [d.gaps.lonMax, d.gaps.latMax] : (undefined as any)
          },
          updateTriggers: {
            getFillColor: [color, highlightEventIds],
            getFilterCategory: [highlightEventIds],
          },
        })
      )
      chunkLayers.push(
        new PathLayer({
          id: `${id}-line`,
          data: baseLayerProps.data,
          getColor: DEFAULT_FISHING_EVENT_COLOR,
          getPath: (d: VesselDeckLayersEventData) =>
            d.gaps ? [d.coordinates, [d.gaps.lonMax, d.gaps.latMax]] : [],
          getWidth: 2,
          widthUnits: 'pixels',
          pickable: false,
          getFilterCategory: (d: VesselDeckLayersEventData) => d.id,
          filterCategories: highlightEventIds,
          extensions: [
            new DataFilterExtension({
              categorySize: 1,
            }),
          ],
        })
      )
    }
    return chunkLayers
  }
}
