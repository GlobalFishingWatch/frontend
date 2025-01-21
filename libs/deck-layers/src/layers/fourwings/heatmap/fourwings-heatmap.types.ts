import type { PickingInfo } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { ScaleLinear } from 'd3-scale'

import type {
  Cell,
  FourwingsFeature,
  FourwingsFeatureProperties,
  FourwingsInterval,
  FourwingsStaticFeature,
} from '@globalfishingwatch/deck-loaders'

import type { DeckPickingObject } from '../../../types'
import type {
  BaseFourwingsLayerProps,
  FourwingsColorObject,
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
export type ColorRange = FourwingsColorObject[]
export type SublayerColorRanges = ColorRange[]

export type FourwingsHeatmapStaticPickingObject = DeckPickingObject<
  FourwingsStaticFeature & {
    sublayers: FourwingsDeckSublayer[]
  }
>
export type FourwingsHeatmapStaticPickingInfo = PickingInfo<FourwingsHeatmapStaticPickingObject>

export type FourwingsHeatmapPickingObject = FourwingsFeature<FourwingsFeatureProperties> &
  DeckPickingObject<{
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
  }>
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

export type FourwingsHeatmapResolution = 'low' | 'default' | 'high'
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
  zoom: number
  start: number
  bufferedStart: number
  end: number
  interval: FourwingsInterval
  compareStart?: number
  compareEnd?: number
}

export type FourwinsTileLayerScale = ScaleLinear<FourwingsColorObject, FourwingsColorObject, never>
export type FourwingsTileLayerState = {
  error: string
  tilesCache: FourwingsHeatmapTilesCache
  colorDomain: FourwingsTileLayerColorDomain
  colorRanges: FourwingsTileLayerColorRange
  comparisonMode?: FourwingsComparisonMode
  scales?: FourwinsTileLayerScale[]
  rampDirty?: boolean
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
