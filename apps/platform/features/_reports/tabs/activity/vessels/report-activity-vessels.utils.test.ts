import { describe, expect, it } from 'vitest'

import type { Dataset } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  getFiltersByDataview,
  getHoursByLayer,
  getReportHoursMode,
  getSublayerFilters,
  getTilesHoursMode,
  getUnmatchedDetections,
  getVesselValue,
  sublayerFiltersNonOverlapping,
  sublayerFiltersTotalOverlap,
} from 'features/_reports/tabs/activity/vessels/report-activity-vessels.utils'

const dataset = {
  id: 'public-global-fishing-effort:v5.0',
  filters: {
    fourwings: [
      { id: 'flag', type: 'string' },
      { id: 'distance_from_port_km', type: 'number', operation: 'gte', enum: [0, 1, 2, 3, 4, 5] },
      { id: 'speed', type: 'string', enum: ['<2', '2-4', '4-6'] },
      { id: 'radiance', type: 'range', enum: [0, 10000] },
    ],
  },
} as unknown as Dataset

const sublayer = (filters: Record<string, unknown>, filterOperators: Record<string, string> = {}) =>
  getSublayerFilters({
    id: 'sublayer',
    datasets: [dataset],
    config: { filters, filterOperators },
  } as unknown as UrlDataviewInstance)

const contains = (a: ReturnType<typeof sublayer>, b: ReturnType<typeof sublayer>) =>
  sublayerFiltersTotalOverlap(a, b)

describe('sublayerFiltersTotalOverlap', () => {
  it('ignores vessel-level filters', () => {
    expect(sublayer({ flag: ['ITA'] })).toEqual({})
  })

  it('a sublayer without position filters contains a filtered one, not the reverse', () => {
    const port = sublayer({ distance_from_port_km: [5] })
    expect(contains(sublayer({}), port)).toBe(true)
    expect(contains(port, sublayer({}))).toBe(false)
  })

  it('gte: the lower threshold contains the higher one', () => {
    const two = sublayer({ distance_from_port_km: [2] })
    const five = sublayer({ distance_from_port_km: [5] })
    expect(contains(two, five)).toBe(true)
    expect(contains(five, two)).toBe(false)
  })

  it('include sets: the larger selection contains the smaller one', () => {
    const slow = sublayer({ speed: ['<2'] })
    const slowAndMid = sublayer({ speed: ['<2', '2-4'] })
    expect(contains(slowAndMid, slow)).toBe(true)
    expect(contains(slow, slowAndMid)).toBe(false)
  })

  it('exclude sets: excluding less contains excluding more', () => {
    const excludeOne = sublayer({ speed: ['<2'] }, { speed: 'exclude' })
    const excludeTwo = sublayer({ speed: ['<2', '2-4'] }, { speed: 'exclude' })
    expect(contains(excludeOne, excludeTwo)).toBe(true)
    expect(contains(excludeTwo, excludeOne)).toBe(false)
  })

  it('mixed include and exclude are never contained', () => {
    const include = sublayer({ speed: ['<2', '2-4', '4-6'] })
    const exclude = sublayer({ speed: ['<2'] }, { speed: 'exclude' })
    expect(contains(include, exclude)).toBe(false)
  })

  it('ranges: the wider range contains the narrower one', () => {
    const wide = sublayer({ radiance: [10, 500] })
    const narrow = sublayer({ radiance: [20, 100] })
    expect(contains(wide, narrow)).toBe(true)
    expect(contains(narrow, wide)).toBe(false)
  })

  it('filters on different fields are not contained either way', () => {
    const port = sublayer({ distance_from_port_km: [2] })
    const speed = sublayer({ speed: ['<2'] })
    expect(contains(port, speed)).toBe(false)
    expect(contains(speed, port)).toBe(false)
  })
})

const dataview = (id: string, filters: Record<string, unknown> = {}) =>
  ({
    id,
    datasets: [dataset],
    config: { filters, color: `#${id}` },
  }) as unknown as UrlDataviewInstance

describe('getReportHoursMode', () => {
  const rows = [
    { vesselId: 'shared', dataviewId: 'a', value: 10 },
    { vesselId: 'shared', dataviewId: 'b', value: 4 },
    { vesselId: 'onlyB', dataviewId: 'b', value: 1 },
  ]

  it('total: sublayers differ only in vessel-level filters', () => {
    const dataviews = [dataview('a'), dataview('b', { flag: ['ITA'] })]
    expect(getReportHoursMode(rows, dataviews)).toBe('total')
  })

  it('total: one sublayer holds the other (distance >= 2 against >= 5)', () => {
    const dataviews = [
      dataview('a', { distance_from_port_km: [2] }),
      dataview('b', { distance_from_port_km: [5] }),
    ]
    expect(getReportHoursMode(rows, dataviews)).toBe('total')
  })

  it('total: position filters on different fields but no vessel in both', () => {
    const dataviews = [
      dataview('a', { distance_from_port_km: [2] }),
      dataview('b', { speed: ['<2'] }),
    ]
    expect(getReportHoursMode([rows[0], rows[2]], dataviews)).toBe('total')
  })

  it('byLayer: a shared vessel in sublayers that none holds', () => {
    const dataviews = [
      dataview('a', { distance_from_port_km: [2] }),
      dataview('b', { speed: ['<2'] }),
    ]
    expect(getReportHoursMode(rows, dataviews)).toBe('byLayer')
  })
})

describe('getHoursByLayer', () => {
  it('sums each sublayer in sublayer order and skips empty ones', () => {
    const rows = [
      { vesselId: 'x', dataviewId: 'b', value: 4 },
      { vesselId: 'x', dataviewId: 'a', value: 10 },
      { vesselId: 'y', dataviewId: 'b', value: 1 },
    ]
    expect(getHoursByLayer(rows, [dataview('a'), dataview('b'), dataview('c')])).toEqual([
      { color: '#a', hours: 10 },
      { color: '#b', hours: 5 },
    ])
  })
})

describe('getTilesHoursMode', () => {
  const vms = { id: 'public-vms-chl-fishing-effort:v5.0', filters: {} } as unknown as Dataset
  const vmsDataview = (id: string) =>
    ({ id, datasets: [vms], config: { filters: {} } }) as unknown as UrlDataviewInstance

  it('counts only the unfiltered sublayer when another one filters by flag', () => {
    const dataviews = [dataview('italy', { flag: ['ITA'] }), dataview('all')]
    expect(getTilesHoursMode(dataviews)).toEqual({ mode: 'total', sublayerIds: ['all'] })
  })

  it('counts the least restrictive distance filter', () => {
    const dataviews = [
      dataview('five', { distance_from_port_km: [5] }),
      dataview('two', { distance_from_port_km: [2] }),
    ]
    expect(getTilesHoursMode(dataviews)).toEqual({ mode: 'total', sublayerIds: ['two'] })
  })

  it('adds up sublayers that share no dataset', () => {
    const dataviews = [dataview('ais'), vmsDataview('vms')]
    expect(getTilesHoursMode(dataviews)).toEqual({ mode: 'total', sublayerIds: ['ais', 'vms'] })
  })

  it('adds up sublayers that share nothing, like Italy and Spain', () => {
    const dataviews = [dataview('italy', { flag: ['ITA'] }), dataview('spain', { flag: ['ESP'] })]
    expect(getTilesHoursMode(dataviews)).toEqual({ mode: 'total', sublayerIds: ['italy', 'spain'] })
  })

  it('byLayer when sublayers overlap and none holds the others', () => {
    const dataviews = [dataview('italy', { flag: ['ITA'] }), dataview('slow', { speed: ['<2'] })]
    expect(getTilesHoursMode(dataviews)).toEqual({ mode: 'byLayer' })
  })
})

describe('unmatched detections', () => {
  // Detections reports add one row per sublayer without a vessel id
  const unmatched = (dataviewId: string, value: number) => ({ vesselId: '', dataviewId, value })

  it('counts only the sublayer that holds the other one, and is not one shared vessel', () => {
    const dataviews = [dataview('all'), dataview('italy', { flag: ['ITA'] })]
    const rows = [unmatched('all', 100), unmatched('italy', 30)]
    expect(getReportHoursMode(rows, dataviews)).toBe('total')
    expect(getUnmatchedDetections(rows, dataviews)).toBe(100)
  })

  it('adds up sublayers that share no dataset', () => {
    const vms = { id: 'public-vms-chl-fishing-effort:v5.0', filters: {} } as unknown as Dataset
    const dataviews = [
      dataview('ais'),
      { id: 'vms', datasets: [vms], config: { filters: {} } } as unknown as UrlDataviewInstance,
    ]
    const rows = [unmatched('ais', 100), unmatched('vms', 30)]
    expect(getUnmatchedDetections(rows, dataviews)).toBe(130)
  })

  it('byLayer when no sublayer holds the other, and the total adds both', () => {
    const dataviews = [dataview('a', { speed: ['<2'] }), dataview('b', { flag: ['ITA'] })]
    const rows = [unmatched('a', 100), unmatched('b', 30)]
    expect(getReportHoursMode(rows, dataviews)).toBe('byLayer')
    expect(getUnmatchedDetections(rows, dataviews)).toBe(130)
  })
})

describe('disjoint sublayers', () => {
  const exclude = (id: string, filters: Record<string, unknown>) =>
    ({
      ...dataview(id, filters),
      config: {
        filters,
        filterOperators: Object.fromEntries(Object.keys(filters).map((key) => [key, 'exclude'])),
        color: `#${id}`,
      },
    }) as unknown as UrlDataviewInstance

  it('include and exclude of the same values share nothing, two excludes share null values', () => {
    const include = sublayer({ speed: ['<2'] })
    const excludeSpeed = sublayer({ speed: ['<2'] }, { speed: 'exclude' })
    const excludeOther = sublayer({ speed: ['2-4'] }, { speed: 'exclude' })
    expect(sublayerFiltersNonOverlapping(include, excludeSpeed)).toBe(true)
    expect(sublayerFiltersNonOverlapping(include, sublayer({ speed: ['2-4'] }))).toBe(true)
    expect(sublayerFiltersNonOverlapping(excludeSpeed, excludeOther)).toBe(false)
  })

  it('ranges that do not meet share nothing', () => {
    expect(
      sublayerFiltersNonOverlapping(
        sublayer({ radiance: [0, 10] }),
        sublayer({ radiance: [20, 30] })
      )
    ).toBe(true)
    expect(
      sublayerFiltersNonOverlapping(
        sublayer({ radiance: [0, 20] }),
        sublayer({ radiance: [20, 30] })
      )
    ).toBe(false)
  })

  it('tiles: Italy and excluding Italy add up', () => {
    const dataviews = [dataview('italy', { flag: ['ITA'] }), exclude('rest', { flag: ['ITA'] })]
    expect(getTilesHoursMode(dataviews)).toEqual({ mode: 'total', sublayerIds: ['italy', 'rest'] })
  })

  it('vessels: a vessel in sublayers keeping different positions counts the sum of its rows', () => {
    const dataviews = [dataview('slow', { speed: ['<2'] }), exclude('rest', { speed: ['<2'] })]
    const rows = [
      { vesselId: 'x', dataviewId: 'slow', value: 10 },
      { vesselId: 'x', dataviewId: 'rest', value: 4 },
    ]
    expect(getReportHoursMode(rows, dataviews)).toBe('total')
    expect(getVesselValue(rows, getFiltersByDataview(dataviews))).toBe(14)
  })

  it('vessels: the largest value when one sublayer holds the other', () => {
    const dataviews = [dataview('all'), dataview('slow', { speed: ['<2'] })]
    const rows = [
      { vesselId: 'x', dataviewId: 'all', value: 10 },
      { vesselId: 'x', dataviewId: 'slow', value: 4 },
    ]
    expect(getVesselValue(rows, getFiltersByDataview(dataviews))).toBe(10)
  })
})
