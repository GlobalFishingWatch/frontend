import { Color, CompositeLayer, Layer, LayerContext, LayersList } from '@deck.gl/core/typed'
import { TileLayerProps } from '@deck.gl/geo-layers/typed'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/typed/tileset-2d'
import { FourwingsHeatmapTileLayer } from './FourwingsHeatmapTileLayer'
import {
  FourwingsPositionsTileLayer,
  FourwingsPositionsTileLayerProps,
} from './FourwingsPositionsTileLayer'
import { HEATMAP_ID, POSITIONS_ID } from './fourwings.config'
import { FourwingsHeatmapTileLayerProps } from './fourwings.types'

export type FourwingsLayerMode = typeof HEATMAP_ID | typeof POSITIONS_ID
export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = FourwingsPositionsTileLayerProps &
  FourwingsHeatmapTileLayerProps & {
    id: string
    mode?: FourwingsLayerMode
  }

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'
  layers: FourwingsHeatmapTileLayer[] | FourwingsPositionsTileLayer[] | undefined

  initializeState(context: LayerContext): void {
    super.initializeState(context)
    this.state = {
      loaded: false,
    }
  }

  _onViewportLoad = (tiles: Tile2DHeader[]) => {
    this.setState({ loaded: true })
    this.props.onViewportLoad?.(tiles)
  }

  _onTileDataLoading = (tile: TileLoadProps) => {
    this.setState({ loaded: false })
  }

  renderLayers(): Layer<{}> | LayersList {
    const mode = this.getMode()
    const HeatmapLayerClass = this.getSubLayerClass('heatmap', FourwingsHeatmapTileLayer)
    const PositionsLayerClass = this.getSubLayerClass('positions', FourwingsPositionsTileLayer)
    this.layers =
      mode === HEATMAP_ID
        ? [
            new HeatmapLayerClass(
              this.props,
              this.getSubLayerProps({
                id: HEATMAP_ID,
                onViewportLoad: this._onViewportLoad,
                onTileDataLoading: this._onTileDataLoading,
              })
            ),
          ]
        : [
            new PositionsLayerClass(
              this.props,
              this.getSubLayerProps({
                id: POSITIONS_ID,
                onViewportLoad: this._onViewportLoad,
                onTileDataLoading: this._onTileDataLoading,
              })
            ),
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
