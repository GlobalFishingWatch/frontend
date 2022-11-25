import { DataFilterExtension } from '@deck.gl/extensions'
import { CompositeLayer, Layer, LayersList, LayerProps } from '@deck.gl/core/typed'
// Layers
import { VesselEventsLayer, _VesselEventsLayerProps } from 'layers/vessel/VesselEventsLayer'
import { VesselTrackLayer, _VesselTrackLayerProps } from 'layers/vessel/VesselTrackLayer'
// Loaders
import { trackLoader } from 'loaders/vessels/trackLoader'
import { vesselEventsLoader } from 'loaders/vessels/eventsLoader'

export type VesselLayerProps = _VesselTrackLayerProps & _VesselEventsLayerProps

export class VesselLayer extends CompositeLayer<VesselLayerProps & LayerProps> {
  layersLoaded: string[] = []

  onDataLoad: LayerProps['onDataLoad'] = (data, context) => {
    this.layersLoaded = [...this.layersLoaded, 'loaded']
    const eventsLayersArray = this.getVesselEventsLayers()
    if (this.layersLoaded.length === eventsLayersArray.length) {
      this.props.onDataLoad(data, context)
    }
  }

  _getVesselTrackLayer() {
    return new VesselTrackLayer(
      this.getSubLayerProps({
        id: `vessel-layer-${this.props.id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/vessels/${this.props.id}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&distance-fishing=500&bearing-val-fishing=1&change-speed-fishing=200&min-accuracy-fishing=30&distance-transit=500&bearing-val-transit=1&change-speed-transit=200&min-accuracy-transit=30&datasets=public-global-fishing-tracks%3Av20201001`,
        loaders: [trackLoader],
        getPath: (d) => {
          return d.waypoints.map((p) => p.coordinates)
        },
        getTimestamps: (d) => {
          // console.log('timestamps', d.waypoints.map(p => p.timestamp - 1465864039000));
          // deduct start timestamp from each data point to avoid overflow
          return d.waypoints.map((p) => p.timestamp)
        },
        widthUnits: 'pixels',
        widthScale: 1,
        wrapLongitude: true,
        jointRounded: true,
        capRounded: true,
        // loadOptions: {
        //   worker: false,
        //   fetch: {
        //     headers: {
        //       Authorization: `Bearer ${API_TOKEN}`,
        //     },
        //   },
        // },
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
          // getWidth: [minHighlightedFrame, maxHighlightedFrame],
        },
        startTime: this.props.startTime,
        endTime: this.props.endTime,
      })
    )
  }

  _getVesselFishingEventsLayer() {
    return new VesselEventsLayer(
      this.getSubLayerProps({
        id: `fishing-${this.props.id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/events?limit=99999&offset=0&vessels=${this.props.id}&summary=true&datasets=public-global-fishing-events%3Av20201001`,
        loaders: [vesselEventsLoader],
        eventType: 'fishing',
        pickable: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        onEventsDataLoad: this.onDataLoad,
        filterRange: [this.props.startTime, this.props.endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      })
    )
  }

  _getVesselPortVisitEventsLayer() {
    return new VesselEventsLayer(
      this.getSubLayerProps({
        id: `port-visits-${this.props.id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/events?limit=99999&offset=0&vessels=${this.props.id}&summary=true&confidences=4&datasets=public-global-port-visits-c2-events%3Av20201001`,
        loaders: [vesselEventsLoader],
        eventType: 'port-visit',
        pickable: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        onEventsDataLoad: this.onDataLoad,
        filterRange: [this.props.startTime, this.props.endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      })
    )
  }

  _getVesselEncounterEventsLayer() {
    return new VesselEventsLayer(
      this.getSubLayerProps({
        id: `encounters-${this.props.id}`,
        data: `https://gateway.api.dev.globalfishingwatch.org/v2/events?limit=99999&offset=0&vessels=${this.props.id}&summary=true&datasets=public-global-encounters-events%3Av20201001`,
        loaders: [vesselEventsLoader],
        eventType: 'encounters',
        pickable: true,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        onEventsDataLoad: this.onDataLoad,
        filterRange: [this.props.startTime, this.props.endTime],
        extensions: [new DataFilterExtension({ filterSize: 1 })],
      })
    )
  }

  renderLayers(): Layer<{}> | LayersList {
    return [
      this._getVesselFishingEventsLayer(),
      this._getVesselPortVisitEventsLayer(),
      this._getVesselEncounterEventsLayer(),
      this._getVesselTrackLayer(),
    ]
  }

  getTrackLayer() {
    return this._getVesselTrackLayer()
  }

  getVesselsData() {
    return this.getSubLayers().map((l) => l.props.data)
  }

  getVesselEventsLayers() {
    return [
      this._getVesselFishingEventsLayer(),
      this._getVesselPortVisitEventsLayer(),
      this._getVesselEncounterEventsLayer(),
    ]
  }

  getVesselEventsData() {
    const events = this.getSubLayers().reduce((acc, l) => {
      const events = l.props.eventType ? l.props.data : []
      return [...acc, events]
    }, [])
    const sortedEvents = events.flat().sort((a, b) => a.start - b.start)
    return sortedEvents
  }

  getVesselTrackData() {
    return this.getSubLayers().reduce((acc, l) => {
      if (!l.props.eventType) {
        return [...acc, l.props.data]
      }
      return acc
    }, [])[0]
  }
}
