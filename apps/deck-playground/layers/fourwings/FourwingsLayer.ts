import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core/typed'
import { TileLayerProps } from '@deck.gl/geo-layers/typed'
import {
  FourwingsHeatmapTileLayerProps,
  FourwingsHeatmapTileLayer,
} from './FourwingsHeatmapTileLayer'
import {
  FourwingsPositionsTileLayer,
  FourwingsPositionsTileLayerProps,
} from './FourwingsPositionsTileLayer'

export const HEATMAP_ID = 'heatmap'
export const POSITIONS_ID = 'positions'

export type FourwingsLayerMode = typeof HEATMAP_ID | typeof POSITIONS_ID
export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = FourwingsPositionsTileLayerProps &
  FourwingsHeatmapTileLayerProps & {
    mode: FourwingsLayerMode
  }

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'
  layers: FourwingsHeatmapTileLayer[] | FourwingsPositionsTileLayer[] | undefined

  renderLayers(): Layer<{}> | LayersList {
    const mode = this.getMode()
    this.layers =
      mode === HEATMAP_ID
        ? [new FourwingsHeatmapTileLayer(this.props)]
        : [new FourwingsPositionsTileLayer(this.props)]
    return this.layers
  }

  getData() {
    return this.layers[0].getData()
  }

  getMode() {
    return this.props.mode || HEATMAP_ID
  }

  getResolution() {
    return this.props.resolution
  }

  getColorDomain() {
    return this.layers && this.layers[0]?.getColorDomain()
  }

  getTimeseries() {
    return this.layers && this.layers[0]?.getTimeseries()
  }
}
