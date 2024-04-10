import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FourwingsHeatmapTileLayer } from './FourwingsHeatmapTileLayer'
import { FourwingsHeatmapStaticLayer } from './FourwingsHeatmapStaticLayer'
import { FourwingsPositionsTileLayer } from './FourwingsPositionsTileLayer'
import { HEATMAP_ID, HEATMAP_STATIC_ID, POSITIONS_ID } from './fourwings.config'
import {
  FourwingsChunk,
  FourwingsHeatmapStaticLayerProps,
  FourwingsHeatmapTileLayerProps,
  FourwingsPositionsTileLayerProps,
  FourwingsVisualizationMode,
} from './fourwings.types'

export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = FourwingsPositionsTileLayerProps &
  FourwingsHeatmapStaticLayerProps &
  FourwingsHeatmapTileLayerProps & {
    id: string
    visualizationMode?: FourwingsVisualizationMode
  }

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'

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
          onViewportLoad: this.props.onViewportLoad,
        })
      )
    }
    return this.props.static
      ? new HeatmapStaticLayerClass(
          this.props,
          this.getSubLayerProps({
            id: HEATMAP_STATIC_ID,
            onViewportLoad: this.props.onViewportLoad,
          })
        )
      : new HeatmapLayerClass(
          this.props,
          this.getSubLayerProps({
            id: HEATMAP_ID,
            onViewportLoad: this.props.onViewportLoad,
          })
        )
  }

  getData() {
    return this.getLayer()?.getData()
  }

  getInterval() {
    if (this.props.visualizationMode === HEATMAP_ID) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getInterval()
    }
    return '' as FourwingsInterval
  }

  getChunk() {
    if (this.props.visualizationMode === HEATMAP_ID) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getChunk()
    }
    return {} as FourwingsChunk
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
