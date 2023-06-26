import { CompositeLayer } from '@deck.gl/core/typed'
import { LineLayerProps } from '@deck.gl/layers/typed'
import { GFWLayerProps } from 'features/map/Map'
import { TrackLayer } from './TrackLayer'

export type TracksLayerProps = LineLayerProps & GFWLayerProps & { ids: string[] }

export class TracksLayer extends CompositeLayer<TracksLayerProps> {
  static layerName = 'TracksLayer'

  renderLayers() {
    return this.props?.ids?.map((id: string) => {
      return new TrackLayer({
        id,
        token: this.props.token,
        lastUpdate: this.props.lastUpdate,
      })
    })
  }
}
