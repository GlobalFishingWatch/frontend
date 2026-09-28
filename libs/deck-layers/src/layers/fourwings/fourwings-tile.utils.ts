import type { Viewport } from '@deck.gl/core'
import type { _Tile2DHeader as Tile2DHeader } from '@deck.gl/geo-layers'

import type { Bounds } from '@globalfishingwatch/data-transforms'
import { isFeatureInBounds } from '@globalfishingwatch/data-transforms'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { assignFourwingsFeaturesByteLength } from '@globalfishingwatch/deck-loaders'

import { FourwingsAggregationOperation } from '#layers/fourwings/heatmap/fourwings-heatmap.types'
import {
  aggregateSublayerValues,
  getCellValuesFrameRange,
  isSublayerValueVisible,
} from '#layers/fourwings/heatmap/fourwings-heatmap.utils'

import {
  MAX_POSITIONS_PER_TILE_SUPPORTED,
  MAX_POSITIONS_PER_TILE_VISUALIZED,
} from './fourwings.config'
import type { FourwingsDeckSublayer } from './fourwings.types'

/** Reused for stale/aborted tile loads so Tileset2D always sees a finite byteLength. */
export const EMPTY_FOURWINGS_TILE_DATA = assignFourwingsFeaturesByteLength([])

const MAX_PLACEHOLDER_ZOOM_DELTA = 2

const hasTileContent = (tile: Tile2DHeader) => tile.isLoaded || Boolean(tile.content)

/**
 * deck.gl's 'best-available' refinement, but only when MAX_PLACEHOLDER_ZOOM_DELTA zoom levels away.
 * https://deck.gl/docs/api-reference/geo-layers/tile-layer#refinementstrategy
 */
export function fourwingsRefinementStrategy(tiles: Tile2DHeader[]) {
  const visible = new Set<Tile2DHeader>()
  const setAncestorPlaceholder = (selected: Tile2DHeader) => {
    let tile: Tile2DHeader | null = selected
    while (tile && selected.zoom - tile.zoom <= MAX_PLACEHOLDER_ZOOM_DELTA) {
      if (hasTileContent(tile)) {
        visible.add(tile)
        return true
      }
      tile = tile.parent
    }
    return false
  }
  const setChildrenPlaceholder = (tile: Tile2DHeader, depth = 1) => {
    if (depth > MAX_PLACEHOLDER_ZOOM_DELTA) return
    for (const child of tile.children || []) {
      if (hasTileContent(child)) visible.add(child)
      else setChildrenPlaceholder(child, depth + 1)
    }
  }
  for (const tile of tiles) {
    if (tile.isSelected && !setAncestorPlaceholder(tile)) setChildrenPlaceholder(tile)
  }
  for (const tile of tiles) {
    tile.isVisible = visible.has(tile)
  }
}

export type FourwingsTileFrames = {
  startFrame: number
  endFrame: number
}

type VisibleRangeParams = {
  sublayers?: Pick<FourwingsDeckSublayer, 'minVisibleValue' | 'maxVisibleValue'>[]
  aggregationOperation?: FourwingsAggregationOperation
}

/**
 * Single pass over the tile checking both limits:
 * - maxPositions: positions the user would see, so only cells in `bounds` whose aggregated value
 *   passes the sublayer's visible range
 * - maxSupportedPositions: positions the API would return, so every cell in the tile, because the
 *   positions request is neither range-filtered nor viewport-clipped and max-points truncates it
 */
export function isTilePositionsOverLimit({
  tileData,
  maxPositions,
  maxSupportedPositions = Infinity,
  bounds,
  startFrame,
  endFrame,
  sublayers,
  aggregationOperation = FourwingsAggregationOperation.Sum,
}: FourwingsTileFrames &
  VisibleRangeParams & {
    tileData: FourwingsFeature[]
    maxPositions: number
    maxSupportedPositions?: number
    bounds?: Bounds
  }): boolean {
  let tileSum = 0
  let visibleSum = 0
  for (const feature of tileData) {
    const values = feature.properties?.values
    if (!values?.length) {
      continue
    }
    const isInBounds = !bounds || isFeatureInBounds(feature, bounds)
    for (let sublayerIndex = 0; sublayerIndex < values.length; sublayerIndex++) {
      const sublayerValues = values[sublayerIndex]
      if (!sublayerValues) {
        continue
      }
      const [from, to] = getCellValuesFrameRange({
        valuesLength: sublayerValues.length,
        startFrame,
        endFrame,
        startOffset: feature.properties.startOffsets?.[sublayerIndex] ?? 0,
      })
      let cellSum = 0
      for (let i = from; i < to; i++) {
        if (sublayerValues[i]) {
          cellSum += sublayerValues[i]
        }
      }
      tileSum += cellSum
      if (!isInBounds) {
        continue
      }
      const sublayer = sublayers?.[sublayerIndex]
      if (sublayer?.minVisibleValue !== undefined || sublayer?.maxVisibleValue !== undefined) {
        // The range filters the aggregated cell value the heatmap paints, which is only the
        // positions sum when aggregating by Sum
        const cellValue =
          aggregationOperation === FourwingsAggregationOperation.Sum
            ? cellSum
            : aggregateSublayerValues(sublayerValues.slice(from, to), aggregationOperation)
        if (!isSublayerValueVisible(cellValue, sublayer)) {
          continue
        }
      }
      visibleSum += cellSum
    }
    if (visibleSum > maxPositions || tileSum > maxSupportedPositions) {
      return true
    }
  }
  return false
}

export function getAreTilePositionsAvailable({
  tilesData,
  viewport,
  startFrame,
  endFrame,
  maxPositions = MAX_POSITIONS_PER_TILE_VISUALIZED,
  maxSupportedPositions = MAX_POSITIONS_PER_TILE_SUPPORTED,
  sublayers,
  aggregationOperation,
}: FourwingsTileFrames &
  VisibleRangeParams & {
    tilesData: FourwingsFeature[][]
    viewport: Viewport
    maxPositions?: number
    maxSupportedPositions?: number
  }) {
  const [west, north] = viewport.unproject([0, 0])
  const [east, south] = viewport.unproject([viewport.width, viewport.height])
  const bounds = { north, south, west, east }

  return !tilesData.some((tileData) =>
    isTilePositionsOverLimit({
      tileData,
      bounds,
      maxPositions,
      maxSupportedPositions,
      startFrame,
      endFrame,
      sublayers,
      aggregationOperation,
    })
  )
}
