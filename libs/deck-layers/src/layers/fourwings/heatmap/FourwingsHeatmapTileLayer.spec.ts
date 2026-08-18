import { TileLayer } from '@deck.gl/geo-layers'
import { testLayer } from '@deck.gl/test-utils/vitest'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { FourwingsComparisonMode } from './fourwings-heatmap.types'
import { getFourwingsChunk, getIntervalFrames, getTileDataCache } from './fourwings-heatmap.utils'
import { FourwingsHeatmapTileLayer } from './FourwingsHeatmapTileLayer'

const startTime = Date.UTC(2023, 0, 1)
const endTime = Date.UTC(2023, 5, 1)

const baseProps = {
  id: 'fourwings-heatmap-test',
  startTime,
  endTime,
  category: 'activity',
  sublayers: [
    {
      id: 'ais',
      visible: true,
      datasets: ['ds-a'],
      colorRamp: 'teal',
    },
    {
      id: 'vms',
      visible: true,
      datasets: ['ds-b'],
      colorRamp: 'magenta',
    },
  ],
} as any

// bare instance: enough for every method that only reads props/state/context
const makeLayer = (props: Record<string, unknown> = {}) => {
  const layer = new FourwingsHeatmapTileLayer({ ...baseProps, ...props })
  ;(layer as any).context = { viewport: { zoom: 0 } }
  layer.state = {
    error: '',
    scales: [],
    viewportLoaded: false,
    colorDomain: [],
    rampDirty: false,
    tilesCacheUpdateTimeout: null,
    tilesCache: getTileDataCache({ zoom: 0, startTime, endTime }),
    colorRanges: [],
  } as any
  layer.state.colorRanges = layer._getColorRanges()
  return layer
}

// aligns fixture values with the frame window _calculateColorDomain slices
const { startFrame } = getIntervalFrames({
  startTime,
  endTime,
  bufferedStart: getTileDataCache({ zoom: 0, startTime, endTime }).bufferedStart,
})
const feature = (values: number[][]) =>
  ({
    properties: {
      values,
      initialValues: {},
      startOffsets: values.map(() => startFrame),
    },
  }) as any

beforeAll(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(new ArrayBuffer(0), { status: 200 }))
  )
})

describe('FourwingsHeatmapTileLayer', () => {
  describe('_getColorRanges', () => {
    it('returns one ramp per sublayer in compare mode', () => {
      const ranges = makeLayer()._getColorRanges()
      expect(ranges).toHaveLength(2)
      ranges.forEach((range) => {
        expect(range.length).toBeGreaterThan(0)
        expect(range[0]).toEqual(
          expect.objectContaining({ r: expect.any(Number), g: expect.any(Number) })
        )
      })
    })

    it('returns a single diverging ramp in time compare mode', () => {
      const ranges = makeLayer({
        comparisonMode: FourwingsComparisonMode.TimeCompare,
      })._getColorRanges()
      expect(ranges).toHaveLength(1)
    })

    it('returns a bivariate ramp in bivariate mode', () => {
      const ranges = makeLayer({
        comparisonMode: FourwingsComparisonMode.Bivariate,
      })._getColorRanges()
      expect(ranges.length).toBeGreaterThan(0)
      expect(ranges.flat().length).toBeGreaterThan(0)
    })
  })

  describe('_getColorScales', () => {
    it('builds one clamped scale per color range in compare mode', () => {
      const layer = makeLayer()
      const domain = [0, 1, 2, 4, 8, 16, 32, 64, 128]
      const scales = layer._getColorScales(domain, layer.state.colorRanges)
      expect(scales).toHaveLength(layer.state.colorRanges.length)
      // clamped: values beyond the domain resolve to the last color
      expect(scales[0](1e9)).toEqual(scales[0](128))
    })

    it('builds a single scale in time compare mode', () => {
      const layer = makeLayer({ comparisonMode: FourwingsComparisonMode.TimeCompare })
      const scales = layer._getColorScales([-10, 0, 10], layer.state.colorRanges)
      expect(scales).toHaveLength(1)
    })

    it('builds one scale per axis in bivariate mode', () => {
      const layer = makeLayer({ comparisonMode: FourwingsComparisonMode.Bivariate })
      const scales = layer._getColorScales(
        [
          [0, 1, 2],
          [0, 5, 10],
        ],
        layer.state.colorRanges
      )
      expect(scales).toHaveLength(2)
    })
  })

  describe('getColorByValue', () => {
    it('returns the deck color the layer paints a value with', () => {
      const layer = makeLayer()
      const domain = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256]
      layer.state.scales = layer._getColorScales(domain, layer.state.colorRanges)
      const [r, g, b, a] = layer.getColorByValue(8)!
      const scaled = layer.state.scales[0](8)
      expect([r, g, b]).toEqual([scaled.r, scaled.g, scaled.b])
      // alpha comes back in the 0-255 range deck expects
      expect(a).toBe(Math.round(scaled.a * 255))
    })

    it('returns undefined without scales', () => {
      const layer = makeLayer()
      layer.state.scales = []
      expect(layer.getColorByValue(8)).toBeUndefined()
    })
  })

  describe('_getTimeCompareSublayers', () => {
    const compareProps = {
      comparisonMode: FourwingsComparisonMode.TimeCompare,
      compareStart: Date.UTC(2022, 0, 1),
      compareEnd: Date.UTC(2022, 5, 1),
    }

    it('throws without compare start/end', () => {
      expect(() => makeLayer()._getTimeCompareSublayers()).toThrow()
    })

    it('returns main and compare sublayers with merged datasets and matching chunks', () => {
      const sublayers = makeLayer(compareProps)._getTimeCompareSublayers()
      expect(sublayers).toHaveLength(2)
      expect(sublayers[0].datasets).toEqual(['ds-a', 'ds-b'])
      expect(sublayers[1].datasets).toEqual(['ds-a', 'ds-b'])
      expect(sublayers[0].chunk.start).toBe(startTime)
      expect(sublayers[0].chunk.end).toBe(endTime)
      expect(sublayers[1].chunk.start).toBe(compareProps.compareStart)
      expect(sublayers[1].chunk.end).toBe(compareProps.compareEnd)
    })

    it('is used by getFourwingsLayers in time compare mode', () => {
      expect(makeLayer(compareProps).getFourwingsLayers()).toHaveLength(2)
      expect(makeLayer().getFourwingsLayers()).toBe(baseProps.sublayers)
    })
  })

  describe('_getTileDataCacheKey', () => {
    it('ignores zoom changes', () => {
      const layer = makeLayer()
      const key = layer._getTileDataCacheKey()
      layer.state.tilesCache = { ...layer.state.tilesCache, zoom: 5 }
      expect(layer._getTileDataCacheKey()).toBe(key)
    })

    it('changes when sublayer datasets or filters change', () => {
      const key = makeLayer()._getTileDataCacheKey()
      const otherDatasets = makeLayer({
        sublayers: [{ ...baseProps.sublayers[0], datasets: ['ds-other'] }],
      })._getTileDataCacheKey()
      const withFilter = makeLayer({
        sublayers: baseProps.sublayers.map((s: any) => ({ ...s, filter: 'flag="ES"' })),
      })._getTileDataCacheKey()
      expect(otherDatasets).not.toBe(key)
      expect(withFilter).not.toBe(key)
    })

    it('cacheHash is empty without state', () => {
      const layer = new FourwingsHeatmapTileLayer(baseProps)
      expect(layer.cacheHash).toBe('')
    })
  })

  describe('delegation getters', () => {
    it('getInterval and getChunk delegate to fourwings utils', () => {
      const layer = makeLayer()
      expect(layer.getInterval()).toBe(getFourwingsInterval(startTime, endTime))
      expect(layer.getChunk()).toEqual(getFourwingsChunk({ start: startTime, end: endTime }))
    })

    it('getColorDomain guards against mode/domain shape mismatches', () => {
      const compareLayer = makeLayer({ comparisonMode: FourwingsComparisonMode.Bivariate })
      compareLayer.state.colorDomain = [0, 1, 2] // stale non-bivariate domain
      expect(compareLayer.getColorDomain()).toEqual([[], []])

      const layer = makeLayer()
      layer.state.colorDomain = [0, 1, 2]
      expect(layer.getColorDomain()).toEqual([0, 1, 2])
    })
  })

  describe('_calculateColorDomain', () => {
    it('returns the current domain when there is no data', () => {
      const layer = makeLayer()
      layer.state.colorDomain = [1, 2, 3]
      vi.spyOn(layer, 'getData').mockReturnValue([])
      expect(layer._calculateColorDomain()).toEqual([1, 2, 3])
    })

    it('returns ascending steps in compare mode', () => {
      const layer = makeLayer()
      vi.spyOn(layer, 'getData').mockReturnValue(
        Array.from({ length: 30 }, (_, i) => feature([[i + 1], [i * 2 + 1]]))
      )
      const domain = layer._calculateColorDomain() as number[]
      expect(domain.length).toBeGreaterThan(0)
      const sorted = [...domain].sort((a, b) => a - b)
      expect(domain).toEqual(sorted)
    })

    it('returns negative and positive steps around 0 in time compare mode', () => {
      const layer = makeLayer({
        comparisonMode: FourwingsComparisonMode.TimeCompare,
        compareStart: Date.UTC(2022, 0, 1),
        compareEnd: Date.UTC(2022, 5, 1),
      })
      vi.spyOn(layer, 'getData').mockReturnValue([
        ...Array.from({ length: 10 }, (_, i) => feature([[10 + i], [2]])), // negative change
        ...Array.from({ length: 10 }, (_, i) => feature([[2], [10 + i]])), // positive change
      ])
      const domain = layer._calculateColorDomain() as number[]
      expect(domain).toContain(0)
      expect(domain.some((d) => d < 0)).toBe(true)
      expect(domain.some((d) => d > 0)).toBe(true)
    })

    it('returns one steps array per sublayer in bivariate mode', () => {
      const layer = makeLayer({ comparisonMode: FourwingsComparisonMode.Bivariate })
      vi.spyOn(layer, 'getData').mockReturnValue(
        Array.from({ length: 30 }, (_, i) => feature([[i + 1], [i * 3 + 1]]))
      )
      const domain = layer._calculateColorDomain() as number[][]
      expect(domain).toHaveLength(2)
      expect(domain[0].length).toBeGreaterThan(0)
      expect(domain[1].length).toBeGreaterThan(0)
    })
  })

  describe('lifecycle', () => {
    it('initializes state and renders a TileLayer', () => {
      testLayer({
        Layer: FourwingsHeatmapTileLayer,
        onError: (error) => {
          throw error
        },
        testCases: [
          {
            title: 'initialize',
            props: baseProps,
            onAfterUpdate: ({ layer, subLayer }) => {
              expect(subLayer).toBeInstanceOf(TileLayer)
              const heatmapLayer = layer as FourwingsHeatmapTileLayer
              expect(heatmapLayer.state.tilesCache.interval).toBeDefined()
              expect(heatmapLayer.getColorRange()).toHaveLength(2)
              expect(heatmapLayer.getError()).toBe('')
            },
          },
          {
            title: 'switch to time compare',
            updateProps: {
              comparisonMode: FourwingsComparisonMode.TimeCompare,
              compareStart: Date.UTC(2022, 0, 1),
              compareEnd: Date.UTC(2022, 5, 1),
            },
            onAfterUpdate: ({ layer }) => {
              const heatmapLayer = layer as FourwingsHeatmapTileLayer
              expect(heatmapLayer.getColorRange()).toHaveLength(1)
              expect(heatmapLayer.getFourwingsLayers()).toHaveLength(2)
            },
          },
        ],
      })
    })
  })
})
