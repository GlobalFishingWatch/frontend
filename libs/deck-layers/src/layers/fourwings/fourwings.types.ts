import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/typed/tileset-2d'
import { Color, PickingInfo } from '@deck.gl/core/typed'
import { TileLayerProps } from '@deck.gl/geo-layers/typed'
import { ColorRampsIds } from '@globalfishingwatch/layer-composer'
import { FourWingsFeature, Interval } from '@globalfishingwatch/deck-loaders'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string

export interface FourwingsDeckSublayer {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  visible: boolean
  config: {
    color: string
    colorRamp: ColorRampsIds
    visible?: boolean
  }
  // filter?: string
  // vesselGroups?: string
  // legend?: GeneratorLegend
  // availableIntervals?: Interval[]
}

export type Chunk = {
  id: string
  interval: Interval
  start: number
  end: number
  bufferedStart: number
  bufferedEnd: number
}

export enum HeatmapAnimatedMode {
  // Pick sublayer with highest value and place across this sublayer's color ramp. Works with 0 - n sublayers
  Compare = 'compare',
  // Place values on a 2D bivariate scale where the two axis represent the two sublayers. Works only with 2 sublayers
  Bivariate = 'bivariate',
  // Compare between two time periods. Applies to all visible activity layers.
  TimeCompare = 'timeCompare',
}

export type ColorDomain = number[]
export type ColorRange = Color[]
export type SublayerColorRanges = ColorRange[]

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourWingsFeature[]
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
}

export type AggregateCellParams = {
  minIntervalFrame: number
  maxIntervalFrame?: number
  startFrames: number[]
}

export type GetFillColorParams = {
  colorDomain: number[] | number[][]
  colorRanges: ColorRange[] | string[]
  chunk: Chunk
  minIntervalFrame: number
  maxIntervalFrame: number
  comparisonMode?: HeatmapAnimatedMode
}

export type FourwingsLayerResolution = 'default' | 'high'
export type FourwingsHeatmapTileData = FourWingsFeature[]
export type _FourwingsHeatmapTileLayerProps = {
  data?: FourwingsHeatmapTileData
  debug?: boolean
  resolution?: FourwingsLayerResolution
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
  minFrame: number
  maxFrame: number
  sublayers: FourwingsDeckSublayer[]
  colorRampWhiteEnd?: boolean
  comparisonMode?: HeatmapAnimatedMode
  onTileDataLoading?: (tile: TileLoadProps) => void
}

export type FourwingsHeatmapTileLayerProps = _FourwingsHeatmapTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsHeatmapTilesCache = {
  start: number
  end: number
  interval: Interval
}

export type FourwingsTileLayerColorDomain = number[] | number[][]
export type FourwingsTileLayerColorRange = string[] | ColorRange[]

export type FourwingsTileLayerState = {
  tilesCache: FourwingsHeatmapTilesCache
  colorDomain: FourwingsTileLayerColorDomain
  colorRanges: FourwingsTileLayerColorRange
  comparisonMode?: HeatmapAnimatedMode
  tiles: Tile2DHeader<FourwingsHeatmapTileData>[]
}
