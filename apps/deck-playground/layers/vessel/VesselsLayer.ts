import { CompositeLayer, Layer, LayerProps } from '@deck.gl/core/typed'
import { DataFilterExtension } from '@deck.gl/extensions'
// Layers
import { VesselEventsLayer, _VesselEventsLayerProps } from 'layers/vessel/VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from 'layers/vessel/VesselTrackLayer'
// Loaders
import { trackLoader } from 'loaders/vessels/trackLoader'
import { vesselEventsLoader } from 'loaders/vessels/eventsLoader'
import { Segment } from '@globalfishingwatch/api-types'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { VesselLayerEvent } from 'types'

export type VesselLayerProps = _VesselTrackLayerProps & _VesselEventsLayerProps

export const TRACK_LAYER_PREFIX = 'track'
export const EVENTS_LAYER_PREFIX = 'events'

export type VesselsLayerProps = { ids: string[] } & VesselLayerProps

export class VesselsLayer extends CompositeLayer<VesselsLayerProps> {
  layersLoaded: Layer[] = []

  onDataLoad: LayerProps['onDataLoad'] = (data, context) => {
    this.layersLoaded = [...this.layersLoaded, context.layer]
    if (this.layersLoaded.length === this.vesselLayers.length/this.props.ids.length) {
      this.props.onDataLoad(data, context)
    }
  }

  vesselLayers: (VesselTrackLayer | VesselEventsLayer)[] = this.props.ids.flatMap((id) => [
    new VesselTrackLayer<Segment[]>(
      this.getSubLayerProps({
        id: `${TRACK_LAYER_PREFIX}-vessel-layer-${id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/vessels/${id}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&distance-fishing=500&bearing-val-fishing=1&change-speed-fishing=200&min-accuracy-fishing=30&distance-transit=500&bearing-val-transit=1&change-speed-transit=200&min-accuracy-transit=30&datasets=public-global-fishing-tracks%3Av20201001`,
        loaders: [trackLoader],
        widthUnits: 'pixels',
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        layerZIndex: GROUP_ORDER.indexOf(Group.Track),
        onDataLoad: this.onDataLoad,
        getColor: (d) => {
          return d.waypoints.map((p) => {
            if (
              p.timestamp >= this.props.highlightStartTime &&
              p.timestamp <= this.props.highlightEndTime
            ) {
              return [255, 0, 0, 100]
            }
            return [255, 255, 255, 100]
          })
        },
        getWidth: 3,
        updateTriggers: {
          getColor: [this.props.highlightStartTime, this.props.highlightEndTime],
        },
        startTime: this.props.startTime,
        endTime: this.props.endTime,
      })
    ),
    new VesselEventsLayer(
      this.getSubLayerProps({
        id: `${EVENTS_LAYER_PREFIX}-fishing-${id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/events?limit=99999&offset=0&vessels=${id}&summary=true&datasets=public-global-fishing-events%3Av20201001`,
        loaders: [vesselEventsLoader],
        eventType: 'fishing',
        pickable: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        onDataLoad: this.onDataLoad,
        layerZIndex: GROUP_ORDER.indexOf(Group.Point),
        filterRange: [this.props.startTime, this.props.endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      })
    ),
    new VesselEventsLayer(
      this.getSubLayerProps({
        id: `${EVENTS_LAYER_PREFIX}-port-visits-${id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/events?limit=99999&offset=0&vessels=${id}&summary=true&confidences=4&datasets=public-global-port-visits-c2-events%3Av20201001`,
        loaders: [vesselEventsLoader],
        eventType: 'port-visit',
        pickable: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        onDataLoad: this.onDataLoad,
        layerZIndex: GROUP_ORDER.indexOf(Group.Point),
        filterRange: [this.props.startTime, this.props.endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      })
    ),
    new VesselEventsLayer(
      this.getSubLayerProps({
        id: `${EVENTS_LAYER_PREFIX}-encounters-${id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/events?limit=99999&offset=0&vessels=${id}&summary=true&datasets=public-global-encounters-events%3Av20201001`,
        loaders: [vesselEventsLoader],
        eventType: 'encounters',
        pickable: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        onDataLoad: this.onDataLoad,
        layerZIndex: GROUP_ORDER.indexOf(Group.Point),
        filterRange: [this.props.startTime, this.props.endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      })
    )
  ])

  renderLayers(): (VesselEventsLayer | VesselTrackLayer)[] {
    return this.vesselLayers
  }

  getLayers(): (VesselEventsLayer | VesselTrackLayer)[] {
    return this.vesselLayers
  }

  getVesselLayersById(id: string): (VesselEventsLayer | VesselTrackLayer)[] {
    return this.vesselLayers.filter((l) => l.id === id)
  }

  getVesselEventsDataById(id: string) {
    return this.vesselLayers
      .filter((l) => l.id.includes(EVENTS_LAYER_PREFIX))
      .filter((l) => l.id.includes(id))
      .reduce((acc, l: VesselEventsLayer) => [...acc, ...l.props.data as VesselLayerEvent[]], [])
  }

  getVesselTrackDataById(id: string) {
    return this.vesselLayers
      .filter((l) => l.id.includes(TRACK_LAYER_PREFIX))
      .filter((l) => l.id.includes(id))
      .flatMap((l: VesselTrackLayer) => l.props.data) 
  }
}
