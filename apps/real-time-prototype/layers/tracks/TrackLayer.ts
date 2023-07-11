import { Color, CompositeLayer, LayersList } from '@deck.gl/core/typed'
import { TripsLayer } from '@deck.gl/geo-layers/typed'
import { TripsLayerProps } from '@deck.gl/geo-layers/typed/trips-layer/trips-layer'
import { ScatterplotLayer } from '@deck.gl/layers'
import { ScatterplotLayerProps } from '@deck.gl/layers/typed'
import { RGBAColor } from '@deck.gl/core'
import { TrackPoint } from 'layers/tracks/tracks.hooks'
import { hexToComponents } from '@globalfishingwatch/layer-composer'
import { API_BASE } from 'data/config'
import { GFWLayerProps } from 'features/map/Map'
import { trackLoader } from './track.loader'

type TrackLayerProps = TripsLayerProps &
  ScatterplotLayerProps &
  GFWLayerProps & {
    color: string
    onSublayerLoad
  }

const LENGTH_IN_MILLIS = Math.floor(3.3 * 24 * 60 * 60 * 1000)

export class TrackLayer extends CompositeLayer<TrackLayerProps> {
  static layerName = 'TrackLayer'
  static defaultProps = {}

  initializeState() {
    super.initializeState(this.context)
    this.state = {
      data: [],
    }
  }

  renderLayers() {
    return [
      new ScatterplotLayer<TrackPoint>({
        id: `track-layer-${this.props.id}-points`,
        data: this.state.data?.[0],
        filled: true,
        getPosition: (d) => d.coordinates,
        pickable: true,
        radiusUnits: 'pixels',
        // getRadius: 3,
        getRadius: (d, context) => {
          const latestTime = context.data[context.data.length - 1].timestamp
          const maxTimeDifference = latestTime - context.data[0].timestamp
          return 4 - ((latestTime - d.timestamp) / maxTimeDifference) * 3
        },
        getFillColor: (d, context) => {
          const latestTime = context.data[context.data.length - 1].timestamp
          const maxTimeDifference = latestTime - context.data[0].timestamp
          return [
            ...hexToComponents(this.props.color),
            255 - ((latestTime - d.timestamp) / maxTimeDifference) * 255,
          ] as RGBAColor
        },
      }),
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
        onDataLoad: (d, c) => {
          this.props.onDataLoad(d, c)
          this.props.onSublayerLoad(this.props.id, d)
          this.setState({ data: d })
        },
        getPath: (_, context) => context.data[0].map((d) => d.coordinates),
        getTimestamps: (data) => data.map((d) => d.timestamp - data[0].timestamp),
        getColor: hexToComponents(this.props.color) as Color,
        capRounded: true,
        jointRounded: true,
        widthMinPixels: 3,
        fadeTrail: true,
        trailLength: LENGTH_IN_MILLIS,
        currentTime: LENGTH_IN_MILLIS,
      }),
    ] as LayersList
  }
}
