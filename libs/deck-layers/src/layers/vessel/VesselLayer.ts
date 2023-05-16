import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps } from '@deck.gl/core/typed'
// Layers
import { ApiEvent, EventVessel, Segment, VesselTrackData } from '@globalfishingwatch/api-types'
import { trackLoader } from '../../loaders/vessels/trackLoader'
import { vesselEventsLoader } from '../../loaders/vessels/eventsLoader'
import { hexToRgb } from '../../utils/layers'
import { VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'
// Loaders
export type VesselLayerProps = _VesselTrackLayerProps &
  _VesselEventsLayerProps & { themeColor: string; layersLoaded: string[] }

export const TRACK_LAYER_PREFIX = 'track'
export const EVENTS_LAYER_PREFIX = 'events'
export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  layersLoaded: string[] = []
  layers: Layer[] = []
  data = []

  onSublayerLoad: LayerProps['onDataLoad'] = (data, context) => {
    const vesselLayer = context.layer.parent as VesselLayer
    vesselLayer?.layersLoaded?.push(context.layer.id)
    const isLastLayer = vesselLayer?.layersLoaded.length === vesselLayer?.layers.length - 1
    if (isLastLayer) {
      vesselLayer?.props.onDataLoad && vesselLayer?.props?.onDataLoad(data, context)
    }
  }

  _getVesselTrackLayer() {
    return new VesselTrackLayer<Segment[]>(
      this.getSubLayerProps({
        id: `${TRACK_LAYER_PREFIX}-vessel-layer-${this.props.id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org${this.props.trackUrl}`,
        loaders: [trackLoader],
        widthUnits: 'pixels',
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        onDataLoad: this.onSublayerLoad,
        getColor: (d: VesselTrackData) => {
          return d.waypoints.map((p) => {
            if (
              this.props.highlightStartTime &&
              p.timestamp >= this.props.highlightStartTime &&
              this.props.highlightEndTime &&
              p.timestamp <= this.props.highlightEndTime
            ) {
              return [255, 255, 255, 255]
            }
            return hexToRgb(this.props.themeColor)
          })
        },
        getWidth: 1,
        updateTriggers: {
          getColor: [
            this.props.highlightStartTime,
            this.props.highlightEndTime,
            this.props.themeColor,
          ],
        },
        startTime: this.props.startTime,
        endTime: this.props.endTime,
      })
    )
  }

  _getVesselEventsLayer() {
    // return one layer with all events if we are consuming the data object from app resources
    if (this.props.eventsResource) {
      return [
        new VesselEventsLayer(
          this.getSubLayerProps({
            id: `${EVENTS_LAYER_PREFIX}-${this.props.id}`,
            data: this.props.eventsResource,
            pickable: true,
            startTime: this.props.startTime,
            endTime: this.props.endTime,
            color: hexToRgb(this.props.themeColor),
            visibleEvents: this.props.visibleEvents,
            getEventVisibility: (d: ApiEvent) =>
              this.props.visibleEvents?.includes(d.type) ? 1 : 0,
            updateTriggers: {
              getEventVisibility: [this.props.visibleEvents],
            },
            filterRange: [this.props.startTime, this.props.endTime],
            extensions: [new DataFilterExtension({ filterSize: 1 })],
          })
        ),
      ]
    } else {
      // return one layer per event type if we are fetching events data from deck
      return this.props.eventsUrls.map((url: string, index: number) => {
        return new VesselEventsLayer(
          this.getSubLayerProps({
            id: `${EVENTS_LAYER_PREFIX}-${this.props.id}-${index}`,
            data: `https://gateway.api.dev.globalfishingwatch.org${url}`,
            onDataLoad: this.onSublayerLoad,
            loaders: [vesselEventsLoader],
            pickable: true,
            startTime: this.props.startTime,
            endTime: this.props.endTime,
            color: hexToRgb(this.props.themeColor),
            visibleEvents: this.props.visibleEvents,
            getEventVisibility: (d: ApiEvent) =>
              this.props.visibleEvents?.includes(d.type) ? 1 : 0,
            updateTriggers: {
              getEventVisibility: [this.props.visibleEvents],
            },
            filterRange: [this.props.startTime, this.props.endTime],
            extensions: [new DataFilterExtension({ filterSize: 1 })],
          })
        )
      })
    }
  }

  renderLayers(): Layer<{}> | LayersList {
    this.layers = [this._getVesselTrackLayer(), ...this._getVesselEventsLayer()]
    return this.layers
  }

  getTrackLayer() {
    return this.getSubLayers().find((l) => l.id.includes(TRACK_LAYER_PREFIX)) as VesselTrackLayer<
      Segment[]
    >
  }

  getEventLayers() {
    return this.getSubLayers().filter((l) =>
      l.id.includes(EVENTS_LAYER_PREFIX)
    ) as VesselEventsLayer[]
  }

  getVesselsData() {
    return this.getSubLayers().map((l) => l.props.data)
  }

  getVesselEventsData() {
    const events = this.getEventLayers().reduce(
      (acc: ApiEvent[], l: VesselEventsLayer): ApiEvent<EventVessel>[] => {
        const events = l.props.eventType ? l.props.data : []
        return [...acc, events] as ApiEvent[]
      },
      []
    )
    const sortedEvents: ApiEvent[] = events
      .flat()
      .sort((a, b) => (a.start as number) - (b.start as number))
    return sortedEvents
  }

  getVesselTrackData() {
    return this.getTrackLayer()?.getSegments() || []
  }
}
