import { describe, expect, it } from 'vitest'

import type { TileCell } from '@globalfishingwatch/deck-loaders'

import {
  FOOTPRINT_HIGH_RES_ID,
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
  POSITIONS_ID,
} from '#layers/fourwings/fourwings.config'

import { FourwingsAggregationOperation } from './fourwings-heatmap.types'
import {
  aggregateCell,
  aggregateSublayerValues,
  compareCell,
  filterCells,
  filterCellsByBounds,
  getDataUrl,
  getFourwingsChunk,
  getIntervalFrames,
  getResolutionByVisualizationMode,
  getURLFromTemplate,
  getVisualizationModeByResolution,
  getZoomOffsetByResolution,
  isSublayerValueVisible,
  sliceCellValues,
} from './fourwings-heatmap.utils'

describe('aggregateSublayerValues', () => {
  it('sums by default', () => {
    expect(aggregateSublayerValues([1, 2, 3])).toBe(6)
  })

  it('averages ignoring empty values', () => {
    expect(aggregateSublayerValues([2, 4, 0], FourwingsAggregationOperation.Avg)).toBe(3)
  })

  it('avg of all-empty values does not divide by zero', () => {
    expect(aggregateSublayerValues([0, 0], FourwingsAggregationOperation.Avg)).toBe(0)
  })

  it('averages degrees across the 0/360 wraparound', () => {
    const avg = aggregateSublayerValues([350, 10], FourwingsAggregationOperation.AvgDegrees)
    expect(avg).toBeCloseTo(0)
  })
})

describe('sliceCellValues', () => {
  const values = [10, 20, 30, 40]

  it('returns empty array for empty values', () => {
    expect(sliceCellValues({ values: [], startFrame: 0, endFrame: 2, startOffset: 0 })).toEqual([])
  })

  it('returns single value when startFrame equals endFrame', () => {
    expect(sliceCellValues({ values, startFrame: 1, endFrame: 1, startOffset: 0 })).toEqual([20])
  })

  it('slices values within the time range', () => {
    expect(sliceCellValues({ values, startFrame: 1, endFrame: 3, startOffset: 0 })).toEqual([
      20, 30,
    ])
  })

  it('clamps start below the offset and keeps the tail when endFrame exceeds length', () => {
    expect(sliceCellValues({ values, startFrame: 0, endFrame: 10, startOffset: 2 })).toEqual(values)
  })
})

describe('aggregateCell', () => {
  it('aggregates each sublayer with its own start offset', () => {
    expect(
      aggregateCell({
        cellValues: [
          [1, 2, 3],
          [10, 20, 30],
        ],
        startFrame: 1,
        endFrame: 3,
        cellStartOffsets: [0, 1],
      })
    ).toEqual([5, 30])
  })

  // These returned 0 until 2026-09-03. "No data here" has to be distinguishable from a
  // measured 0, or every no-data cell paints at the bottom of the ramp.
  it('returns undefined for sublayers fully outside the time range', () => {
    expect(
      aggregateCell({
        cellValues: [[1, 2, 3]],
        startFrame: 10,
        endFrame: 12,
        cellStartOffsets: [0],
      })
    ).toEqual([undefined])
  })

  it('returns undefined when offsets are missing or sublayer has no values', () => {
    expect(
      aggregateCell({
        cellValues: [undefined as any],
        startFrame: 0,
        endFrame: 1,
        cellStartOffsets: [0],
      })
    ).toEqual([undefined])
    expect(
      aggregateCell({
        cellValues: [[1]],
        startFrame: 0,
        endFrame: 1,
        cellStartOffsets: undefined,
      })
    ).toEqual([undefined])
  })

  it('keeps a measured 0 as a value', () => {
    expect(
      aggregateCell({
        cellValues: [[0]],
        startFrame: 0,
        endFrame: 1,
        cellStartOffsets: [0],
      })
    ).toEqual([0])
  })
})

describe('compareCell', () => {
  it('returns empty array when both sublayers are empty', () => {
    expect(compareCell({ cellValues: [[], []] })).toEqual([])
  })

  it('returns negative initial value when compared sublayer is empty', () => {
    expect(compareCell({ cellValues: [[2, 3], []] })).toEqual([-5])
  })

  it('returns compared value when initial sublayer is empty', () => {
    expect(compareCell({ cellValues: [[], [2, 3]] })).toEqual([5])
  })

  it('returns the difference when both have values', () => {
    expect(compareCell({ cellValues: [[2], [7]] })).toEqual([5])
  })
})

describe('getURLFromTemplate', () => {
  const index = { x: 1, y: 2, z: 3 }

  it('replaces tile index placeholders', () => {
    expect(getURLFromTemplate('https://tiles/{z}/{x}/{y}', { index, id: 'tile' })).toBe(
      'https://tiles/3/1/2'
    )
  })

  it('supports {-y} TMS convention', () => {
    expect(getURLFromTemplate('https://tiles/{z}/{x}/{-y}', { index, id: 'tile' })).toBe(
      'https://tiles/3/1/5'
    )
  })

  it('picks a template from an array deterministically by tile id', () => {
    const templates = ['https://a/{z}/{x}/{y}', 'https://b/{z}/{x}/{y}']
    const first = getURLFromTemplate(templates, { index, id: 'tile' })
    expect(getURLFromTemplate(templates, { index, id: 'tile' })).toBe(first)
  })

  it('returns empty string for empty template', () => {
    expect(getURLFromTemplate('', { index, id: 'tile' })).toBe('')
  })
})

describe('getDataUrl', () => {
  const tile = { index: { x: 1, y: 2, z: 3 }, id: 'tile' }
  const chunk = {
    id: 'year-chunk',
    interval: 'DAY',
    start: Date.UTC(2023, 0, 1),
    end: Date.UTC(2023, 11, 31),
    bufferedStart: Date.UTC(2022, 11, 1),
    bufferedEnd: Date.UTC(2024, 0, 31),
  } as any

  it('throws without sublayers', () => {
    expect(() => getDataUrl({ tile, chunk })).toThrow()
  })

  it('builds the tile url with datasets and date-range', () => {
    const url = getDataUrl({
      tile,
      chunk,
      sublayer: { datasets: ['public-global-fishing'] } as any,
    })
    expect(url).toContain('/3/1/2')
    expect(url).toContain('format=4WINGS')
    expect(url).toContain('interval=DAY')
    expect(url).toContain(encodeURIComponent('public-global-fishing'))
    expect(url).toContain('date-range')
  })

  it('omits date-range for YEAR interval and merges datasets of multiple sublayers', () => {
    const url = getDataUrl({
      tile,
      chunk: { ...chunk, interval: 'YEAR' },
      sublayers: [{ datasets: ['ds-a'] }, { datasets: ['ds-b'] }] as any,
    })
    expect(url).not.toContain('date-range')
    expect(url).toContain(encodeURIComponent('ds-a,ds-b'))
  })
})

describe('filterCellsByBounds', () => {
  const cell = (lon: number, lat: number): TileCell =>
    ({ coordinates: [[[lon, lat]]] }) as unknown as TileCell

  const bounds = { north: 10, south: -10, west: -20, east: 20 }

  it('keeps cells inside bounds and drops the rest', () => {
    const cells = [cell(0, 0), cell(30, 0), cell(0, 30), null as any]
    expect(filterCellsByBounds(cells, bounds)).toEqual([cells[0]])
  })

  it('returns empty array without bounds', () => {
    expect(filterCellsByBounds([cell(0, 0)], undefined as any)).toEqual([])
  })

  it('translates features into a right world copy', () => {
    const cells = [cell(-175, 0)]
    expect(filterCellsByBounds(cells, { north: 10, south: -10, west: 170, east: 190 })).toEqual(
      cells
    )
  })

  it('translates features into a left world copy', () => {
    const cells = [cell(175, 0)]
    expect(filterCellsByBounds(cells, { north: 10, south: -10, west: -190, east: -170 })).toEqual(
      cells
    )
  })
})

describe('getFourwingsChunk', () => {
  it('returns a chunk containing the requested range', () => {
    const start = Date.UTC(2023, 2, 15)
    const end = Date.UTC(2023, 5, 15)
    const chunk = getFourwingsChunk({ start, end, availableIntervals: ['DAY'] })
    expect(chunk.interval).toBe('DAY')
    expect(chunk.start).toBeLessThanOrEqual(start)
    expect(chunk.end).toBeGreaterThanOrEqual(end)
    expect(chunk.bufferedStart).toBeLessThanOrEqual(chunk.start)
    expect(chunk.bufferedEnd).toBeGreaterThanOrEqual(chunk.end)
  })
})

describe('getIntervalFrames', () => {
  it('computes frames relative to the buffered tile start', () => {
    const startTime = Date.UTC(2023, 0, 10)
    const { interval, tileStartFrame, startFrame, endFrame } = getIntervalFrames({
      startTime,
      endTime: Date.UTC(2023, 0, 20),
      availableIntervals: ['DAY'],
      bufferedStart: Date.UTC(2023, 0, 9),
    })
    expect(interval).toBe('DAY')
    expect(tileStartFrame).toBeGreaterThan(0)
    expect(startFrame).toBe(1)
    expect(endFrame - startFrame).toBe(10)
  })

  it('returns the same (cached) result for identical params', () => {
    const params = {
      startTime: Date.UTC(2023, 0, 10),
      endTime: Date.UTC(2023, 0, 20),
      availableIntervals: ['DAY'] as any,
      bufferedStart: Date.UTC(2023, 0, 9),
    }
    expect(getIntervalFrames(params)).toBe(getIntervalFrames(params))
  })
})

describe('filterCells', () => {
  it('samples elements at index % 20 === 1 within min/max', () => {
    expect(filterCells(5, 1)).toBe(true)
    expect(filterCells(5, 2)).toBe(false)
    expect(filterCells(0, 1)).toBeFalsy()
    expect(filterCells(5, 21, 10)).toBe(false)
    expect(filterCells(5, 21, 1, 10)).toBe(true)
    expect(filterCells(15, 21, 1, 10)).toBe(false)
  })
})

describe('resolution/visualization mode mappings', () => {
  it('maps visualization modes to resolutions', () => {
    expect(getResolutionByVisualizationMode(HEATMAP_HIGH_RES_ID)).toBe('high')
    expect(getResolutionByVisualizationMode(FOOTPRINT_HIGH_RES_ID)).toBe('high')
    expect(getResolutionByVisualizationMode(HEATMAP_LOW_RES_ID)).toBe('low')
    expect(getResolutionByVisualizationMode(HEATMAP_ID)).toBe('default')
    expect(getResolutionByVisualizationMode(POSITIONS_ID)).toBe('default')
    expect(getResolutionByVisualizationMode(undefined)).toBe('default')
  })

  it('maps resolutions back to heatmap visualization modes', () => {
    expect(getVisualizationModeByResolution('high')).toBe(HEATMAP_HIGH_RES_ID)
    expect(getVisualizationModeByResolution('low')).toBe(HEATMAP_LOW_RES_ID)
    expect(getVisualizationModeByResolution('default')).toBe(HEATMAP_ID)
    expect(getVisualizationModeByResolution(undefined)).toBe(HEATMAP_ID)
  })

  it('maps resolution and zoom to a zoom offset', () => {
    expect(getZoomOffsetByResolution('high', 5)).toBe(1)
    expect(getZoomOffsetByResolution('low', 5)).toBe(-1)
    expect(getZoomOffsetByResolution('low', 0)).toBe(0)
    expect(getZoomOffsetByResolution('default', 5)).toBe(0)
  })
})

describe('isSublayerValueVisible', () => {
  // A cell the API measured as 0 must render; only a missing value hides it.
  it('treats a measured 0 as visible', () => {
    expect(isSublayerValueVisible(0)).toBe(true)
    expect(isSublayerValueVisible(0, { minVisibleValue: 0 })).toBe(true)
  })

  it('hides missing values', () => {
    expect(isSublayerValueVisible(undefined)).toBe(false)
    expect(isSublayerValueVisible(null)).toBe(false)
    expect(isSublayerValueVisible(NaN)).toBe(false)
  })

  it('still honours the visible value range', () => {
    expect(isSublayerValueVisible(5, { minVisibleValue: 10 })).toBe(false)
    expect(isSublayerValueVisible(0, { minVisibleValue: 1 })).toBe(false)
    expect(isSublayerValueVisible(15, { maxVisibleValue: 10 })).toBe(false)
    expect(isSublayerValueVisible(-3)).toBe(true)
  })
})
