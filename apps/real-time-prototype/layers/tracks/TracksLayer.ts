import { CompositeLayer } from '@deck.gl/core'
import { LineLayerProps } from '@deck.gl/layers'
import { TrackSublayer } from 'layers/tracks/tracks.hooks'
import { GFWLayerProps } from 'features/map/Map'
import { TrackLayer } from './TrackLayer'

export type TracksLayerProps = LineLayerProps &
  GFWLayerProps & { sublayers: TrackSublayer[]; onSublayerLoad }

export class TracksLayer extends CompositeLayer<TracksLayerProps> {
  static layerName = 'TracksLayer'

  renderLayers() {
    return this.props?.sublayers?.flatMap((sublayer) => {
      if (sublayer.active) {
        return new TrackLayer({
          id: sublayer.id,
          token: this.props.token,
          lastUpdate: this.props.lastUpdate,
          color: sublayer.color,
          onSublayerLoad: this.props.onSublayerLoad,
          onDataLoad: this.props.onDataLoad,
        })
      }
      return []
    })
  }
}
