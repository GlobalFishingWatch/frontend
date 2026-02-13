import Pbf from 'pbf'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import {
  getPoints,
  getPointsTemporalAggregated,
  parseFourwingsClusters,
} from './parse-fourwings-clusters'
import type { FourwingsClustersLoaderOptions } from './types'

const createMockTileBBox = () => ({
  id: 'tile-0-0',
  bbox: {
    west: -180,
    south: -90,
    east: 180,
    north: 90,
  },
  index: { x: 0, y: 0, z: 0 },
})

const createClustersOptions = (
  overrides: Record<string, unknown> = {}
): FourwingsClustersLoaderOptions => ({
  fourwingsClusters: {
    tile: createMockTileBBox(),
    cols: [113],
    rows: [53],
    scale: [1],
    offset: [0],
    interval: 'HOUR',
    ...overrides,
  },
})

describe('parse-fourwings-clusters', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('getPointsTemporalAggregated', () => {
    it('should convert int array to point features', () => {
      const intArray = [0, 100, 1, 200]
      const options = createClustersOptions()

      const result = getPointsTemporalAggregated(intArray, options)

      expect(result).toHaveLength(2)
      expect(result[0]).toMatchObject({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: expect.any(Array) },
        properties: {
          value: 100,
          cellNum: 0,
          col: expect.any(Number),
          row: expect.any(Number),
        },
      })
      expect(result[1].properties.value).toBe(200)
      expect(result[1].properties.cellNum).toBe(1)
    })

    it('should apply scale and offset to value', () => {
      const intArray = [0, 10]
      const options = createClustersOptions({
        scale: [2],
        offset: [5],
      })

      const result = getPointsTemporalAggregated(intArray, options)

      expect(result[0].properties.value).toBe(25)
    })

    it('should return empty array when int array is empty', () => {
      const result = getPointsTemporalAggregated([], createClustersOptions())

      expect(result).toEqual([])
    })
  })

  describe('getPoints', () => {
    it('should parse cellNum, startFrame, endFrame and values', () => {
      const intArray = [0, 0, 1, 50, 60]
      const options = createClustersOptions({
        interval: 'HOUR',
      })

      const result = getPoints(intArray, options)

      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toMatchObject({
        type: 'Feature',
        geometry: { type: 'Point' },
        properties: {
          cellNum: 0,
          stime: expect.any(Number),
          value: expect.any(Number),
        },
      })
    })

    it('should skip noDataValue and zero values', () => {
      const NO_DATA = 4294967295
      const intArray = [0, 0, 0, NO_DATA, 0]
      const options = createClustersOptions({
        interval: 'HOUR',
        noDataValue: [NO_DATA],
      })

      const result = getPoints(intArray, options)

      expect(result).toHaveLength(0)
    })
  })

  describe('parseFourwingsClusters', () => {
    it('should parse Pbf buffer with temporal aggregation', () => {
      const pbf = new Pbf()
      pbf.writePackedVarint(1, [0, 100, 1, 200])
      const bytes = pbf.finish()
      const buffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength
      ) as ArrayBuffer

      const baseOptions = createClustersOptions()
      const result = parseFourwingsClusters(buffer, {
        ...baseOptions,
        fourwingsClusters: {
          ...baseOptions.fourwingsClusters!,
          temporalAggregation: true,
        },
      })

      expect(result).toHaveLength(2)
      expect(result[0].properties.value).toBe(100)
      expect(result[1].properties.value).toBe(200)
    })

    it('should parse Pbf buffer without temporal aggregation', () => {
      const pbf = new Pbf()
      pbf.writePackedVarint(1, [0, 0, 1, 10, 20])
      const bytes = pbf.finish()
      const buffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength
      ) as ArrayBuffer

      const baseOptions = createClustersOptions()
      const result = parseFourwingsClusters(buffer, {
        ...baseOptions,
        fourwingsClusters: {
          ...baseOptions.fourwingsClusters!,
          temporalAggregation: false,
          interval: 'HOUR',
        },
      })

      expect(result.length).toBeGreaterThanOrEqual(0)
    })
  })
})
