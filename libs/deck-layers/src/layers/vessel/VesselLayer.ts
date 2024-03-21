import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps, Color } from '@deck.gl/core'
// Layers
import {
  ApiEvent,
  EventTypes,
  EventVessel,
  ResourceStatus,
  Segment,
} from '@globalfishingwatch/api-types'
import { VesselDeckLayersEventData, vesselEventsLoader } from '@globalfishingwatch/deck-loaders'
import { parquetLoader } from '@globalfishingwatch/deck-loaders'
import { deckToHexColor } from '../../utils/colors'
import { getLayerGroupOffset, LayerGroup } from '../../utils'
import { EVENTS_COLORS, VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'
import { getVesselTrackThunks } from './vessel.utils'

export const TRACK_LAYER_TYPE = 'track'
export interface VesselDeckLayersEvent {
  type: EventTypes
  url: string
}
export type VesselDataType = typeof TRACK_LAYER_TYPE | EventTypes
export type VesselDataStatus = {
  type: VesselDataType
  status: ResourceStatus
}
export type _VesselLayerProps = {
  name: string
  color: Color
  visible: boolean
  onVesselDataLoad?: (layers: VesselDataStatus[]) => void
}
export type VesselEventsLayerProps = Omit<_VesselEventsLayerProps, 'type'> & {
  events: VesselDeckLayersEvent[]
}
export type VesselLayerProps = _VesselTrackLayerProps & VesselEventsLayerProps & _VesselLayerProps

export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  layers: Layer<{ type: VesselDataType }>[] = []
  dataStatus: VesselDataStatus[] = []

  updateDataStatus = (dataType: VesselDataStatus['type'], status: ResourceStatus) => {
    const isDataStatusInitialized = this.dataStatus.findIndex((l) => l.type === dataType) > -1
    if (isDataStatusInitialized) {
      this.dataStatus = this.dataStatus.map((l) => ({
        ...l,
        status: l.type === dataType ? status : l.status,
      }))
    } else {
      this.dataStatus.push({ type: dataType, status })
    }
    if (this?.props.onVesselDataLoad) {
      this?.props?.onVesselDataLoad(this.dataStatus)
    }
  }

  oSublayerDataChange = (type: VesselDataStatus['type'], dataChange: string) => {
    if (dataChange === 'init') {
      this.updateDataStatus(type, ResourceStatus.Loading)
    }
  }

  onSublayerLoad: LayerProps['onDataLoad'] = (data, context) => {
    const type = (context.layer as Layer<{ type: VesselDataType }>)?.props?.type
    if (type === TRACK_LAYER_TYPE) {
      // Needs to check if every track chunk layer is loaded
      const loaded = this.getTrackLayers()?.every((l) => l.isLoaded)
      if (loaded) {
        this.updateDataStatus(type, ResourceStatus.Finished)
      }
    } else {
      this.updateDataStatus(type, ResourceStatus.Finished)
    }
  }

  onSublayerError = (dataType: VesselDataStatus['type'], error: any) => {
    console.warn(`Error loading ${dataType} in ${this.props.id} layer`, error)
    this.updateDataStatus(dataType, ResourceStatus.Error)
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
          loaders: [parquetLoader],
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
          onDataChange: this.oSublayerDataChange,
          onDataLoad: this.onSublayerLoad,
          onError: (error: any) => this.onSublayerError(TRACK_LAYER_TYPE, error),
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
      return new VesselEventsLayer<VesselDeckLayersEventData[]>(
        this.getSubLayerProps({
          id: type,
          data: url,
          visible,
          type,
          onDataChange: this.oSublayerDataChange,
          onDataLoad: this.onSublayerLoad,
          onError: (error: any) => this.onSublayerError(type, error),
          loaders: [vesselEventsLoader],
          pickable: true,
          getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Point, params),
          getFillColor: (d: any): Color => {
            if (highlightEventIds?.includes(d.id)) {
              return EVENTS_COLORS.highlight
            }
            return d.type === EventTypes.Fishing ? this.props.color : EVENTS_COLORS[d.type]
          },
          updateTriggers: {
            getFillColor: [this.props.highlightEventIds],
          },
          radiusMinPixels: 15,
          getFilterValue: (d: VesselDeckLayersEventData) => [d.start, d.end] as any,
          filterRange: [[startTime, endTime] as any, [startTime, endTime] as any],
          extensions: [new DataFilterExtension({ filterSize: 2 }) as any],
        })
      )
    })
  }

  renderLayers(): Layer<{}> | LayersList {
    this.layers = [...this._getVesselTrackLayers(), ...this._getVesselEventsLayer()]
    return this.layers
  }

  getTrackLayers() {
    return this.getSubLayers().filter((l) => l.id.includes(TRACK_LAYER_TYPE)) as VesselTrackLayer<
      Segment[]
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
}
