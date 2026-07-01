import type { Polygon } from 'geojson'
import { describe, expect, it } from 'vitest'

import { getPolygonsIntersection, getPolygonsUnion, type PolygonGeomCoords } from './union'

// Two axis-aligned squares overlapping in a 1x1 corner
const squareA: Polygon['coordinates'] = [
  [
    [0, 0],
    [2, 0],
    [2, 2],
    [0, 2],
    [0, 0],
  ],
]
const squareB: Polygon['coordinates'] = [
  [
    [1, 1],
    [3, 1],
    [3, 3],
    [1, 3],
    [1, 1],
  ],
]
const disjoint: Polygon['coordinates'] = [
  [
    [10, 10],
    [11, 10],
    [11, 11],
    [10, 11],
    [10, 10],
  ],
]

describe('getPolygonsUnion', () => {
  it('returns [] for no input', () => {
    expect(getPolygonsUnion([])).toEqual([])
  })

  it('merges overlapping polygons into a single ring', () => {
    const result = getPolygonsUnion([squareA, squareB])
    // one merged polygon
    expect(result).toHaveLength(1)
    // exterior ring of the L-shaped union has 9 points (8 unique + closing)
    expect(result[0][0].length).toBeGreaterThan(5)
  })

  it('emits closed rings (first === last coord)', () => {
    // regression: booleanPointInPolygon throws "First and last coordinates in a ring
    // must be the same" if the union backend leaves rings open (martinez did).
    for (const poly of getPolygonsUnion([squareA, squareB, disjoint])) {
      for (const ring of poly) {
        expect(ring[0]).toEqual(ring[ring.length - 1])
      }
    }
  })

  it('keeps disjoint polygons as separate members', () => {
    const result = getPolygonsUnion([squareA, disjoint])
    expect(result).toHaveLength(2)
  })

  it('accepts MultiPolygon coords as input', () => {
    const multi: PolygonGeomCoords = [squareA, disjoint]
    const result = getPolygonsUnion([multi, squareB])
    // squareA+squareB merge, disjoint stays → 2 members
    expect(result).toHaveLength(2)
  })
})

describe('getPolygonsIntersection', () => {
  it('returns the overlapping region', () => {
    const result = getPolygonsIntersection(squareA, squareB)
    expect(result).toHaveLength(1)
    // overlap is the unit square [1,1]-[2,2], area 1
    const ring = result[0][0]
    const xs = ring.map((p) => p[0])
    const ys = ring.map((p) => p[1])
    expect(Math.min(...xs)).toBe(1)
    expect(Math.max(...xs)).toBe(2)
    expect(Math.min(...ys)).toBe(1)
    expect(Math.max(...ys)).toBe(2)
  })

  it('returns [] when polygons do not overlap', () => {
    expect(getPolygonsIntersection(squareA, disjoint)).toEqual([])
  })
})
