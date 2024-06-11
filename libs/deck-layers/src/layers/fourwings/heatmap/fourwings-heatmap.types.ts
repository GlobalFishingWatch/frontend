import { PickingInfo } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ScaleLinear } from 'd3-scale'
import {
  FourwingsFeature,
  FourwingsStaticFeature,
  FourwingsFeatureProperties,
  FourwingsInterval,
  Cell,
} from '@globalfishingwatch/deck-loaders'
import { BasePickingObject } from '../../../types'
import {
  BaseFourwingsLayerProps,
  FourwingsDeckSublayer,
  FourwingsTileLayerColorDomain,
  FourwingsTileLayerColorRange,
  FourwingsVisualizationMode,
} from '../fourwings.types'

export type FourwingsChunk = {
  id: string
  interval: FourwingsInterval
  start: number
  end: number
  bufferedStart: number
  bufferedEnd: number
}

export enum FourwingsAggregationOperation {
  Sum = 'sum',
  Avg = 'avg',
}

export enum FourwingsComparisonMode {
  // Pick sublayer with highest value and place across this sublayer's color ramp. Works with 0 - n sublayers
  Compare = 'compare',
  // Place values on a 2D bivariate scale where the two axis represent the two sublayers. Works only with 2 sublayers
  Bivariate = 'bivariate',
  // Compare between two time periods. Applies to all visible activity layers.
  TimeCompare = 'timeCompare',
}

export type ColorDomain = number[] | number[][]
export type ColorRange = string[]
export type SublayerColorRanges = ColorRange[]

export type FourwingsHeatmapStaticPickingObject = BasePickingObject &
  FourwingsStaticFeature & {
    sublayers: FourwingsDeckSublayer[]
  }
export type FourwingsHeatmapStaticPickingInfo = PickingInfo<FourwingsHeatmapStaticPickingObject>

export type FourwingsHeatmapPickingObject = FourwingsFeature<FourwingsFeatureProperties> &
  BasePickingObject & {
    title: string
    color?: string
    tile: { x: number; y: number; z: number }
    startTime: number
    endTime: number
    interval: FourwingsInterval
    value?: number
    sublayers: FourwingsDeckSublayer[]
    visualizationMode?: FourwingsVisualizationMode
    comparisonMode?: FourwingsComparisonMode
  }
export type FourwingsHeatmapPickingInfo = PickingInfo<FourwingsHeatmapPickingObject>

export type AggregateCellParams = {
  cellValues: Cell
  startFrame: number
  endFrame: number
  aggregationOperation?: FourwingsAggregationOperation
  cellStartOffsets: number[]
}

export type CompareCellParams = {
  cellValues: Cell
  aggregationOperation?: FourwingsAggregationOperation
}

export type FourwingsHeatmapResolution = 'default' | 'high'
export type FourwingsHeatmapTileData = FourwingsFeature[]

export type _FourwingsHeatmapTileLayerProps<DataT = FourwingsFeature> = BaseFourwingsLayerProps & {
  data?: DataT
  static?: boolean
  availableIntervals?: FourwingsInterval[]
  resolution?: FourwingsHeatmapResolution
  colorRampWhiteEnd?: boolean
  minVisibleValue?: number
  maxVisibleValue?: number
  comparisonMode?: FourwingsComparisonMode
  compareStart?: number
  compareEnd?: number
  aggregationOperation?: FourwingsAggregationOperation
  highlightedFeatures?: FourwingsHeatmapPickingObject[]
}

export type FourwingsHeatmapTileLayerProps = _FourwingsHeatmapTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsHeatmapTilesCache = {
  start: number
  bufferedStart: number
  end: number
  interval: FourwingsInterval
}

export type FourwinsTileLayerScale = ScaleLinear<string, string, never>
export type FourwingsTileLayerState = {
  tilesCache: FourwingsHeatmapTilesCache
  colorDomain: FourwingsTileLayerColorDomain
  colorRanges: FourwingsTileLayerColorRange
  comparisonMode?: FourwingsComparisonMode
  scales?: FourwinsTileLayerScale[]
}

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourwingsFeature[]
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
  tilesCache: FourwingsHeatmapTilesCache
  scales: FourwinsTileLayerScale[]
}

export type _FourwingsHeatmapStaticLayerProps = Omit<
  _FourwingsHeatmapTileLayerProps,
  'data' | 'availableIntervals' | 'comparisonMode' | 'highlightedFeatures'
> & {
  highlightedFeatures: FourwingsHeatmapStaticPickingObject[]
}

export type FourwingsHeatmapStaticLayerProps = _FourwingsHeatmapStaticLayerProps &
  Partial<TileLayerProps>