import { PickingInfo } from '@deck.gl/core'
import { TileLayerProps } from '@deck.gl/geo-layers'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { BasePickingObject } from '../../../types'
import { BaseFourwingsLayerProps, FourwingsDeckSublayer } from '../fourwings.types'

export type FourwingsPositionsTileLayerProps = _FourwingsPositionsTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsPositionsPickingObject = FourwingsPositionFeature &
  BasePickingObject & {
    title: string
    // tile: { x: number; y: number; z: number }
    startTime: number
    endTime: number
    sublayers?: FourwingsDeckSublayer[]
  }
export type FourwingsPositionsPickingInfo = PickingInfo<FourwingsPositionsPickingObject>

export type _FourwingsPositionsTileLayerProps = BaseFourwingsLayerProps & {
  highlightedFeatures?: FourwingsPositionsPickingObject[]
}
