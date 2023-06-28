import { Color, CompositeLayer } from '@deck.gl/core/typed'
import { TripsLayer } from '@deck.gl/geo-layers/typed'
import { TripsLayerProps } from '@deck.gl/geo-layers/typed/trips-layer/trips-layer'
import { hexToComponents } from '@globalfishingwatch/layer-composer'
import { API_BASE } from 'data/config'
import { GFWLayerProps } from 'features/map/Map'
import { trackLoader } from './track.loader'

type TrackLayerProps = TripsLayerProps &
  GFWLayerProps & {
    color: string
    onSublayerLoad
  }

const LENGTH_IN_MILLIS = Math.floor(3.3 * 24 * 60 * 60 * 1000)

export class TrackLayer extends CompositeLayer<TrackLayerProps> {
  static layerName = 'TrackLayer'
  static defaultProps = {}

  renderLayers() {
    return [
      new TripsLayer({
        id: `track-layer-${this.props.id}`,
        data: `${API_BASE}/realtime-tracks/${this.props.id}?start-date=${this.props.lastUpdate}&format=points`,
        loadOptions: {
          fetch: {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          },
        },
        loaders: [trackLoader],
        onDataLoad: (d) => {
          this.props.onSublayerLoad(this.props.id, d[0].path)
        },
        getPath: (d) => {
          return d.path
        },
        getTimestamps: (d) => {
          return d?.timestamps.map((t, _, array) => t - array[0])
        },
        getColor: () => {
          return hexToComponents(this.props.color) as Color
        },
        capRounded: true,
        jointRounded: true,
        widthMinPixels: 3,
        fadeTrail: true,
        trailLength: LENGTH_IN_MILLIS * 1.2,
        currentTime: LENGTH_IN_MILLIS,
      }),
    ]
  }
}
