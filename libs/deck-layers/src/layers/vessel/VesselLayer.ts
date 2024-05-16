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
import { Bbox } from '@globalfishingwatch/data-transforms'
import { deckToHexColor } from '../../utils/colors'
import { getFetchLoadOptions, getLayerGroupOffset, LayerGroup } from '../../utils'
import { BaseLayerProps } from '../../types'
import { VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'
import { getVesselResourceChunks } from './vessel.utils'
import {
  EVENTS_COLORS,
  EVENT_LAYER_TYPE,
  DEFAULT_FISHING_EVENT_COLOR,
  TRACK_LAYER_TYPE,
} from './vessel.config'
import {
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

let warnLogged = false
export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
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

  _getTracksUrl({ start, end, trackUrl }: { start: string; end: string; trackUrl: string }) {
    const trackUrlObject = new URL(trackUrl)
    trackUrlObject.searchParams.append('start-date', start)
    trackUrlObject.searchParams.append('end-date', end)
    const format = trackUrlObject.searchParams.get('format') || 'DECKGL'
    if (format !== 'DECKGL' && !warnLogged) {
      console.warn(`only DECKGL format is supported, the current format (${format}) was replaced`)
      warnLogged = true
    }
    trackUrlObject.searchParams.set('format', 'DECKGL')
    return trackUrlObject.toString()
  }

  _getVesselTrackLayers() {
    const {
      trackUrl,
      visible,
      startTime,
      endTime,
      color,
      highlightStartTime,
      highlightEndTime,
      minSpeedFilter,
      maxSpeedFilter,
      minElevationFilter,
      maxElevationFilter,
    } = this.props
    if (!trackUrl || !visible) {
      if (!trackUrl) console.warn('trackUrl needed for vessel layer')
      return []
    }
    const chunks = getVesselResourceChunks(startTime, endTime)
    return chunks.flatMap(({ start, end }) => {
      if (!start || !end) {
        return []
      }
      const chunkId = `${TRACK_LAYER_TYPE}-${start}-${end}`
      return new VesselTrackLayer<any, { type: VesselDataType }>(
        this.getSubLayerProps({
          id: chunkId,
          visible,
          data: this._getTracksUrl({ start, end, trackUrl }),
          loadOptions: {
            ...getFetchLoadOptions(),
          },
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
          minSpeedFilter,
          maxSpeedFilter,
          minElevationFilter,
          maxElevationFilter,
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
      singleTrack,
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
            loadOptions: {
              ...getFetchLoadOptions(),
            },
            visible,
            type,
            onError: this.onSublayerError,
            loaders: [VesselEventsLoader],
            pickable: true,
            highlightStartTime,
            highlightEndTime,
            getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
            getFillColor: (d: any): Color => {
              if (highlightEventIds?.includes(d.id)) return DEFAULT_FISHING_EVENT_COLOR
              if (d.type === EventTypes.Fishing) {
                return singleTrack ? DEFAULT_FISHING_EVENT_COLOR : color
              }
              return EVENTS_COLORS[d.type]
            },
            updateTriggers: {
              getFillColor: [color, highlightEventIds],
              getRadius: [highlightEventIds],
            },
            radiusUnits: 'pixels',
            getRadius: (d: any) => {
              // TODO:deck highlighlight events using a new layer as we do in FourwingsLayer
              const highlightOffset = highlightEventIds?.includes(d.id) ? 6 : 0
              return (d.type === EventTypes.Fishing ? 3 : 6) + highlightOffset
            },
            getFilterValue: (d: VesselDeckLayersEventData) => [d.start, d.end],
            filterRange: [[startTime, endTime] as any, [startTime, endTime]],
            extensions: [new DataFilterExtension({ filterSize: 2 })],
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

  getVesselTrackBounds() {
    return this.getTrackLayers()?.flatMap((l) => l.getBbox()) as Bbox
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
