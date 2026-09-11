import { scaleLinear } from 'd3-scale'
import { describe, expect, it, vi } from 'vitest'

import { FourwingsHeatmapStaticLayer } from './FourwingsHeatmapStaticLayer'

const colorObj = (v: number) => ({ r: v, g: v, b: v, a: 1 })
const scale = scaleLinear([0, 100], [colorObj(0), colorObj(255)]).clamp(true)

const baseProps = {
  id: 'fourwings-static-test',
  category: 'activity',
  resolution: 'default',
  tilesUrl: 'https://gateway.test/v3/4wings/tile/heatmap/{z}/{x}/{y}',
  sublayers: [
    {
      id: 'ais',
      visible: true,
      datasets: ['ds-a'],
      colorRamp: 'teal',
    },
  ],
} as any

const makeLayer = (props: Record<string, unknown> = {}) => {
  const layer = new FourwingsHeatmapStaticLayer({ ...baseProps, ...props })
  layer.state = {
    error: '',
    colorDomain: [],
    colorRanges: layer._getColorRanges(),
    scales: [scale],
    rampDirty: false,
    viewportLoaded: false,
    tilesCacheUpdateTimeout: null,
  } as any
  return layer
}

/** One cell, as the aggregated 4wings parser emits it: a single value at frame 0 */
const staticFeature = (values: number[]) =>
  ({
    coordinates: [0, 0, 1, 0, 1, 1, 0, 1],
    properties: {
      values: [values],
      startOffsets: [0],
      initialValues: {},
    },
  }) as any

const tile = { index: { x: 1, y: 2, z: 3 }, id: '1-2-3' } as any

describe('FourwingsHeatmapStaticLayer', () => {
  describe('_getTileUrl', () => {
    it('requests the custom binary format, temporally aggregated by the API', () => {
      const url = makeLayer()._getTileUrl(tile)
      expect(url).toContain('format=4WINGS')
      expect(url).toContain('temporal-aggregation=true')
      // getURLFromTemplate decodeURI's the template, so the brackets come back unescaped
      expect(url).toContain('datasets[0]=ds-a')
      // an aggregated tile has no time dimension at all
      expect(url).not.toContain('interval')
      expect(url).not.toContain('date-range')
    })

    it('resolves the tile template and carries the sublayer filters', () => {
      const url = makeLayer({
        sublayers: [{ ...baseProps.sublayers[0], filter: 'flag in (ESP)' }],
      })._getTileUrl(tile)
      expect(url).toContain('/heatmap/3/1/2?')
      expect(url).toContain('filters[0]=flag in (ESP)')
    })
  })

  describe('_getTileDataCacheKey', () => {
    it('does not change when the timebar moves', () => {
      const before = makeLayer({ startTime: 0, endTime: 10 })._getTileDataCacheKey()
      const after = makeLayer({ startTime: 500, endTime: 900 })._getTileDataCacheKey()
      expect(before).toBe(after)
    })

    // a cache key derived from Date.now() refetches every tile on every render
    it('is stable across renders', () => {
      expect(makeLayer()._getTileDataCacheKey()).toBe(makeLayer()._getTileDataCacheKey())
    })

    it('changes when the datasets or filters change', () => {
      const base = makeLayer()._getTileDataCacheKey()
      const otherDataset = makeLayer({
        sublayers: [{ ...baseProps.sublayers[0], datasets: ['ds-b'] }],
      })._getTileDataCacheKey()
      const filtered = makeLayer({
        sublayers: [{ ...baseProps.sublayers[0], filter: 'flag in (ESP)' }],
      })._getTileDataCacheKey()
      expect(base).not.toBe(otherDataset)
      expect(base).not.toBe(filtered)
    })
  })

  describe('_calculateColorDomain', () => {
    it('returns ascending steps aggregated from the cell values', () => {
      const layer = makeLayer()
      vi.spyOn(layer, 'getData').mockReturnValue(
        Array.from({ length: 30 }, (_, i) => staticFeature([i + 1]))
      )
      const domain = layer._calculateColorDomain() as number[]
      expect(domain.length).toBeGreaterThan(0)
      expect(domain).toEqual([...domain].sort((a, b) => a - b))
    })

    it('returns the current domain when there is no data', () => {
      const layer = makeLayer()
      layer.state.colorDomain = [1, 2, 3]
      vi.spyOn(layer, 'getData').mockReturnValue([])
      expect(layer._calculateColorDomain()).toEqual([1, 2, 3])
    })
  })

  it('cacheHash tracks ramp dirtiness', () => {
    const layer = makeLayer()
    expect(layer.cacheHash).toBe('teal|false|undefined-undefined')
    layer.state.rampDirty = true
    expect(layer.cacheHash).toBe('teal|true|undefined-undefined')
  })

  // The report timeseries retriggers off cacheHash, and it honours min/maxVisibleValue even
  // though the tile data does not change, so the bounds have to be part of the hash.
  it('cacheHash changes when a visible-value bound changes', () => {
    const unbounded = makeLayer()
    const bounded = makeLayer({
      sublayers: [{ ...baseProps.sublayers[0], maxVisibleValue: 2032 }],
    })
    expect(unbounded.cacheHash).not.toBe(bounded.cacheHash)
  })

  it('cacheHash changes when the sublayer color ramp changes', () => {
    const teal = makeLayer()
    const magenta = makeLayer({ sublayers: [{ ...baseProps.sublayers[0], colorRamp: 'magenta' }] })
    expect(teal.cacheHash).not.toBe(magenta.cacheHash)
  })
})
