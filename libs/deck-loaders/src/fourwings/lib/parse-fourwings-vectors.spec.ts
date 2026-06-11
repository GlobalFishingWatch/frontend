import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { getFourwingsValueTimestamp } from '../helpers/timestamps'

import { createMockTileBBox, createVectorsPbfBuffer } from './fourwings-test-fixtures'
import { parseFourwingsVectors } from './parse-fourwings-vectors'

describe('parse-fourwings-vectors', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('parseFourwingsVectors', () => {
    it('should return empty array when no fourwingsVectors options', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwingsVectors(buffer)

      expect(result).toHaveLength(0)
      expect((result as typeof result & { byteLength: number }).byteLength).toBe(0)
    })

    it('should return empty array when options has no fourwingsVectors', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwingsVectors(buffer, {})

      expect(result).toHaveLength(0)
      expect((result as typeof result & { byteLength: number }).byteLength).toBe(0)
    })

    it('should parse Pbf buffer with temporal aggregation', () => {
      const buffer = createVectorsPbfBuffer(true, [
        { cellNum: 0, u: 100, v: 200 },
        { cellNum: 1, u: 50, v: 150 },
      ])

      const result = parseFourwingsVectors(buffer as ArrayBuffer, {
        fourwingsVectors: {
          tile: createMockTileBBox(),
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          temporalAggregation: true,
        },
      })

      expect(result).toHaveLength(2)
      expect(result[0].properties.velocities).toBeDefined()
      expect(result[0].properties.directions).toBeDefined()
      expect(result[0].properties.dates).toBeUndefined()
    })

    it('should parse timeseries vectors without dates and derive timestamps from frames', () => {
      const buffer = createVectorsPbfBuffer(false, [
        {
          cellNum: 0,
          u: 3,
          v: 4,
          startAbs: 0,
          endAbs: 1,
          pairs: [
            { u: 3, v: 4 },
            { u: 6, v: 8 },
          ],
        },
      ])

      const result = parseFourwingsVectors(buffer as ArrayBuffer, {
        fourwingsVectors: {
          tile: createMockTileBBox(),
          cols: [113],
          rows: [53],
          bufferedStartDate: 0,
          interval: 'HOUR',
          temporalAggregation: false,
        },
      })

      expect(result).toHaveLength(1)
      expect(result[0].properties.dates).toBeUndefined()
      expect(result[0].properties.tileStartFrame).toBe(0)
      expect(result[0].properties.startOffsets[0]).toBe(0)
      expect(result[0].properties.velocities).toHaveLength(2)
      expect(result[0].properties.directions).toHaveLength(2)
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
  })
})
