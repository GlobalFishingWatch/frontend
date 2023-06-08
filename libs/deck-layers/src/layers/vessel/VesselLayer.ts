import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps } from '@deck.gl/core/typed'
// Layers
import {
  ApiEvent,
  EventTypes,
  EventVessel,
  Segment,
  VesselTrackData,
} from '@globalfishingwatch/api-types'
import { trackLoader } from '../../loaders/vessels/trackLoader'
import { vesselEventsLoader } from '../../loaders/vessels/eventsLoader'
import { hexToRgb } from '../../utils/layers'
import { START_TIMESTAMP } from '../../loaders/constants'
import { VesselDeckLayersEvent } from '../../layer-composer/types/vessel'
import { VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'

export type VesselEventsLayerProps = _VesselEventsLayerProps & { events: VesselDeckLayersEvent[] }
export type VesselLayerProps = _VesselTrackLayerProps &
  VesselEventsLayerProps & { name: string; themeColor: string; layersLoaded: string[] }

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
        data: this.props.trackUrl,
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

  _getVesselEventsLayer(): VesselEventsLayer[] {
    const { visible, id, themeColor, visibleEvents, startTime, endTime, name } = this.props
    // return one layer with all events if we are consuming the data object from app resources
    return this.props.events?.map(({ url, type, data }, index) => {
      return new VesselEventsLayer({
        id: `${EVENTS_LAYER_PREFIX}-${id}-${index}`,
        data: url || data,
        visible,
        type,
        name,
        onDataLoad: this.onSublayerLoad,
        loaders: [vesselEventsLoader],
        pickable: true,
        startTime: startTime,
        endTime: endTime,
        color: hexToRgb(themeColor),
        visibleEvents: visibleEvents,
        getEventVisibility: (d: ApiEvent) => (visibleEvents?.includes(d.type) ? 1 : 0),
        updateTriggers: {
          getEventVisibility: [visibleEvents],
        },
        filterRange: [startTime, endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 }) as any],
      })
    })
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

  getVesselName() {
    return this.props.name
  }

  getVesselsData() {
    return this.getSubLayers().map((l) => l.props.data)
  }

  getVesselEventsData(type?: EventTypes[]) {
    const events = this.getEventLayers().reduce(
      (acc: ApiEvent[], l: VesselEventsLayer): ApiEvent<EventVessel>[] => {
        const events = type ? (type.includes(l.props.type) ? l.props.data : []) : l.props.data
        return [...acc, events] as ApiEvent[]
      },
      []
    )
    const sortedEvents: ApiEvent[] = events
      .flat()
      .sort((a, b) => (a.start as number) - (b.start as number))
    return sortedEvents.map((e) => ({
      ...e,
      start: (e.start as number) + START_TIMESTAMP,
      ...(e.end && {
        end: (e.end as number) + START_TIMESTAMP,
      }),
    }))
  }

  getVesselTrackData() {
    return (
      this.getTrackLayer()
        ?.getSegments()
        .map(({ waypoints }) =>
          waypoints.map(({ coordinates, timestamp }) => ({
            coordinates,
            timestamp: timestamp + START_TIMESTAMP,
          }))
        ) || []
    )
  }
}
