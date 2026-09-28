import type { Viewport } from '@deck.gl/core'
import type { _Tile2DHeader as Tile2DHeader } from '@deck.gl/geo-layers'

import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { assignFourwingsFeaturesByteLength } from '@globalfishingwatch/deck-loaders'

import { getCellValuesFrameRange } from '#layers/fourwings/heatmap/fourwings-heatmap.utils'

import { MAX_POSITIONS_PER_TILE_VISUALIZED } from './fourwings.config'

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

export function isTilePositionsOverLimit({
  tileData,
  maxPositions,
  startFrame,
  endFrame,
}: FourwingsTileFrames & {
  tileData: FourwingsFeature[]
  maxPositions: number
}): boolean {
  let tileSum = 0
  for (const feature of tileData) {
    const values = feature.properties?.values
    if (!values?.length) {
      continue
    }
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
      for (let i = from; i < to; i++) {
        if (sublayerValues[i]) {
          tileSum += sublayerValues[i]
        }
      }
    }
    if (tileSum > maxPositions) {
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
}: FourwingsTileFrames & {
  tilesData: FourwingsFeature[][]
  viewport: Viewport
  maxPositions?: number
}) {
  const [west, north] = viewport.unproject([0, 0])
  const [east, south] = viewport.unproject([viewport.width, viewport.height])
  const bounds = { north, south, west, east }

  return !tilesData.some((tileData) =>
    isTilePositionsOverLimit({
      tileData: filterFeaturesByBounds({ features: tileData, bounds }) as FourwingsFeature[],
      maxPositions,
      startFrame,
      endFrame,
    })
  )
}
