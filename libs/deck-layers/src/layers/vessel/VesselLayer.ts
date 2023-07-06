import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps, Color } from '@deck.gl/core/typed'
// Layers
import {
  ApiEvent,
  EventTypes,
  EventVessel,
  ResourceStatus,
  Segment,
} from '@globalfishingwatch/api-types'
import { parquetLoader } from '../../loaders/vessels/trackLoader'
import { VesselDeckLayersEventData, vesselEventsLoader } from '../../loaders/vessels/eventsLoader'
import { VesselDeckLayersEvent } from '../../layer-composer/types/vessel'
import { deckToHexColor } from '../../utils/colors'
import { EVENTS_COLORS, VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'

export const TRACK_LAYER_TYPE = 'track'
export type VesselDataType = typeof TRACK_LAYER_TYPE | EventTypes
export type VesselDataStatus = {
  type: VesselDataType
  status: ResourceStatus
}
export type _VesselLayerProps = {
  name: string
  color: Color
  onVesselDataLoad: (layers: VesselDataStatus[]) => void
}
export type VesselEventsLayerProps = _VesselEventsLayerProps & { events: VesselDeckLayersEvent[] }
export type VesselLayerProps = _VesselTrackLayerProps & VesselEventsLayerProps & _VesselLayerProps

export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  layers: Layer<{ type: VesselDataType }>[] = []
  dataStatus: VesselDataStatus[] = []

  updateDataStatus = (dataType: VesselDataStatus['type'], status: ResourceStatus) => {
    this.dataStatus = this.dataStatus.map((l) => ({
      ...l,
      status: l.type === dataType ? status : l.status,
    }))
    if (this?.props.onVesselDataLoad) {
      this?.props?.onVesselDataLoad(this.dataStatus)
    }
  }

  onSublayerLoad: LayerProps['onDataLoad'] = (data, context) => {
    // TODO handle when no data
    const layer = context.layer as Layer<{ type: VesselDataType }>
    this.updateDataStatus(layer.props.type, ResourceStatus.Finished)
  }

  // TODO reset when loader fails
  onSublayerError = (dataType: VesselDataStatus['type'], error: any) => {
    console.warn(`Error loading ${dataType} in ${this.props.id} layer`, error)
    this.updateDataStatus(dataType, ResourceStatus.Error)
  }

  _getVesselTrackLayer() {
    return new VesselTrackLayer<any, { type: VesselDataType }>(
      this.getSubLayerProps({
        id: TRACK_LAYER_TYPE,
        visible: this.props.visible,
        // TODO reset data when url changes
        // TODO should we pass the url and load data when no visible?
        data: this.props.trackUrl,
        type: TRACK_LAYER_TYPE,
        loaders: [parquetLoader],
        widthUnits: 'pixels',
        onDataLoad: this.onSublayerLoad,
        // TODO debug when data loading throws an error this is not triggered
        onError: (error: any) => this.onSublayerError(TRACK_LAYER_TYPE, error),
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        highlightStartTime: this.props.highlightStartTime,
        highlightEndTime: this.props.highlightEndTime,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        _pathType: 'open',
        getColor: this.props.color,
        getWidth: 1,
      })
    )
  }

  _getVesselEventsLayer(): VesselEventsLayer[] {
    const { visible, visibleEvents, startTime, endTime, highlightEventIds } = this.props
    if (!visible) {
      return []
    }
    // return one layer with all events if we are consuming the data object from app resources
    return this.props.events?.flatMap(({ url, type, data }) => {
      const visible = visibleEvents?.includes(type)
      return new VesselEventsLayer<VesselDeckLayersEventData[]>(
        this.getSubLayerProps({
          id: type,
          data: visible ? url || data : '',
          visible,
          type,
          onDataLoad: this.onSublayerLoad,
          onError: (error: any) => this.onSublayerError(type, error),
          loaders: [vesselEventsLoader],
          pickable: true,
          getFillColor: (d: any): Color => {
            if (highlightEventIds?.includes(d.id)) {
              return EVENTS_COLORS.highlight
            }
            return d.type === EventTypes.Fishing ? this.props.color : EVENTS_COLORS[d.type]
          },
          // TODO add line border to highlight event
          // getLineColor: (d: any): Color =>
          //   d.id === this.props.highlightEventId ? [255, 255, 255, 255] : [0, 0, 0, 0],
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
    this.layers = [this._getVesselTrackLayer(), ...this._getVesselEventsLayer()]
    if (!this.dataStatus.length) {
      this.dataStatus = this.layers.map((l) => ({
        type: l.props.type,
        status: ResourceStatus.Loading,
      }))
    }
    return this.layers
  }

  getTrackLayer() {
    return this.getSubLayers().find((l) => l.id.includes(TRACK_LAYER_TYPE)) as VesselTrackLayer<
      Segment[]
    >
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
    return this.getTrackLayer()?.getData()
  }

  getVesselTrackSegments() {
    return this.getTrackLayer()?.getSegments()
  }
}
