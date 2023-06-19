import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps, Color } from '@deck.gl/core/typed'
// Layers
import { ApiEvent, EventTypes, EventVessel, Segment } from '@globalfishingwatch/api-types'
import { parquetLoader } from '../../loaders/vessels/trackLoader'
import { VesselDeckLayersEventData, vesselEventsLoader } from '../../loaders/vessels/eventsLoader'
import { START_TIMESTAMP } from '../../loaders/constants'
import { VesselDeckLayersEvent } from '../../layer-composer/types/vessel'
import { deckToHexColor } from '../../utils/colors'
import { EVENTS_COLORS, VesselEventsLayer, _VesselEventsLayerProps } from './VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from './VesselTrackLayer'

export type VesselEventsLayerProps = _VesselEventsLayerProps & { events: VesselDeckLayersEvent[] }
export type VesselLayerProps = _VesselTrackLayerProps &
  VesselEventsLayerProps & { name: string; color: Color; layersLoaded: string[] }

export const TRACK_LAYER_PREFIX = 'track'
export const EVENTS_LAYER_PREFIX = 'events'
export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  layersLoaded: string[] = []
  layers: Layer[] = []
  data = []

  onSublayerLoad: LayerProps['onDataLoad'] = (data, context) => {
    const vesselLayer = context.layer.parent as VesselLayer
    vesselLayer?.layersLoaded?.push(context.layer.id)
    const isLastLayer = vesselLayer?.layersLoaded?.length === vesselLayer?.layers.length - 1
    if (isLastLayer) {
      vesselLayer?.props.onDataLoad && vesselLayer?.props?.onDataLoad(data, context)
    }
  }

  _getVesselTrackLayer() {
    return new VesselTrackLayer<any>({
      id: `${TRACK_LAYER_PREFIX}-vessel-layer-${this.props.id}`,
      data: this.props.trackUrl,
      loaders: [parquetLoader],
      widthUnits: 'pixels',
      onDataLoad: this.onSublayerLoad,
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
  }

  _getVesselEventsLayer(): VesselEventsLayer[] {
    const { visible, id, visibleEvents, startTime, endTime, highlightEventIds } = this.props
    // return one layer with all events if we are consuming the data object from app resources
    return this.props.events?.map(({ url, type, data }, index) => {
      return new VesselEventsLayer<VesselDeckLayersEventData[]>({
        id: `${EVENTS_LAYER_PREFIX}-${id}-${index}`,
        data: url || data,
        visible,
        type,
        onDataLoad: this.onSublayerLoad,
        loaders: [vesselEventsLoader],
        pickable: true,
        // name,
        // startTime: startTime,
        // endTime: endTime,
        visibleEvents: visibleEvents,
        getFillColor: (d: any): Color => {
          if (highlightEventIds?.includes(d.id)) {
            return EVENTS_COLORS.highlight
          }
          return d.type === EventTypes.Fishing ? this.props.color : EVENTS_COLORS[d.type]
        },
        // TODO add line border to highlight event
        // getLineColor: (d: any): Color =>
        //   d.id === this.props.highlightEventId ? [255, 255, 255, 255] : [0, 0, 0, 0],
        getEventVisibility: (d: VesselDeckLayersEventData) =>
          visibleEvents?.includes(d.type) ? 1 : 0,
        updateTriggers: {
          getEventVisibility: [visibleEvents],
          getFillColor: [this.props.highlightEventIds],
        },
        radiusMinPixels: 15,
        getFilterValue: (d: VesselDeckLayersEventData) => [d.start, d.end] as any,
        filterRange: [[startTime, endTime] as any, [startTime, endTime] as any],
        extensions: [new DataFilterExtension({ filterSize: 2 }) as any],
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
    return events.map((e) => ({
      ...e,
      start: (e.start as number) + START_TIMESTAMP,
      ...(e.end && {
        end: (e.end as number) + START_TIMESTAMP,
      }),
    }))
  }

  getVesselTrackData() {
    return this.getTrackLayer()?.getData()
  }

  getVesselTrackSegments() {
    return this.getTrackLayer()?.getSegments()
  }
}
