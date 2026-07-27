import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { getTimeRangeKey } from '../helpers/time'
import { getFourwingsValueTimestamp } from '../helpers/timestamps'

import { createHeatmapPbfBuffer, createMockTileBBox } from './fourwings-test-fixtures'
import { parseFourwings } from './parse-fourwings'

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
      expect(result[0].properties.dates).toBeUndefined()
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
})
