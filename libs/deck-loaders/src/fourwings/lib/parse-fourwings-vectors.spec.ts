import Pbf from 'pbf'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { parseFourwingsVectors } from './parse-fourwings-vectors'

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

function createVectorsPbfBuffer(
  temporalAggregation: boolean,
  cells: { cellNum: number; u: number; v: number }[]
) {
  const pbf = new Pbf()
  if (temporalAggregation) {
    const values = cells.flatMap((c) => [c.cellNum, c.u, c.v])
    pbf.writePackedVarint(1, values)
  } else {
    const values: number[] = []
    for (const c of cells) {
      values.push(c.cellNum, 0, 1, c.u, c.v)
    }
    pbf.writePackedVarint(1, values)
  }
  const bytes = pbf.finish()
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

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

      expect(result).toEqual([])
    })

    it('should return empty array when options has no fourwingsVectors', () => {
      const buffer = new ArrayBuffer(0)

      const result = parseFourwingsVectors(buffer, {})

      expect(result).toEqual([])
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
    })
  })
})
