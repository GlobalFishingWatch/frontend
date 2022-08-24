import { CompositeLayer } from '@deck.gl/core/typed'
import { VesselTrackLayer, _VesselTrackLayerProps } from 'layers/vessel/VesselTrackLayer'
import { trackLoader } from 'loaders/trackLoader'

export type VesselLayerProps = _VesselTrackLayerProps

export class VesselLayer extends CompositeLayer<VesselLayerProps> {
  trackLayer = new VesselTrackLayer({
    id: `vessel-layer-${this.props.id}`,
    data: `https://gateway.api.dev.globalfishingwatch.org/v2/vessels/${this.props.id}/tracks?binary=true&fields=lonlat%2Ctimestamp&format=valueArray&distance-fishing=50&bearing-val-fishing=1&change-speed-fishing=10&min-accuracy-fishing=2&distance-transit=100&bearing-val-transit=1&change-speed-transit=10&min-accuracy-transit=10&datasets=public-global-fishing-tracks%3Av20201001`,
    loaders: [trackLoader()],
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
    // pickable: true,
    getColor: (d) => {
      return d.waypoints.map((p) => {
        if (
          p.timestamp >= this.props.highlightStartTime &&
          p.timestamp <= this.props.highlightEndTime
        ) {
          return [255, 0, 0, 100]
        }
        return [255, 255, 255, 30]
      })
    },
    // getWidth: (d) => {
    //   return d.waypoints.map((p) =>
    //     p.timestamp >= minHighlightedFrame &&
    //     p.timestamp <= maxHighlightedFrame
    //       ? 2
    //       : 1
    //   );
    // },
    width: 1,
    updateTriggers: {
      getColor: [this.props.highlightStartTime, this.props.highlightEndTime],
      // getWidth: [minHighlightedFrame, maxHighlightedFrame],
    },
    startTime: this.props.startTime,
    endTime: this.props.endTime,
  })
  renderLayers(): VesselTrackLayer {
    return this.trackLayer
  }
  getTrackLayer() {
    return this.trackLayer
  }
}
