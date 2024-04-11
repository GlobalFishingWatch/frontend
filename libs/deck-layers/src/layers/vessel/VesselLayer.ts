import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps, Color } from '@deck.gl/core'
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
import { GFWAPI } from '@globalfishingwatch/api-client'
import { deckToHexColor } from '../../utils/colors'
import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { BaseLayerProps } from '../../types'
import { VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'
import { getVesselTrackThunks } from './vessel.utils'
import { EVENTS_COLORS, TRACK_LAYER_TYPE } from './vessel.config'
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

  getPickingInfo = ({ info }: { info: VesselEventPickingInfo }): VesselEventPickingInfo => {
    if (!info.object) {
      info.object = {} as VesselEventPickingObject
    }
    info.object.layerId = this.props.id
    info.object.title = this.props.name
    info.object.vesselId = this.props.id
    info.object.category = DataviewCategory.Vessels
    info.object.color = deckToHexColor(this.props.color)
    // info.object.getDetail = async () => {
    //   return GFWAPI.fetch(`/events/${info.object?.properties.id}`)
    // }
    return info
  }

  onSublayerError = (error: any) => {
    console.warn(error)
    this.setState({ error })
  }

  _getVesselTrackLayers() {
    if (!this.props.trackUrl) {
      console.warn('trackUrl needed for vessel layer')
      return []
    }
    const chunks = getVesselTrackThunks(this.props.startTime, this.props.endTime)
    return chunks.map(({ start, end }) => {
      const chunkId = `${TRACK_LAYER_TYPE}-${start}-${end}`
      const trackUrl = new URL(this.props.trackUrl as string)
      trackUrl.searchParams.append('start-date', start as string)
      trackUrl.searchParams.append('end-date', end as string)
      return new VesselTrackLayer<any, { type: VesselDataType }>(
        this.getSubLayerProps({
          id: chunkId,
          visible: this.props.visible,
          data: trackUrl.toString(),
          type: TRACK_LAYER_TYPE,
          loaders: [VesselTrackLoader],
          _pathType: 'open',
          widthUnits: 'pixels',
          getWidth: 1,
          widthScale: 1,
          wrapLongitude: true,
          jointRounded: true,
          capRounded: true,
          getColor: this.props.color,
          startTime: this.props.startTime,
          endTime: this.props.endTime,
          highlightStartTime: this.props.highlightStartTime,
          highlightEndTime: this.props.highlightEndTime,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Track, params),
          onError: this.onSublayerError,
        })
      )
    })
  }

  _getVesselEventsLayer(): VesselEventsLayer[] {
    const { visible, visibleEvents, startTime, endTime, highlightEventIds } = this.props
    if (!visible) {
      return []
    }
    // return one layer with all events if we are consuming the data object from app resources
    return this.props.events?.flatMap(({ url, type }) => {
      const visible = visibleEvents?.includes(type)
      if (!visible) {
        return []
      }
      return new VesselEventsLayer<VesselDeckLayersEventData[]>(
        this.getSubLayerProps({
          id: type,
          data: url,
          visible,
          type,
          onError: this.onSublayerError,
          loaders: [VesselEventsLoader],
          // loaderOptions: { worker: false },
          pickable: true,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
          getFillColor: (d: any): Color => {
            if (highlightEventIds?.includes(d.id)) {
              return EVENTS_COLORS.highlight
            }
            return d.type === EventTypes.Fishing ? this.props.color : EVENTS_COLORS[d.type]
          },
          updateTriggers: {
            getFillColor: [this.props.highlightEventIds, this.props.color],
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
  }

  renderLayers(): Layer<{}> | LayersList {
    return [...this._getVesselTrackLayers(), ...this._getVesselEventsLayer()]
    // return this._getVesselEventsLayer()
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
