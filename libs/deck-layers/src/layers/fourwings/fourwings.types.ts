import { PickingInfo } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ScaleLinear, scaleLinear } from 'd3-scale'
import { ColorRampsIds } from '@globalfishingwatch/layer-composer'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import {
  FourwingsFeature,
  FourwingsFeatureProperties,
  FourwingsStaticFeatureProperties,
  FourwingsInterval,
  Cell,
} from '@globalfishingwatch/deck-loaders'
import { BasePickingObject } from '../../types'
import { HEATMAP_ID, POSITIONS_ID } from './fourwings.config'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string

export type FourwingsVisualizationMode = typeof HEATMAP_ID | typeof POSITIONS_ID

export interface FourwingsDeckSublayer {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  visible: boolean
  color: string
  colorRamp: ColorRampsIds
  value?: number
  unit?: string
  filter?: string
  vesselGroups?: string | string[]
}

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

export type FourwingsPickingObject = FourwingsFeature<
  FourwingsFeatureProperties & Partial<FourwingsStaticFeatureProperties>
> &
  BasePickingObject & {
    title: string
    tile: { x: number; y: number; z: number }
    startTime: number
    endTime: number
    interval: FourwingsInterval
    sublayers: FourwingsDeckSublayer[]
    comparisonMode?: FourwingsComparisonMode
  }
export type FourwingsPickingInfo = PickingInfo<FourwingsPickingObject>

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourwingsFeature[]
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
  highlightedFeatures?: FourwingsPickingInfo[]
  tilesCache: FourwingsHeatmapTilesCache
  scales: FourwinsTileLayerScale[]
}

export type AggregateCellParams = {
  cellValues: Cell
  startFrame: number
  endFrame: number
  aggregationOperation?: FourwingsAggregationOperation
  cellStartOffsets: number[]
}

export type GetFillColorParams = {
  cellValues: number[][]
  cellInitialValues?: number[]
  cellStartOffsets: number[]
  colorDomain: number[] | number[][]
  colorRanges: ColorRange[] | string[]
  startFrame: number
  endFrame: number
  comparisonMode?: FourwingsComparisonMode
  aggregationOperation?: FourwingsAggregationOperation
  scale?: typeof scaleLinear<number, string>
}

type BaseFourwingsLayerProps = {
  startTime: number
  endTime: number
  category: DataviewCategory
  sublayers: FourwingsDeckSublayer[]
  tilesUrl?: string
  highlightedFeatures?: FourwingsPickingObject[]
}

export type FourwingsResolution = 'default' | 'high'
export type FourwingsHeatmapTileData = FourwingsFeature[]

export type _FourwingsHeatmapTileLayerProps<DataT = FourwingsFeature> = BaseFourwingsLayerProps & {
  data?: DataT
  debug?: boolean
  availableIntervals?: FourwingsInterval[]
  resolution?: FourwingsResolution
  colorRampWhiteEnd?: boolean
  minVisibleValue?: number
  maxVisibleValue?: number
  comparisonMode?: FourwingsComparisonMode
  aggregationOperation?: FourwingsAggregationOperation
  onTileDataLoading?: (tile: TileLoadProps) => void
}

export type FourwingsHeatmapTileLayerProps = _FourwingsHeatmapTileLayerProps &
  Partial<TileLayerProps>

export type _FourwingsHeatmapStaticLayerProps = Omit<
  _FourwingsHeatmapTileLayerProps,
  'data' | 'availableIntervals' | 'comparisonMode'
>

export type FourwingsHeatmapStaticLayerProps = _FourwingsHeatmapStaticLayerProps &
  Partial<TileLayerProps>

export type _FourwingsPositionsTileLayerProps<DataT = any> = BaseFourwingsLayerProps & {
  static?: boolean
  highlightedVesselId?: string
  onDataLoad?: (data: DataT) => void
  // onColorRampUpdate: (colorRamp: FourwingsColorRamp) => void
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
  onViewportLoad?: (tiles: any) => void
  onTileDataLoading?: (tile: TileLoadProps) => void
}

export type FourwingsPositionsTileLayerProps = _FourwingsPositionsTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsHeatmapTilesCache = {
  start: number
  bufferedStart: number
  end: number
  interval: FourwingsInterval
}

export type FourwingsTileLayerColorScale = {
  colorDomain: FourwingsTileLayerColorDomain
  colorRange: FourwingsTileLayerColorRange
}

export type FourwingsTileLayerColorDomain = number[] | number[][]
export type FourwingsTileLayerColorRange = string[][] | string[]

export type FourwinsTileLayerScale = ScaleLinear<string, string, never>
export type FourwingsTileLayerState = {
  tilesCache: FourwingsHeatmapTilesCache
  colorDomain: FourwingsTileLayerColorDomain
  colorRanges: FourwingsTileLayerColorRange
  comparisonMode?: FourwingsComparisonMode
  scales?: FourwinsTileLayerScale[]
}
