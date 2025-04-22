import type { PickingInfo } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'

import type { DeckLayerProps, DeckPickingObject } from '../../types'
import type { ContextFeature } from '../context'

export type PMTilesFeatureProperties = {
  id: string
  title: string
  color: string
  value: string | number
  datasetId: string
  link?: string
}

export type PMTilePickingObject = DeckPickingObject<ContextFeature & PMTilesFeatureProperties>

export type PMTilePickingInfo = PickingInfo<PMTilePickingObject, { tile?: Tile2DHeader }>

export type PMTileLayerProps = DeckLayerProps<{
  id: string
  data: string
  color: string
  thickness: number
  pickable?: boolean
  idProperty?: string
  valueProperties?: string[]
  highlightedFeatures?: PMTilePickingObject[]
}> &
  Omit<TileLayerProps, 'data' | 'renderSubLayers' | 'getTileData'>
