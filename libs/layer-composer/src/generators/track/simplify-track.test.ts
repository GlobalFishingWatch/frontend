import type { FeatureCollection, LineString } from 'geojson'

import { simplifyTrack } from './simplify-track'

const baseGeojson: FeatureCollection<LineString> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [100, 0],
          [150, 0],
          [160, 0],
          [170, 0],
          [180, 0],
        ],
      },
      properties: {
        coordinateProperties: {
          times: [0, 1, 2, 3, 4, 5],
        },
      },
    },
  ],
}

const simplifiedGeojsons = [0, 10, 20, 50, 999].map((delta) => {
  return {
    delta,
    geojson: simplifyTrack(baseGeojson, delta),
  }
})

test('first and last position of a linestring should always be present', () => {
  simplifiedGeojsons.forEach((simplified) => {
    const geojson = simplified.geojson
    const numCoordinates = geojson.features[0].geometry.coordinates.length
    expect(geojson.features[0].geometry.coordinates[0][0]).toBe(0)
    expect(geojson.features[0].geometry.coordinates[numCoordinates - 1][0]).toBe(180)
  })
})

test('coordinate properties array should have same length as coordinates', () => {
  simplifiedGeojsons.forEach((simplified) => {
    const geojson = simplified.geojson
    const numCoordinates = geojson.features[0].geometry.coordinates.length
    const numCoordinateProps = geojson.features[0].properties?.coordinateProperties.times.length
    expect(numCoordinateProps).toBe(numCoordinates)
  })
})
