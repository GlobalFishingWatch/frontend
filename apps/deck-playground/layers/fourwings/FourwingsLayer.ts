import { CompositeLayer } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { fourwingsLayerLoader } from 'loaders/fourwings/fourwingsLayerLoader'
import { FourwingsTileLayer } from 'layers/fourwings/FourwingsTileLayer'
import { filterCellsByBounds } from 'layers/fourwings/fourwings.utils'

export type FourwingsLayerProps = {
  minFrame: number
  maxFrame: number
  onViewportLoad: TileLayerProps['onViewportLoad']
}

export const FOURWINGS_LAYER_ID = 'fourwings'
export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps> {
  layer = new TileLayer({
    id: FOURWINGS_LAYER_ID,
    data: 'https://gateway.api.dev.globalfishingwatch.org/v2/4wings/tile/heatmap/{z}/{x}/{y}?interval=day&date-range=2022-07-01,2022-08-25&format=intArray&temporal-aggregation=false&proxy=true&datasets[0]=public-global-fishing-effort:v20201001',
    minZoom: 0,
    maxZoom: 8,
    tileSize: 256,
    zoomOffset: -1,
    loaders: [fourwingsLayerLoader],
    loadOptions: { worker: false },
    onViewportLoad: this.props.onViewportLoad,
    renderSubLayers: (props) => {
      const { maxFrame, minFrame } = this.props
      return new FourwingsTileLayer({ maxFrame, minFrame, ...props })
    },
  })

  renderLayers() {
    return this.layer
  }

  getData() {
    return this.layer.getSubLayers().flatMap((l: FourwingsTileLayer) => l.getTileData())
  }

  getDataFilteredByViewport() {
    const data = this.getData()
    const { viewport } = this.context
    const [west, north] = viewport.unproject([0, 0])
    const [east, south] = viewport.unproject([viewport.width, viewport.height])
    const filter = filterCellsByBounds(data, { north, west, south, east })
    return filter
  }
}
