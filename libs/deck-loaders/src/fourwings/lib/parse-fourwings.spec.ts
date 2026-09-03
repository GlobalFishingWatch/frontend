import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { getTimeRangeKey } from '../helpers/time'
import { getFourwingsValueTimestamp } from '../helpers/timestamps'

import {
  createAggregatedHeatmapPbfBuffer,
  createHeatmapPbfBuffer,
  createMockTileBBox,
} from './fourwings-test-fixtures'
import { descaleFourwingsValue, parseFourwings } from './parse-fourwings'

describe('parse-fourwings', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('parseFourwings', () => {
    it('should return empty array when no options', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer)

      expect(result).toHaveLength(0)
      expect((result as typeof result & { byteLength: number }).byteLength).toBe(0)
    })

    it('should return empty array when options has no fourwings', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer, {})

      expect(result).toHaveLength(0)
      expect((result as typeof result & { byteLength: number }).byteLength).toBe(0)
    })

    it('should return empty array when fourwings has no buffersLength', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer, {
        fourwings: {
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          sublayers: 1,
        } as any,
      })

      expect(result).toHaveLength(0)
      expect((result as typeof result & { byteLength: number }).byteLength).toBe(0)
    })

    it('should return empty array when buffersLength is empty array', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwings(buffer, {
        fourwings: {
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          sublayers: 1,
          buffersLength: [],
        } as any,
      })

      expect(result).toHaveLength(0)
      expect((result as typeof result & { byteLength: number }).byteLength).toBe(0)
    })

    it('should parse heatmap cells without dates and derive timestamps from frames', () => {
      const buffer = createHeatmapPbfBuffer([
        { cellNum: 0, startAbs: 0, endAbs: 1, values: [10, 20] },
      ])

      const result = parseFourwings(buffer, {
        fourwings: {
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          sublayers: 1,
          buffersLength: [1024],
          tile: createMockTileBBox(),
          initialTimeRange: {
            start: 0,
            end: 2 * 3_600_000,
          },
        } as any,
      })

      expect(result).toHaveLength(1)
      expect(result[0].properties.tileStartFrame).toBe(0)
      expect(result[0].properties.startOffsets[0]).toBe(0)
      expect(result[0].properties.values[0]).toEqual([10, 20])
      expect((result as typeof result & { byteLength: number }).byteLength).toBeGreaterThan(0)

      const expectedTimestamps = [0, 1].map((index) =>
        getFourwingsValueTimestamp(
          'HOUR',
          result[0].properties.tileStartFrame!,
          result[0].properties.startOffsets[0],
          index
        )
      )
      expect(expectedTimestamps).toEqual([0, 3_600_000])
    })

    it('should strip the uint64 no-data value even when noDataValue is missing', () => {
      // hand rolled: the pbf writer refuses to encode 2 ** 64 - 1, only the reader sees it.
      // packed field 1, then cellNum 0, startAbs 0, endAbs 1, uint64 max, 20
      const buffer = new Uint8Array([
        0x0a, 0x0e, 0x00, 0x00, 0x01, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01,
        0x14,
      ]).buffer

      const result = parseFourwings(buffer, {
        fourwings: {
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          sublayers: 1,
          buffersLength: [1024],
          tile: createMockTileBBox(),
          initialTimeRange: { start: 0, end: 2 * 3_600_000 },
        } as any,
      })

      expect(result[0].properties.values[0][0]).toBeUndefined()
      expect(result[0].properties.values[0][1]).toBe(20)
      expect(result[0].properties.initialValues[getTimeRangeKey(0, 2)][0]).toBe(20)
    })
  })

  // The static heatmap requests temporal-aggregation=true, where the API collapses time and
  // sends one (cellNum, value) pair per cell instead of a start/end/values run.
  describe('parseFourwings with temporalAggregation', () => {
    const aggregatedOptions = (overrides: Record<string, unknown> = {}) => ({
      fourwings: {
        cols: [113],
        rows: [53],
        bufferedStartDate: 0,
        interval: 'YEAR',
        temporalAggregation: true,
        sublayers: 1,
        buffersLength: [1024],
        tile: createMockTileBBox(),
        ...overrides,
      } as any,
    })

    it('reads one value per cell into frame 0', () => {
      const buffer = createAggregatedHeatmapPbfBuffer([
        { cellNum: 0, value: 2013 },
        { cellNum: 1, value: 2276 },
        { cellNum: 5, value: 7734 },
      ])

      const result = parseFourwings(buffer, aggregatedOptions())

      expect(result).toHaveLength(3)
      expect(result.map((f) => f.properties.values[0])).toEqual([[2013], [2276], [7734]])
      expect(result.map((f) => f.properties.startOffsets[0])).toEqual([0, 0, 0])
      expect(result.map((f) => f.properties.cellNum)).toEqual([0, 1, 5])
      // col/row are what the vessels-in-cell interaction request needs, and MVT never carried them
      expect(result[0].properties.col).toBeTypeOf('number')
      expect(result[0].properties.row).toBeTypeOf('number')
      // a closed ring: 5 points, so reports-geo.utils can index corners 0..7 positionally
      expect(result[0].coordinates).toHaveLength(10)
    })

    it('skips no-data cells instead of reading them as zero', () => {
      const buffer = createAggregatedHeatmapPbfBuffer([
        { cellNum: 0, value: 500 },
        { cellNum: 1, value: 4294967295 },
        { cellNum: 2, value: 0 },
      ])

      const result = parseFourwings(buffer, aggregatedOptions({ noDataValue: [4294967295] }))

      // the no-data cell is dropped; a real 0 is kept, which is the point of the binary format
      expect(result.map((f) => f.properties.cellNum)).toEqual([0, 2])
      expect(result[1].properties.values[0]).toEqual([0])
    })

    it('skips a uint64-wrapped negative sentinel the X-empty-value header does not match', () => {
      // public-o-2-baseline-2000-2018-depthsurf sends `X-empty-value: 18446744073709551615`
      // (uint64 max) while its cells carry -9999900 as 18446744073699551716. Hand rolled because
      // the pbf writer refuses to encode either: packed field 1, cellNum 0, the sentinel,
      // cellNum 1, 500.
      const buffer = new Uint8Array([
        0x0a, 0x0e, 0x00, 0xe4, 0xd3, 0x9d, 0xfb, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01, 0x01, 0xf4,
        0x03,
      ]).buffer

      const result = parseFourwings(
        buffer,
        aggregatedOptions({ scale: [0.001], noDataValue: [Number('18446744073709551615')] })
      )

      expect(result.map((f) => f.properties.cellNum)).toEqual([1])
      expect(result[0].properties.values[0][0]).toBeCloseTo(0.5)
    })

    it('applies scale and offset from the response headers', () => {
      const buffer = createAggregatedHeatmapPbfBuffer([{ cellNum: 0, value: 300 }])

      const result = parseFourwings(buffer, aggregatedOptions({ scale: [0.01], offset: [2] }))

      expect(result[0].properties.values[0][0]).toBeCloseTo(300 * 0.01 - 2)
    })
  })

  // Three different formulas existed in this repo. Only this one turns the raw varints of
  // public-global-sst-anomalies (X-scale 0.01, X-offset 50) into physical anomalies.
  describe('descaleFourwingsValue', () => {
    it('applies value * scale - offset', () => {
      expect(descaleFourwingsValue(4078, 0.01, 50)).toBeCloseTo(-9.22)
      expect(descaleFourwingsValue(5490, 0.01, 50)).toBeCloseTo(4.9)
    })

    it('is the identity with the default scale and offset', () => {
      expect(descaleFourwingsValue(2013)).toBe(2013)
      expect(descaleFourwingsValue(2013, 1, 0)).toBe(2013)
    })
  })
})
