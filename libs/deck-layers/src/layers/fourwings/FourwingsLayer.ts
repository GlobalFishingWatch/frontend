import { Color, CompositeLayer, Layer, LayersList, PickingInfo } from '@deck.gl/core/typed'
import { TileLayerProps } from '@deck.gl/geo-layers/typed'
import {
  FourwingsHeatmapTileLayerProps,
  FourwingsHeatmapTileLayer,
} from './FourwingsHeatmapTileLayer'
import {
  FourwingsPositionsTileLayer,
  FourwingsPositionsTileLayerProps,
} from './FourwingsPositionsTileLayer'
import { HEATMAP_ID, POSITIONS_ID } from './fourwings.config'

export type FourwingsLayerMode = typeof HEATMAP_ID | typeof POSITIONS_ID
export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = FourwingsPositionsTileLayerProps &
  FourwingsHeatmapTileLayerProps & {
    id: string
    category?: string
    mode?: FourwingsLayerMode
    hoveredFeatures?: PickingInfo[]
    clickedFeatures?: PickingInfo[]
  }

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'
  layers: FourwingsHeatmapTileLayer[] | FourwingsPositionsTileLayer[] | undefined

  renderLayers(): Layer<{}> | LayersList {
    const mode = this.getMode()

    this.layers =
      mode === HEATMAP_ID
        ? [new FourwingsHeatmapTileLayer(this.props)]
        : [
            new FourwingsPositionsTileLayer({
              ...this.props,
              clickedFeatures: this.props.clickedFeatures,
              hoveredFeatures: this.props.hoveredFeatures,
            }),
          ]
    return this.layers
  }

  getData() {
    return this.layers?.[0].getData()
  }

  getViewportData() {
    return this.layers?.[0].getViewportData()
  }

  getMode() {
    return this.props.mode || HEATMAP_ID
  }

  getResolution() {
    return this.props.resolution
  }

  getColorDomain() {
    return this.layers?.[0]?.getColorDomain()
  }

  getTimeseries() {
    return this.layers?.[0]?.getTimeseries()
  }
}
