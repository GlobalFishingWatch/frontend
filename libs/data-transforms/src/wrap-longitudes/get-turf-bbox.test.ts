import type { MultiPolygon } from 'geojson'
import { describe, expect, it } from 'vitest'

import { getTurfBbox, wrapGeometryBbox } from './wrap-longitudes'

/** Two parts of one area split at the antimeridian, as the API serves them. */
const antimeridianArea = (): MultiPolygon => ({
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [170, -10],
        [180, -10],
        [180, 10],
        [170, 10],
        [170, -10],
      ],
    ],
    [
      [
        [-180, -10],
        [-175, -10],
        [-175, 10],
        [-180, 10],
        [-180, -10],
      ],
    ],
  ],
})

describe('getTurfBbox', () => {
  it('stays within ±180 where wrapGeometryBbox deliberately does not', () => {
    const geometry = antimeridianArea()
    expect(wrapGeometryBbox(geometry)).toEqual([170, -10, 185, 10])
    expect(getTurfBbox(geometry)).toEqual([-180, -10, 180, 10])
  })

  it('ignores an unwrapped bbox member instead of handing it back', () => {
    const geometry = antimeridianArea()
    geometry.bbox = wrapGeometryBbox(geometry)
    expect(getTurfBbox(geometry)).toEqual([-180, -10, 180, 10])
  })
})
