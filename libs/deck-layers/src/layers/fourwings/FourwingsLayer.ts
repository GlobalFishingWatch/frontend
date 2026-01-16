import type { Color } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type { FourwingsFootprintTileLayerProps } from './footprint/fourwings-footprint.types'
import { FourwingsFootprintTileLayer } from './footprint/FourwingsFootprintTileLayer'
import type {
  FourwingsChunk,
  FourwingsHeatmapStaticLayerProps,
  FourwingsHeatmapTileLayerProps,
} from './heatmap/fourwings-heatmap.types'
import {
  getResolutionByVisualizationMode,
  getZoomOffsetByResolution,
} from './heatmap/fourwings-heatmap.utils'
import { FourwingsHeatmapStaticLayer } from './heatmap/FourwingsHeatmapStaticLayer'
import { FourwingsHeatmapTileLayer } from './heatmap/FourwingsHeatmapTileLayer'
import type { FourwingsPositionsTileLayerProps } from './positions/fourwings-positions.types'
import { FourwingsPositionsTileLayer } from './positions/FourwingsPositionsTileLayer'
import { FOOTPRINT_HIGH_RES_ID, FOOTPRINT_ID, HEATMAP_ID, POSITIONS_ID } from './fourwings.config'
import type {
  FourwingsPickingObject,
  FourwingsVisualizationMode,
  GetViewportDataParams,
} from './fourwings.types'

export type FourwingsColorRamp = {
  colorDomain: number[]
  colorRange: Color[]
}

export type FourwingsLayerProps = Omit<
  FourwingsPositionsTileLayerProps &
    FourwingsHeatmapStaticLayerProps &
    FourwingsHeatmapTileLayerProps &
    FourwingsFootprintTileLayerProps & {
      id: string
      visualizationMode?: FourwingsVisualizationMode
    },
  'resolution' | 'highlightedFeatures'
> & {
  highlightedFeatures?: FourwingsPickingObject[]
}

type AnyFourwingsLayer =
  | FourwingsPositionsTileLayer
  | FourwingsHeatmapTileLayer
  | FourwingsFootprintTileLayer
  | FourwingsHeatmapStaticLayer

export class FourwingsLayer extends CompositeLayer<FourwingsLayerProps & TileLayerProps> {
  static layerName = 'FourwingsLayer'

  get cacheHash(): string {
    return (this.getSubLayers() as AnyFourwingsLayer[])?.map((layer) => layer.cacheHash).join('-')
  }

  get isHeatmapVisualizationMode(): boolean {
    return (
      this.props.visualizationMode !== undefined &&
      (this.props.visualizationMode?.includes(HEATMAP_ID) ||
        this.props.visualizationMode?.includes(FOOTPRINT_ID))
    )
  }

  get debounceTime() {
    return this.getLayer()?.debounceTime || 0
  }

  forceUpdate() {
    this.getLayer()?.forceUpdate?.()
  }

  renderLayers(): AnyFourwingsLayer {
    const visualizationMode = this.getMode()
    const resolution = getResolutionByVisualizationMode(visualizationMode)
    if (visualizationMode === POSITIONS_ID) {
      const PositionsLayerClass = this.getSubLayerClass('positions', FourwingsPositionsTileLayer)
      return new PositionsLayerClass(
        this.props,
        this.getSubLayerProps({
          id: POSITIONS_ID,
          onViewportLoad: this.props.onViewportLoad,
        })
      )
    }
    if (visualizationMode === FOOTPRINT_ID || visualizationMode === FOOTPRINT_HIGH_RES_ID) {
      const FootprintLayerClass = this.getSubLayerClass('footprint', FourwingsFootprintTileLayer)
      return new FootprintLayerClass(
        this.props,
        this.getSubLayerProps({
          id: visualizationMode,
          resolution,
          onViewportLoad: this.props.onViewportLoad,
        })
      )
    }
    const HeatmapLayerClass = this.props.static
      ? this.getSubLayerClass(resolution, FourwingsHeatmapStaticLayer)
      : this.getSubLayerClass(resolution, FourwingsHeatmapTileLayer)

    return new HeatmapLayerClass(
      this.props,
      this.getSubLayerProps({
        id: resolution,
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

  getError() {
    return this.getLayer()?.getError()
  }

  getIsPositionsAvailable() {
    if (this.props.visualizationMode?.includes(HEATMAP_ID)) {
      const heatmapLayer = this.getLayer() as FourwingsHeatmapTileLayer
      if (!heatmapLayer?.isLoaded) {
        return false
      }
      return heatmapLayer?.getIsPositionsAvailable()
    }
    return this.props.visualizationMode === POSITIONS_ID
  }

  getInterval() {
    if (this.isHeatmapVisualizationMode && !this.props.static) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getInterval()
    }
    return '' as FourwingsInterval
  }

  getVisualizationMode() {
    return this.props.visualizationMode || HEATMAP_ID
  }

  getAggregationOperation() {
    return this.props.aggregationOperation
  }

  getChunk() {
    if (this.isHeatmapVisualizationMode && !this.props.static) {
      return (this.getLayer() as FourwingsHeatmapTileLayer)?.getChunk()
    }
    return {} as FourwingsChunk
  }

  getViewportData(params = {} as GetViewportDataParams) {
    return this.getLayer()?.getViewportData?.(params)
  }

  getMode() {
    return this.props.visualizationMode || HEATMAP_ID
  }

  getResolution() {
    return getResolutionByVisualizationMode(this.props.visualizationMode)
  }

  getZoomOffset() {
    const resolution = getResolutionByVisualizationMode(this.props.visualizationMode)
    return getZoomOffsetByResolution(resolution, this.context.viewport.zoom)
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
