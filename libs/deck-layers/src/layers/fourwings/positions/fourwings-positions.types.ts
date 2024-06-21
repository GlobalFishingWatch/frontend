import { PickingInfo } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { BasePickingObject } from '../../../types'
import {
  BaseFourwingsLayerProps,
  FourwingsDeckSublayer,
  FourwingsVisualizationMode,
} from '../fourwings.types'
import type { FourwingsLayer } from '../FourwingsLayer'

export type _FourwingsPositionsTileLayerProps = BaseFourwingsLayerProps & {
  highlightStartTime?: number
  highlightEndTime?: number
  highlightedFeatures?: FourwingsPositionsPickingObject[]
  positionProperties?: string[]
  onPositionsMaxPointsError?: (layer: FourwingsLayer, maxPoints: number) => void
}

export type FourwingsPositionsTileLayerProps = _FourwingsPositionsTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsPositionsPickingObject = FourwingsPositionFeature &
  BasePickingObject & {
    title: string
    startTime: number
    endTime: number
    sublayers?: FourwingsDeckSublayer[]
    visualizationMode?: FourwingsVisualizationMode
  }
export type FourwingsPositionsPickingInfo = PickingInfo<FourwingsPositionsPickingObject>
