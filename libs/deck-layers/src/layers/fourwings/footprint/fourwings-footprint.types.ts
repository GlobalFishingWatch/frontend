import type { _Tile2DHeader as Tile2DHeader, TileLayerProps } from '@deck.gl/geo-layers'

import type { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'

import type {
  BaseFourwingsLayerProps,
  FourwingsHeatmapPickingObject,
  FourwingsHeatmapResolution,
  FourwingsHeatmapTilesCache,
} from '../fourwings.types'

export type _FourwingsFootprintTileLayerProps<DataT = FourwingsFeature> =
  BaseFourwingsLayerProps & {
    data?: DataT
    color?: string
    resolution?: FourwingsHeatmapResolution
    availableIntervals?: FourwingsInterval[]
    highlightedFeatures?: FourwingsHeatmapPickingObject[]
  }

export type FourwingsFootprintTileLayerProps = _FourwingsFootprintTileLayerProps &
  Partial<TileLayerProps>

export type FourwingsFootprintTileLayerState = {
  error: string
  tilesCache: FourwingsHeatmapTilesCache
  viewportLoaded: boolean
}

export type FourwingsFootprintLayerProps = FourwingsFootprintTileLayerProps & {
  id: string
  tile: Tile2DHeader
  data: FourwingsFeature[]
  color?: string
  tilesCache: FourwingsHeatmapTilesCache
}
