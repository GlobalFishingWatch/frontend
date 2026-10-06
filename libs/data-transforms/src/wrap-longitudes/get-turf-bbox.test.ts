import type { MultiPolygon, Polygon } from 'geojson'
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

describe('wrapGeometryBbox', () => {
  it('returns the plain bbox for an area away from the antimeridian', () => {
    const geometry: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [1, 2],
          [3, -4],
          [5, 6],
          [1, 2],
        ],
      ],
    }
    expect(wrapGeometryBbox(geometry)).toEqual([1, -4, 5, 6])
  })

  it('unwraps an area split exactly at ±180', () => {
    expect(wrapGeometryBbox(antimeridianArea())).toEqual([170, -10, 185, 10])
  })

  it('unwraps an area crossing the antimeridian with no vertex on ±180', () => {
    // A small part near the Chatham Islands west of the antimeridian, the rest spanning
    // the Indian Ocean to east of New Zealand
    const geometry: MultiPolygon = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-176.8487, -43.816],
            [-176.5799, -43.8226],
            [-176.3137, -43.7964],
            [-176.8487, -43.816],
          ],
        ],
        [
          [
            [60.8663, 29.8637],
            [178.8411, -49.6336],
            [158.8797, -54.7539],
            [123.6147, 53.5436],
            [60.8663, 29.8637],
          ],
        ],
      ],
    }
    expect(wrapGeometryBbox(geometry)).toEqual([60.8663, -54.7539, 183.6863, 53.5436])
  })

  it('keeps the plain span when shifting western longitudes would make it wider', () => {
    const geometry: Polygon = {
      type: 'Polygon',
      coordinates: [
        [
          [-100, 0],
          [0, 10],
          [100, 0],
          [-100, 0],
        ],
      ],
    }
    expect(wrapGeometryBbox(geometry)).toEqual([-100, 0, 100, 10])
  })
})
