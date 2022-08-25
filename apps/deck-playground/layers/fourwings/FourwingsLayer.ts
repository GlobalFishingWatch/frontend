import { CompositeLayer } from '@deck.gl/core/typed'
import { TileLayer } from '@deck.gl/geo-layers/typed'
import { fourwingsLayerLoader } from 'loaders/fourwings/fourwingsLayerLoader'
import { FourwingsTileLayer } from 'layers/fourwings/FourwingsTileLayer'

export type FourwingsLayerProps = {
  minFrame: number
  maxFrame: number
}

export const FOURWINGS_LAYER_ID = 'fourwings'
export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps> {
  layer = new TileLayer({
    id: FOURWINGS_LAYER_ID,
    data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2022-07-01,2022-08-25&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
    minZoom: 0,
    maxZoom: 8,
    tileSize: 256,
    loaders: [fourwingsLayerLoader],
    loadOptions: { worker: false },
    onTileLoad: () => {},
    renderSubLayers: (props) => {
      const { maxFrame, minFrame } = this.props
      return new FourwingsTileLayer({ maxFrame, minFrame, ...props })
    },
  })
  renderLayers() {
    return this.layer
  }
  getLayerData() {
    return this.layer
  }
}
