import type { PickingInfo } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'

import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

import type { DeckPickingObject } from '../../../types'
import type {
  BaseFourwingsLayerProps,
  FourwingsDeckSublayer,
  FourwingsVisualizationMode,
} from '../fourwings.types'
import type { FourwingsLayer } from '../FourwingsLayer'

export type _FourwingsPositionsTileLayerProps = BaseFourwingsLayerProps & {
  highlightStartTime?: number
  highlightEndTime?: number
  highlightedFeatures?: FourwingsPositionsPickingObject[]
  onPositionsMaxPointsError?: (layer: FourwingsLayer, maxPoints: number) => void
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
