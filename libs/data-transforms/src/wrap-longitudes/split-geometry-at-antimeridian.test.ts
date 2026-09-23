import { booleanPointInPolygon } from '@turf/turf'
import type { MultiPolygon, Polygon } from 'geojson'
import { describe, expect, it } from 'vitest'

import { getGeometryDissolved } from '../dissolve'

import { splitGeometryAtAntimeridian } from './wrap-longitudes'

const lons = (geometry: Polygon | MultiPolygon) =>
  (geometry as MultiPolygon).coordinates.flat(2).map(([lon]) => lon)

/** An area served the way the API serves one: two parts meeting at ±180. */
const antimeridianArea = (): MultiPolygon => ({
  type: 'MultiPolygon',
  coordinates: [
    [
      [
        [178, -18],
        [180, -18],
        [180, -16],
        [178, -16],
        [178, -18],
      ],
    ],
    [
      [
        [-180, -18],
        [-178, -18],
        [-178, -16],
        [-180, -16],
        [-180, -18],
      ],
    ],
  ],
})

describe('splitGeometryAtAntimeridian', () => {
  it('leaves an in-range geometry exactly as it is', () => {
    const geometry = antimeridianArea()
    expect(splitGeometryAtAntimeridian(geometry)).toBe(geometry)
  })

  it('cuts a ring that straddles the seam into one part per world', () => {
    // What getGeometryDissolved produces: the two parts above merged into one 178–182 ring.
    const wrapped: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [178, -18],
          [182, -18],
          [182, -16],
          [178, -16],
          [178, -18],
        ],
      ],
    }
    const split = splitGeometryAtAntimeridian(wrapped) as MultiPolygon

    expect(split.type).toBe('MultiPolygon')
    expect(split.coordinates).toHaveLength(2)
    expect(Math.min(...lons(split))).toBeGreaterThanOrEqual(-180)
    expect(Math.max(...lons(split))).toBeLessThanOrEqual(180)
  })

  it('keeps a point east of the antimeridian inside the area, which is the bug', () => {
    // A cell at -179 sits inside the real area but outside the 178–182 ring it dissolves into.
    const eastOfSeam = { type: 'Point' as const, coordinates: [-179, -17] }
    const dissolved = getGeometryDissolved(antimeridianArea())!.features[0].geometry as Polygon

    expect(booleanPointInPolygon(eastOfSeam, dissolved)).toBe(false)
    expect(booleanPointInPolygon(eastOfSeam, splitGeometryAtAntimeridian(dissolved))).toBe(true)
  })
})
