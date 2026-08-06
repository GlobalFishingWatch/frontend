import type { PickingInfo } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'

import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

import type {
  BaseFourwingsLayerProps,
  FourwingsDeckSublayer,
  FourwingsIntervalCacheMode,
  FourwingsVisualizationMode,
} from '#layers/fourwings/fourwings.types'
import type { FourwingsLayer } from '#layers/fourwings/FourwingsLayer'
import type { DeckPickingObject } from '#types'

export type _FourwingsPositionsTileLayerProps = BaseFourwingsLayerProps & {
  highlightStartTime?: number
  highlightEndTime?: number
  highlightedFeatures?: FourwingsPositionsPickingObject[]
  onPositionsMaxPointsError?: (layer: FourwingsLayer, maxPoints: number) => void
  intervalCacheMode?: FourwingsIntervalCacheMode
}

export type FourwingsPositionsTileLayerProps = _FourwingsPositionsTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsPositionsPickingObject = FourwingsPositionFeature &
  DeckPickingObject<{
    title: string
    startTime: number
    endTime: number
    sublayers?: FourwingsDeckSublayer[]
    visualizationMode?: FourwingsVisualizationMode
  }>
export type FourwingsPositionsPickingInfo = PickingInfo<FourwingsPositionsPickingObject>
