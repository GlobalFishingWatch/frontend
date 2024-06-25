import { Color, CompositeLayer, Layer, LayersList } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { FourwingsHeatmapTileLayer } from './heatmap/FourwingsHeatmapTileLayer'
import { FourwingsHeatmapStaticLayer } from './heatmap/FourwingsHeatmapStaticLayer'
import { FourwingsPositionsTileLayer } from './positions/FourwingsPositionsTileLayer'
import {
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_STATIC_ID,
  MAX_POSITIONS_PER_TILE_SUPPORTED,
  POSITIONS_ID,
} from './fourwings.config'
import { FourwingsPickingObject, FourwingsVisualizationMode } from './fourwings.types'
import { FourwingsPositionsTileLayerProps } from './positions/fourwings-positions.types'
import {
  FourwingsChunk,
  FourwingsHeatmapStaticLayerProps,
  FourwingsHeatmapTileLayerProps,
} from './heatmap/fourwings-heatmap.types'
import { getResolutionByVisualizationMode } from './heatmap/fourwings-heatmap.utils'

export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = Omit<
  FourwingsPositionsTileLayerProps &
    FourwingsHeatmapStaticLayerProps &
    FourwingsHeatmapTileLayerProps & {
      id: string
      visualizationMode?: FourwingsVisualizationMode
    },
  'resolution' | 'highlightedFeatures'
> & {
  highlightedFeatures?: FourwingsPickingObject[]
}

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'

  renderLayers(): Layer<{}> | LayersList {
    const visualizationMode = this.getMode()
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
    let resolution = getResolutionByVisualizationMode(visualizationMode)
    const HeatmapLayerClass = this.props.static
      ? this.getSubLayerClass(HEATMAP_STATIC_ID, FourwingsHeatmapStaticLayer)
      : this.getSubLayerClass(resolution, FourwingsHeatmapTileLayer)

    return new HeatmapLayerClass(
      this.props,
      this.getSubLayerProps({
        id: HEATMAP_STATIC_ID,
        resolution,
        onViewportLoad: this.props.onViewportLoad,
      })
    )
  }

  setHighlightedVessel(vesselId: string | string[] | undefined) {
    const layer = this.getLayer()
    if (layer instanceof FourwingsPositionsTileLayer) {
      return layer?.setHighlightedVessel(vesselId)
    }
  }

  getData() {
    return this.getLayer()?.getData()
  }

  getIsPositionsAvailable() {
    if (this.props.visualizationMode?.includes(HEATMAP_ID)) {
      const heatmapLayer = this.getLayer() as FourwingsHeatmapTileLayer
      if (!heatmapLayer.isLoaded) {
        return false
      }
      const tileStats = heatmapLayer?.getTilesStats()
      if (!tileStats.length) {
        return false
      }
      return tileStats.every((tileStat) => tileStat.count < MAX_POSITIONS_PER_TILE_SUPPORTED)
    }
    return this.props.visualizationMode === POSITIONS_ID
  }

  getInterval() {
    if (this.props.visualizationMode?.includes(HEATMAP_ID) && !this.props.static) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getInterval()
    }
    return '' as FourwingsInterval
  }

  getVisualizationMode() {
    return this.props.visualizationMode || HEATMAP_ID
  }

  getChunk() {
    if (this.props.visualizationMode?.includes(HEATMAP_ID) && !this.props.static) {
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
    return getResolutionByVisualizationMode(this.props.visualizationMode)
  }

  getLayer() {
    return this.getSubLayers()?.[0] as FourwingsHeatmapTileLayer | FourwingsPositionsTileLayer
  }

  getColorScale() {
    return this.getLayer()?.getColorScale()
  }

  getFourwingsLayers() {
    return this.getLayer()?.getFourwingsLayers()
  }

  getTimeseries() {
    return this.getLayer()?.getTimeseries()
  }
}
