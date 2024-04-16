import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps, Color, PickingInfo } from '@deck.gl/core'
import {
  ApiEvent,
  DataviewCategory,
  EventTypes,
  EventVessel,
  TrackSegment,
} from '@globalfishingwatch/api-types'
import {
  VesselDeckLayersEventData,
  VesselEventsLoader,
  VesselTrackLoader,
} from '@globalfishingwatch/deck-loaders'
import { deckToHexColor } from '../../utils/colors'
import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { BaseLayerProps } from '../../types'
import { VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'
import { getVesselResourceChunks } from './vessel.utils'
import { EVENTS_COLORS, EVENT_LAYER_TYPE, TRACK_LAYER_TYPE } from './vessel.config'
import {
  VesselDataStatus,
  VesselDataType,
  VesselDeckLayersEvent,
  VesselEventPickingInfo,
  VesselEventPickingObject,
  VesselEventProperties,
  _VesselLayerProps,
} from './vessel.types'

export type VesselEventsLayerProps = Omit<_VesselEventsLayerProps, 'type'> & {
  events: VesselDeckLayersEvent[]
}

export type VesselLayerProps = BaseLayerProps &
  _VesselTrackLayerProps &
  VesselEventsLayerProps &
  _VesselLayerProps

export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  dataStatus: VesselDataStatus[] = []

  getPickingInfo = ({
    info,
  }: {
    info: PickingInfo<VesselEventProperties>
  }): VesselEventPickingInfo => {
    const object = {
      ...(info.object || ({} as VesselEventProperties)),
      layerId: this.root.id,
      title: this.props.name,
      vesselId: this.props.id,
      category: DataviewCategory.Vessels,
      color: deckToHexColor(this.props.color),
    }
    if (!info.object) {
      info.object = {} as VesselEventPickingObject
    }
    // info.object.getDetail = async () => {
    //   return GFWAPI.fetch(`/events/${info.object?.properties.id}`)
    // }
    return { ...info, object }
  }

  onSublayerError = (error: any) => {
    console.warn(error)
    this.setState({ error })
  }

  _getVesselTrackLayers() {
    const { trackUrl, visible, startTime, endTime, color, highlightStartTime, highlightEndTime } =
      this.props
    if (!trackUrl || !visible) {
      if (!trackUrl) console.warn('trackUrl needed for vessel layer')
      return []
    }
    const chunks = getVesselResourceChunks(startTime, endTime)
    return chunks.map(({ start, end }) => {
      const chunkId = `${TRACK_LAYER_TYPE}-${start}-${end}`
      const trackUrlObject = new URL(trackUrl as string)
      trackUrlObject.searchParams.append('start-date', start as string)
      trackUrlObject.searchParams.append('end-date', end as string)
      return new VesselTrackLayer<any, { type: VesselDataType }>(
        this.getSubLayerProps({
          id: chunkId,
          visible,
          data: trackUrlObject.toString(),
          type: TRACK_LAYER_TYPE,
          loaders: [VesselTrackLoader],
          _pathType: 'open',
          widthUnits: 'pixels',
          getWidth: 1,
          widthScale: 1,
          wrapLongitude: true,
          jointRounded: true,
          capRounded: true,
          getColor: color,
          startTime,
          endTime,
          highlightStartTime,
          highlightEndTime,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
          onError: this.onSublayerError,
        })
      )
    })
  }

  _getVesselEventLayers(): VesselEventsLayer[] {
    const {
      visible,
      visibleEvents,
      startTime,
      endTime,
      highlightEventIds,
      events,
      highlightStartTime,
      highlightEndTime,
      color,
    } = this.props
    if (!visible) {
      return []
    }
    const chunks = getVesselResourceChunks(startTime, endTime)
    // return one layer with all events if we are consuming the data object from app resources
    return events?.flatMap(({ url, type }) => {
      const visible = visibleEvents?.includes(type)
      if (!visible) {
        return []
      }
      return chunks.map(({ start, end }) => {
        const chunkId = `${EVENT_LAYER_TYPE}-${type}-${start}-${end}`
        const eventUrl = new URL(url as string)
        eventUrl.searchParams.append('start-date', start as string)
        eventUrl.searchParams.append('end-date', end as string)
        return new VesselEventsLayer<VesselDeckLayersEventData[]>(
          this.getSubLayerProps({
            id: chunkId,
            data: eventUrl.toString(),
            visible,
            type,
            onError: this.onSublayerError,
            loaders: [VesselEventsLoader],
            pickable: true,
            highlightStartTime,
            highlightEndTime,
            getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
            getFillColor: (d: any): Color => {
              return d.type === EventTypes.Fishing ? color : EVENTS_COLORS[d.type]
            },
            updateTriggers: {
              getFillColor: [color],
            },
            radiusUnits: 'pixels',
            getRadius: (d: any) => {
              const highlightOffset = highlightEventIds?.includes(d.id) ? 3 : 0
              return (d.type === EventTypes.Fishing ? 3 : 6) + highlightOffset
            },
            getFilterValue: (d: VesselDeckLayersEventData) => [d.start, d.end] as any,
            filterRange: [[startTime, endTime] as any, [startTime, endTime] as any],
            extensions: [new DataFilterExtension({ filterSize: 2 }) as any],
          })
        )
      })
    })
  }

  renderLayers(): Layer<{}> | LayersList {
    return [...this._getVesselTrackLayers(), ...this._getVesselEventLayers()]
  }

  getTrackLayers() {
    return this.getSubLayers().filter((l) => l.id.includes(TRACK_LAYER_TYPE)) as VesselTrackLayer<
      TrackSegment[]
    >[]
  }

  getEventLayers() {
    return this.getSubLayers().filter(
      (l) => !l.id.includes(TRACK_LAYER_TYPE)
    ) as VesselEventsLayer[]
  }

  getVesselName() {
    return this.props.name
  }

  getVesselColor() {
    return deckToHexColor(this.props.color)
  }

  getVesselsData() {
    return this.getSubLayers().map((l) => l.props.data)
  }

  getVesselEventsData(types?: EventTypes[]) {
    const events = this.getEventLayers()
      .flatMap((layer: VesselEventsLayer): ApiEvent<EventVessel>[] => {
        const events = types
          ? types.includes(layer.props.type)
            ? layer.props.data
            : []
          : layer.props.data || []
        return events as ApiEvent[]
      }, [])
      .sort((a, b) => (a.start as number) - (b.start as number))
    return events
  }

  getVesselTrackData() {
    return this.getTrackLayers()?.flatMap((l) => l.getData())
  }

  getVesselTrackSegments() {
    return this.getTrackLayers()?.flatMap((l) => l.getSegments())
  }

  getVesselEventsLayersLoaded() {
    return this.getEventLayers().every((l) => l.isLoaded)
  }

  getVesselTracksLayersLoaded() {
    return this.getTrackLayers().every((l) => l.isLoaded)
  }

  getAllSublayersLoaded() {
    return this.getVesselEventsLayersLoaded() && this.getVesselTracksLayersLoaded()
  }

  getErrorMessage() {
    return this.state.error
  }
}
