import { PickingInfo } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ScaleLinear } from 'd3-scale'
import {
  FourwingsFeature,
  FourwingsStaticFeature,
  FourwingsFeatureProperties,
  FourwingsInterval,
} from '@globalfishingwatch/deck-loaders'
import { DeckPickingObject } from '../../../types'
import {
  BaseFourwingsLayerProps,
  FourwingsAggregationOperation,
  FourwingsColorObject,
  FourwingsComparisonMode,
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
  }>
export type FourwingsHeatmapPickingInfo = PickingInfo<FourwingsHeatmapPickingObject>

export type FourwingsHeatmapResolution = 'low' | 'default' | 'high'
export type FourwingsHeatmapTileData = FourwingsFeature[]

export type _FourwingsFootprintTileLayerProps<DataT = FourwingsFeature> =
  BaseFourwingsLayerProps & {
    data?: DataT
    color?: string
    availableIntervals?: FourwingsInterval[]
    highlightedFeatures?: FourwingsHeatmapPickingObject[]
  }

export type FourwingsFootprintTileLayerProps = _FourwingsFootprintTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsHeatmapTilesCache = {
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
}

export type FourwingsFootprintLayerProps = FourwingsFootprintTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourwingsFeature[]
  color?: string
  tilesCache: FourwingsHeatmapTilesCache
  scales: FourwinsTileLayerScale[]
}
