import { Color, PickingInfo } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader, TileLoadProps } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ColorRampsIds } from '@globalfishingwatch/layer-composer'
import { FourWingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { HEATMAP_ID, POSITIONS_ID } from './fourwings.config'

export type FourwingsSublayerId = string
export type FourwingsDatasetId = string

export type FourwingsVisualizationMode = typeof HEATMAP_ID | typeof POSITIONS_ID

export interface FourwingsDeckSublayer {
  id: FourwingsSublayerId
  datasets: FourwingsDatasetId[]
  visible: boolean
  config: {
    color: string
    colorRamp: ColorRampsIds
    visible?: boolean
    unit?: string
  }
  filter?: string
  vesselGroups?: string[]
}

export type Chunk = {
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

export type ColorDomain = number[]
export type ColorRange = Color[]
export type SublayerColorRanges = ColorRange[]

export type FourwingsHeatmapLayerProps = FourwingsHeatmapTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourWingsFeature[]
  colorDomain?: ColorDomain
  colorRanges?: SublayerColorRanges
  hoveredFeatures?: FourWingsFeature[]
}

export type AggregateCellParams = {
  minIntervalFrame: number
  maxIntervalFrame?: number
  aggregationOperation?: FourwingsAggregationOperation
  startFrames: number[]
}

export type GetFillColorParams = {
  colorDomain: number[] | number[][]
  colorRanges: ColorRange[] | string[]
  chunk: Chunk
  minIntervalFrame: number
  maxIntervalFrame: number
  comparisonMode?: FourwingsComparisonMode
  aggregationOperation?: FourwingsAggregationOperation
}

type BaseFourwinsLayerProps = {
  minFrame: number
  maxFrame: number
  tilesUrl: string
  clickedFeatures?: PickingInfo[]
  hoveredFeatures?: PickingInfo[]
}

export type FourwingsResolution = 'default' | 'high'
export type FourwingsHeatmapTileData = FourWingsFeature[]

export type _FourwingsHeatmapTileLayerProps<DataT = FourWingsFeature> = BaseFourwinsLayerProps & {
  data?: DataT
  debug?: boolean
  availableIntervals?: FourwingsInterval[]
  resolution?: FourwingsResolution
  sublayers: FourwingsDeckSublayer[]
  colorRampWhiteEnd?: boolean
  comparisonMode?: FourwingsComparisonMode
  aggregationOperation?: FourwingsAggregationOperation
  onTileDataLoading?: (tile: TileLoadProps) => void
}

export type _FourwingsPositionsTileLayerProps<DataT = any> = BaseFourwinsLayerProps & {
  highlightedVesselId?: string
  onDataLoad?: (data: DataT) => void
  // onColorRampUpdate: (colorRamp: FourwingsColorRamp) => void
  onVesselHighlight?: (vesselId: string) => void
  onVesselClick?: (vesselId: string) => void
  onViewportLoad?: (tiles: any) => void
  onTileDataLoading?: (tile: TileLoadProps) => void
}

export type FourwingsHeatmapTileLayerProps = _FourwingsHeatmapTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsHeatmapTilesCache = {
  start: number
  end: number
  interval: FourwingsInterval
}

export type FourwingsTileLayerColorScale = {
  colorDomain: FourwingsTileLayerColorDomain
  colorRange: FourwingsTileLayerColorRange
}

export type FourwingsTileLayerColorDomain = number[] | number[][]
export type FourwingsTileLayerColorRange = string[] | ColorRange[]

export type FourwingsTileLayerState = {
  tilesCache: FourwingsHeatmapTilesCache
  colorDomain: FourwingsTileLayerColorDomain
  colorRanges: FourwingsTileLayerColorRange
  comparisonMode?: FourwingsComparisonMode
  tiles: Tile2DHeader<FourwingsHeatmapTileData>[]
}
