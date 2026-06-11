import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'

import { MAX_POSITIONS_PER_TILE_SUPPORTED } from './fourwings.config'

export function isTilePositionsOverLimit(
  tileData: FourwingsFeature[],
  maxPositions: number
): boolean {
  let tileSum = 0
  for (const feature of tileData) {
    const values = feature.properties?.values
    if (!values?.length) {
      continue
    }
    for (const sublayerValues of values) {
      if (!sublayerValues) {
        continue
      }
      for (let i = 0; i < sublayerValues.length; i++) {
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

export function getAreTilePositionsAvailable(tilesData: FourwingsFeature[][]) {
  return !tilesData.some((tileData) =>
    isTilePositionsOverLimit(tileData, MAX_POSITIONS_PER_TILE_SUPPORTED)
  )
}
