import { Color, CompositeLayer, Layer, LayerContext, LayersList } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { FourwingsHeatmapTileLayer } from './FourwingsHeatmapTileLayer'
import { FourwingsHeatmapStaticLayer } from './FourwingsHeatmapStaticLayer'
import { FourwingsPositionsTileLayer } from './FourwingsPositionsTileLayer'
import { HEATMAP_ID, HEATMAP_STATIC_ID, POSITIONS_ID } from './fourwings.config'
import {
  FourwingsHeatmapTileLayerProps,
  FourwingsPositionsTileLayerProps,
  FourwingsVisualizationMode,
} from './fourwings.types'

export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = FourwingsPositionsTileLayerProps &
  FourwingsHeatmapTileLayerProps & {
    id: string
    visualizationMode?: FourwingsVisualizationMode
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

  _onTileDataLoading = () => {
    this.setState({ loaded: false })
  }

  renderLayers(): Layer<{}> | LayersList {
    const visualizationMode = this.getMode()
    const HeatmapLayerClass = this.getSubLayerClass('heatmap', FourwingsHeatmapTileLayer)
    const HeatmapStaticLayerClass = this.getSubLayerClass('heatmap', FourwingsHeatmapStaticLayer)
    const PositionsLayerClass = this.getSubLayerClass('positions', FourwingsPositionsTileLayer)
    if (visualizationMode === POSITIONS_ID) {
      return new PositionsLayerClass(
        this.props,
        this.getSubLayerProps({
          id: POSITIONS_ID,
          onViewportLoad: this._onViewportLoad,
          onTileDataLoading: this._onTileDataLoading,
        })
      )
    }
    return this.props.static
      ? new HeatmapStaticLayerClass(
          this.props,
          this.getSubLayerProps({
            id: HEATMAP_STATIC_ID,
            onViewportLoad: this._onViewportLoad,
            onTileDataLoading: this._onTileDataLoading,
          })
        )
      : new HeatmapLayerClass(
          this.props,
          this.getSubLayerProps({
            id: HEATMAP_ID,
            onViewportLoad: this._onViewportLoad,
            onTileDataLoading: this._onTileDataLoading,
          })
        )
  }

  getData() {
    return this.getLayer()?.getData()
  }

  getViewportData() {
    return this.getLayer()?.getViewportData()
  }

  getMode() {
    return this.props.visualizationMode || HEATMAP_ID
  }

  getResolution() {
    return this.props.resolution
  }

  getLayer() {
    return this.getSubLayers()?.[0] as FourwingsHeatmapTileLayer | FourwingsPositionsTileLayer
  }

  getColorScale() {
    return this.getLayer()?.getColorScale()
  }

  getTimeseries() {
    return this.getLayer()?.getTimeseries()
  }
}
