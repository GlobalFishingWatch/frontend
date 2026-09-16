import type { Viewport } from '@deck.gl/core'

import { filterFeaturesByBounds } from '@globalfishingwatch/data-transforms'
import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'
import { assignFourwingsFeaturesByteLength } from '@globalfishingwatch/deck-loaders'

import { getCellValuesFrameRange } from '#layers/fourwings/heatmap/fourwings-heatmap.utils'

import { MAX_POSITIONS_PER_TILE_VISUALIZED } from './fourwings.config'

/** Reused for stale/aborted tile loads so Tileset2D always sees a finite byteLength. */
export const EMPTY_FOURWINGS_TILE_DATA = assignFourwingsFeaturesByteLength([])

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
