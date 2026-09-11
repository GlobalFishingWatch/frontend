import type { Feature, MultiPolygon, Point, Polygon } from 'geojson'
import { describe, expect, it } from 'vitest'

import { unwrapFeatureLongitudes } from './wrap-longitudes'

const feature = <T extends Point | Polygon | MultiPolygon>(geometry: T): Feature<T> => ({
  type: 'Feature',
  geometry,
  properties: {},
})

describe('unwrapFeatureLongitudes', () => {
  it('shifts a point from the world copy west of the antimeridian', () => {
    const result = unwrapFeatureLongitudes(
      feature({ type: 'Point', coordinates: [-180.9, -17.1] } as Point)
    )
    expect((result.geometry as Point).coordinates[0]).toBeCloseTo(179.1)
  })

  it('shifts a point from the world copy east of the antimeridian', () => {
    const result = unwrapFeatureLongitudes(
      feature({ type: 'Point', coordinates: [181.3, -17.7] } as Point)
    )
    expect((result.geometry as Point).coordinates[0]).toBeCloseTo(-178.7)
  })

  it('leaves coordinates already in range untouched', () => {
    const coordinates = [
      [
        [170, 0],
        [175, 0],
        [175, 5],
        [170, 0],
      ],
    ]
    const result = unwrapFeatureLongitudes(feature({ type: 'Polygon', coordinates } as Polygon))
    expect((result.geometry as Polygon).coordinates).toEqual(coordinates)
  })

  it('returns the very same object when nothing has to move', () => {
    // The report path maps this over every feature in the viewport, so the no-op case has to be
    // free: same feature, same geometry, same coordinates, no copies.
    const inRangePoint = feature({ type: 'Point', coordinates: [179.2, -17.1] } as Point)
    expect(unwrapFeatureLongitudes(inRangePoint)).toBe(inRangePoint)

    const inRangePolygon = feature({
      type: 'Polygon',
      coordinates: [
        [
          [170, 0],
          [175, 0],
          [175, 5],
          [170, 0],
        ],
      ],
    } as Polygon)
    expect(unwrapFeatureLongitudes(inRangePolygon)).toBe(inRangePolygon)
  })

  it('shifts each ring of a multipolygon independently', () => {
    const result = unwrapFeatureLongitudes(
      feature({
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-180.8, -18],
              [-180.6, -18],
              [-180.6, -17.9],
              [-180.8, -18],
            ],
          ],
          [
            [
              [179.2, -18],
              [179.4, -18],
              [179.4, -17.9],
              [179.2, -18],
            ],
          ],
        ],
      } as MultiPolygon)
    )
    const [wrapped, inRange] = (result.geometry as MultiPolygon).coordinates
    expect(wrapped[0][0][0]).toBeCloseTo(179.2)
    expect(inRange[0][0][0]).toBeCloseTo(179.2)
  })

  it('keeps latitude and any extra position values', () => {
    const result = unwrapFeatureLongitudes(
      feature({ type: 'Point', coordinates: [-180.5, 12.5, 33] } as Point)
    )
    expect((result.geometry as Point).coordinates.slice(1)).toEqual([12.5, 33])
  })

  it('does not mutate the input', () => {
    const geometry = { type: 'Point', coordinates: [-180.9, -17.1] } as Point
    unwrapFeatureLongitudes(feature(geometry))
    expect(geometry.coordinates[0]).toBe(-180.9)
  })
})
