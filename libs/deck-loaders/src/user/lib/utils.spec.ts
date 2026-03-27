import type { FeatureCollection } from 'geojson'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { filterTrackByCoordinateProperties } from './utils'

describe('filterTrackByCoordinateProperties', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  it('should return empty FeatureCollection when geojson is null', () => {
    const result = filterTrackByCoordinateProperties(null as any)

    expect(result).toEqual({
      type: 'FeatureCollection',
      features: [],
    })
  })

  it('should return empty FeatureCollection when geojson has no features', () => {
    const result = filterTrackByCoordinateProperties({
      type: 'FeatureCollection',
      features: [],
    })

    expect(result).toEqual({
      type: 'FeatureCollection',
      features: [],
    })
  })

  it('should include features without coordinate properties when includeNonTemporalFeatures is true', () => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
          properties: {},
        },
      ],
    }

    const result = filterTrackByCoordinateProperties(geojson, {
      includeNonTemporalFeatures: true,
    })

    expect(result.features).toHaveLength(1)
    expect(result.features[0]).toEqual(geojson.features[0])
  })

  it('should filter by coordinate properties when feature has coordinateProperties', () => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
              [2, 2],
            ],
          },
          properties: {
            coordinateProperties: {
              times: [1000, 2000, 3000],
            },
          },
        },
      ],
    }

    const result = filterTrackByCoordinateProperties(geojson, {
      filters: { times: [1500, 2500] },
      includeNonTemporalFeatures: false,
    })

    expect(result.features).toHaveLength(1)
    const filteredCoords = result.features[0].geometry.coordinates
    expect(filteredCoords.length).toBeGreaterThan(0)
    expect(filteredCoords.length).toBeLessThanOrEqual(3)
  })

  it('should filter by feature properties when no coordinateProperties', () => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
          properties: { type: 'fishing' },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [2, 2],
              [3, 3],
            ],
          },
          properties: { type: 'transit' },
        },
      ],
    }

    const result = filterTrackByCoordinateProperties(geojson, {
      filters: { type: ['fishing'] },
      includeNonTemporalFeatures: false,
    })

    expect(result.features).toHaveLength(1)
    expect(result.features[0].properties?.type).toBe('fishing')
  })

  it('should convert to MultiLineString when filtering by coordinate properties', () => {
    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 0],
              [1, 1],
              [2, 2],
            ],
          },
          properties: {
            coordinateProperties: {
              times: [1000, 2000, 3000],
            },
          },
        },
      ],
    }

    const result = filterTrackByCoordinateProperties(geojson, {
      filters: { times: [1500, 2500] },
    })

    expect(result.features[0].geometry.type).toBe('MultiLineString')
  })
})
