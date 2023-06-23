import { CompositeLayer } from '@deck.gl/core/typed'
import { GeoJsonLayer, GeoJsonLayerProps } from '@deck.gl/layers/typed'

export class TrackLayer extends CompositeLayer<GeoJsonLayerProps> {
  static layerName = 'TrackLayer'
  static defaultProps = {}

  renderLayers() {
    console.log(`track-layer-${this.props.id}`)

    return [
      new GeoJsonLayer({
        id: `track-layer-${this.props.id}`,
        data: `./positions/track.geojson`,
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
