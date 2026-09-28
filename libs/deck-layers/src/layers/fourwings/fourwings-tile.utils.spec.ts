import type { Viewport } from '@deck.gl/core'
import { describe, expect, it } from 'vitest'

import type { FourwingsFeature } from '@globalfishingwatch/deck-loaders'

import { FourwingsAggregationOperation } from './heatmap/fourwings-heatmap.types'
import { getAreTilePositionsAvailable, isTilePositionsOverLimit } from './fourwings-tile.utils'

// Covers the whole world, so every cell is in bounds unless a test says otherwise
const viewport = {
  width: 100,
  height: 100,
  unproject: ([x]: number[]) => (x === 0 ? [-180, 90] : [180, -90]),
} as unknown as Viewport

// Only the cell's own bounds are checked, so a single coordinate pair is enough geometry.
// Never 0: filterFeaturesByBounds reads the coordinate with `||`, so a 0 falls through to the
// undefined properties.lon/lat and the cell drops out of every viewport.
function cell(values: number[][], { startOffsets = values.map(() => 0), lon = 1, lat = 1 } = {}) {
  return {
    coordinates: [lon, lat],
    properties: { values, startOffsets, initialValues: {}, cellId: 1, cellNum: 1, col: 0, row: 0 },
  } as unknown as FourwingsFeature
}

describe('isTilePositionsOverLimit', () => {
  it('counts only the values inside the frame window', () => {
    // 6 frames of 100 each: over the limit across the whole chunk, under it in frames 0-1
    const tile = [cell([[100, 100, 100, 100, 100, 100]])]
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 0, endFrame: 6 })
    ).toBe(true)
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 0, endFrame: 2 })
    ).toBe(false)
  })

  it('shifts the window by the sublayer start offset', () => {
    // values start at frame 4, so frames 4-5 are values[0..1] and frames 0-3 hold nothing
    const tile = [cell([[100, 100, 300]], { startOffsets: [4] })]
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 0, endFrame: 4 })
    ).toBe(false)
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 4, endFrame: 6 })
    ).toBe(false)
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 4, endFrame: 7 })
    ).toBe(true)
  })

  it('reads exactly one value when the window is empty', () => {
    const tile = [cell([[100, 300, 100]])]
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 1, endFrame: 1 })
    ).toBe(true)
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 2, endFrame: 2 })
    ).toBe(false)
  })

  it('sums every sublayer of the cell', () => {
    const tile = [
      cell([
        [200, 0],
        [200, 0],
      ]),
    ]
    expect(
      isTilePositionsOverLimit({ tileData: tile, maxPositions: 250, startFrame: 0, endFrame: 2 })
    ).toBe(true)
  })

  it('skips cells whose aggregated value is outside the visible range', () => {
    // 500 positions in total; each cell is under the limit alone (200) or over it alone (300)
    const tile = [cell([[100, 100]]), cell([[150, 150]])]
    const params = { tileData: tile, maxPositions: 250, startFrame: 0, endFrame: 2 }
    expect(isTilePositionsOverLimit(params)).toBe(true)
    expect(isTilePositionsOverLimit({ ...params, sublayers: [{ maxVisibleValue: 250 }] })).toBe(
      false
    )
    expect(isTilePositionsOverLimit({ ...params, sublayers: [{ minVisibleValue: 250 }] })).toBe(
      true
    )
  })

  it('filters by the average but counts the sum when aggregating by Avg', () => {
    // average 150 passes the range, and its 300 positions are all counted
    const tile = [cell([[100, 200]])]
    const params = {
      tileData: tile,
      maxPositions: 250,
      startFrame: 0,
      endFrame: 2,
      sublayers: [{ maxVisibleValue: 200 }],
    }
    expect(isTilePositionsOverLimit(params)).toBe(false)
    expect(
      isTilePositionsOverLimit({
        ...params,
        aggregationOperation: FourwingsAggregationOperation.Avg,
      })
    ).toBe(true)
  })
})

describe('getAreTilePositionsAvailable', () => {
  const frames = { startFrame: 0, endFrame: 2 }

  it('is unavailable when any single tile is over the limit', () => {
    const tilesData = [[cell([[10, 10]])], [cell([[300, 300]])]]
    expect(
      getAreTilePositionsAvailable({ tilesData, viewport, ...frames, maxPositions: 250 })
    ).toBe(false)
  })

  it('is unavailable when the whole unfiltered tile exceeds the supported limit', () => {
    // under the visualized limit once range-filtered and viewport-clipped, but the request
    // would still ask the API for every position in the tile
    const tilesData = [[cell([[10, 10]]), cell([[300, 300]], { lat: 80 })]]
    const narrowViewport = {
      width: 100,
      height: 100,
      unproject: ([x]: number[]) => (x === 0 ? [-10, 10] : [10, -10]),
    } as unknown as Viewport
    const params = { tilesData, ...frames, maxPositions: 250, maxSupportedPositions: 500 }
    expect(
      getAreTilePositionsAvailable({ ...params, viewport, sublayers: [{ maxVisibleValue: 100 }] })
    ).toBe(false)
    expect(getAreTilePositionsAvailable({ ...params, viewport: narrowViewport })).toBe(false)
    expect(
      getAreTilePositionsAvailable({
        ...params,
        viewport: narrowViewport,
        maxSupportedPositions: 1000,
      })
    ).toBe(true)
  })

  it('ignores cells outside the viewport', () => {
    // one in view, one far north of the narrow viewport below
    const tilesData = [[cell([[10, 10]]), cell([[300, 300]], { lat: 80 })]]
    const narrowViewport = {
      width: 100,
      height: 100,
      unproject: ([x]: number[]) => (x === 0 ? [-10, 10] : [10, -10]),
    } as unknown as Viewport
    expect(
      getAreTilePositionsAvailable({
        tilesData,
        viewport: narrowViewport,
        ...frames,
        maxPositions: 250,
      })
    ).toBe(true)
    expect(
      getAreTilePositionsAvailable({ tilesData, viewport, ...frames, maxPositions: 250 })
    ).toBe(false)
  })
})
