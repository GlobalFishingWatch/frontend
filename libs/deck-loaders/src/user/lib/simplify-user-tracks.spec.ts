import { describe, expect, it } from 'vitest'

import {
  buildUserTrackLods,
  getUserTrackLodIndex,
  simplifyUserTrackBinary,
  USER_TRACK_LOD_LEVELS,
} from './simplify-user-tracks'
import type { UserTrackBinaryData } from './types'

/**
 * Zigzagging paths whose amplitude is well under the tolerance used below, so
 * Douglas-Peucker has plenty to remove. Timestamps encode their own vertex index,
 * which is what lets the alignment assertions actually detect a desync.
 */
function makeBinary(pathLengths: number[], amplitude = 0.0001): UserTrackBinaryData {
  const positions: number[] = []
  const timestamps: number[] = []
  const startIndices = [0]
  let vertex = 0
  for (const length of pathLengths) {
    for (let i = 0; i < length; i++) {
      positions.push(i * 0.01, (i % 2 === 0 ? amplitude : -amplitude) + 10)
      timestamps.push(vertex)
      vertex++
    }
    startIndices.push(vertex)
  }
  return {
    length: pathLengths.length,
    startIndices,
    attributes: {
      getPath: { value: new Float32Array(positions), size: 2 },
      getTimestamp: { value: new Float32Array(timestamps), size: 1 },
    },
  }
}

const TOLERANCE = 0.01

describe('simplifyUserTrackBinary', () => {
  it('reduces the vertex count', () => {
    const input = makeBinary([200, 150])
    const out = simplifyUserTrackBinary(input, TOLERANCE)
    expect(out.attributes.getPath.value.length).toBeLessThan(input.attributes.getPath.value.length)
  })

  it('preserves path count and order', () => {
    const input = makeBinary([200, 150, 4])
    const out = simplifyUserTrackBinary(input, TOLERANCE)
    expect(out.length).toBe(input.length)
    expect(out.startIndices.length).toBe(input.startIndices.length)
  })

  it('never drops a path below 2 vertices', () => {
    const input = makeBinary([200, 150, 3, 2, 1])
    const out = simplifyUserTrackBinary(input, TOLERANCE)
    for (let p = 0; p < out.startIndices.length - 1; p++) {
      const before = input.startIndices[p + 1] - input.startIndices[p]
      const after = out.startIndices[p + 1] - out.startIndices[p]
      expect(after).toBeGreaterThanOrEqual(Math.min(before, 2))
    }
  })

  it('keeps getTimestamp parallel to getPath', () => {
    const out = simplifyUserTrackBinary(makeBinary([200, 150]), TOLERANCE)
    expect(out.attributes.getTimestamp.value.length).toBe(out.attributes.getPath.value.length / 2)
  })

  it('keeps each surviving vertex paired with its own timestamp', () => {
    const input = makeBinary([300])
    const out = simplifyUserTrackBinary(input, TOLERANCE)
    const src = input.attributes.getPath.value
    const outPositions = out.attributes.getPath.value
    const outTimestamps = out.attributes.getTimestamp.value
    // timestamps encode the original index, so the coordinate there must match
    for (let i = 0; i < outTimestamps.length; i++) {
      const original = outTimestamps[i]
      expect(outPositions[i * 2]).toBe(src[original * 2])
      expect(outPositions[i * 2 + 1]).toBe(src[original * 2 + 1])
    }
  })

  it('emits monotonic startIndices terminating at the vertex count', () => {
    const out = simplifyUserTrackBinary(makeBinary([200, 150, 90]), TOLERANCE)
    expect(out.startIndices[0]).toBe(0)
    for (let i = 1; i < out.startIndices.length; i++) {
      expect(out.startIndices[i]).toBeGreaterThanOrEqual(out.startIndices[i - 1])
    }
    expect(out.startIndices[out.startIndices.length - 1]).toBe(
      out.attributes.getPath.value.length / 2
    )
  })

  it('keeps the first and last vertex of every path', () => {
    const input = makeBinary([200, 150])
    const out = simplifyUserTrackBinary(input, TOLERANCE)
    for (let p = 0; p < input.startIndices.length - 1; p++) {
      const firstOut = out.startIndices[p]
      const lastOut = out.startIndices[p + 1] - 1
      expect(out.attributes.getTimestamp.value[firstOut]).toBe(input.startIndices[p])
      expect(out.attributes.getTimestamp.value[lastOut]).toBe(input.startIndices[p + 1] - 1)
    }
  })

  it('returns the input untouched for a zero tolerance', () => {
    const input = makeBinary([50])
    expect(simplifyUserTrackBinary(input, 0)).toBe(input)
  })

  it('refuses to touch data whose attributes are already misaligned', () => {
    const input = makeBinary([50])
    input.attributes.getTimestamp = { value: new Float32Array(3), size: 1 }
    expect(simplifyUserTrackBinary(input, TOLERANCE)).toBe(input)
  })
})

describe('buildUserTrackLods', () => {
  it('builds one coarse-to-fine level per configured bucket', () => {
    const lods = buildUserTrackLods(makeBinary([400]))
    expect(lods).toHaveLength(USER_TRACK_LOD_LEVELS.length)
    for (let i = 1; i < lods.length; i++) {
      // coarser levels can never hold more vertices than finer ones
      expect(lods[i - 1].binary.attributes.getPath.value.length).toBeLessThanOrEqual(
        lods[i].binary.attributes.getPath.value.length
      )
    }
  })

  it('reuses the original binary for the finest level', () => {
    const input = makeBinary([400])
    const lods = buildUserTrackLods(input)
    expect(lods[lods.length - 1].tolerance).toBe(0)
    expect(lods[lods.length - 1].binary).toBe(input)
  })
})

describe('USER_TRACK_LOD_LEVELS', () => {
  it('runs coarse to fine, ending at the untouched original', () => {
    const zooms = USER_TRACK_LOD_LEVELS.map((l) => l.minZoom)
    const tolerances = USER_TRACK_LOD_LEVELS.map((l) => l.tolerance)
    for (let i = 1; i < zooms.length; i++) {
      expect(zooms[i]).toBeGreaterThan(zooms[i - 1])
      expect(tolerances[i]).toBeLessThan(tolerances[i - 1])
    }
    // 0.5px of error at zoom 3
    expect(tolerances[0]).toBeCloseTo(0.0439, 4)
    expect(tolerances[tolerances.length - 1]).toBe(0)
  })
})

describe('getUserTrackLodIndex', () => {
  const lods = USER_TRACK_LOD_LEVELS.map((l) => ({ minZoom: l.minZoom }))

  it('picks the level whose bucket contains the zoom', () => {
    expect(getUserTrackLodIndex(lods, 0)).toBe(0)
    expect(getUserTrackLodIndex(lods, 2.9)).toBe(0)
    expect(getUserTrackLodIndex(lods, 3)).toBe(1)
    expect(getUserTrackLodIndex(lods, 4)).toBe(1)
    expect(getUserTrackLodIndex(lods, 6)).toBe(2)
    expect(getUserTrackLodIndex(lods, 8)).toBe(3)
    expect(getUserTrackLodIndex(lods, 14)).toBe(4)
  })

  it('survives an empty level list', () => {
    expect(getUserTrackLodIndex([], 5)).toBe(0)
  })
})
