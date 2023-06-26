import { CompositeLayer } from '@deck.gl/core/typed'
import { GeoJsonLayer, GeoJsonLayerProps } from '@deck.gl/layers/typed'
import { API_BASE } from 'data/config'
import { GFWLayerProps } from 'features/map/Map'

type TrackLayerProps = GeoJsonLayerProps & GFWLayerProps

export class TrackLayer extends CompositeLayer<TrackLayerProps> {
  static layerName = 'TrackLayer'
  static defaultProps = {}

  renderLayers() {
    console.log(`track-layer-${this.props.id}`)

    return [
      new GeoJsonLayer({
        id: `track-layer-${this.props.id}`,
        data: `${API_BASE}/realtime-tracks/${this.props.id}?start-date=${this.props.lastUpdate}&format=lines`,
        loadOptions: {
          fetch: {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.props.token}`,
            },
          },
        },
        getLineColor: [255, 255, 255, 255],
        getFillColor: [0, 0, 0, 0],
        lineWidthMinPixels: 1,
        rounded: true,
        fadeTrail: true,
        trailLength: 200,
      }),
    ]
  }
}
