import { CompositeLayer } from '@deck.gl/core/typed'
import { LineLayerProps } from '@deck.gl/layers/typed'
import { TrackLayer } from './TrackLayer'

export type TracksLayerProps = LineLayerProps & { ids: string[] }

export class TracksLayer extends CompositeLayer<TracksLayerProps> {
  static layerName = 'TracksLayer'

  layers = this.props?.ids?.map((id: string) => {
    return new TrackLayer({
      id,
    })
  })

  renderLayers() {
    return this.props?.ids?.map((id: string) => {
      return new TrackLayer({
        id,
      })
    })
  }
}
