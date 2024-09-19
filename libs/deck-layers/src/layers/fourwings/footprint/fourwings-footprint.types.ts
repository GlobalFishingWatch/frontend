import { TileLayerProps } from '@deck.gl/geo-layers'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import {
  BaseFourwingsLayerProps,
  FourwingsHeatmapPickingObject,
  FourwingsHeatmapTilesCache,
} from '../fourwings.types'

export type _FourwingsFootprintTileLayerProps<DataT = FourwingsFeature> =
  BaseFourwingsLayerProps & {
    data?: DataT
    color?: string
    availableIntervals?: FourwingsInterval[]
    highlightedFeatures?: FourwingsHeatmapPickingObject[]
  }

export type FourwingsFootprintTileLayerProps = _FourwingsFootprintTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsFootprintTileLayerState = {
  error: string
  tilesCache: FourwingsHeatmapTilesCache
}

export type FourwingsFootprintLayerProps = FourwingsFootprintTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourwingsFeature[]
  color?: string
  tilesCache: FourwingsHeatmapTilesCache
}