import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { parseUserTrack } from './parse-user-tracks'

describe('parseUserTrack', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const createLineStringFeature = (overrides: {
    coordinates?: [number, number][]
    coordinateProperties?: Record<string, number[]>
  } = {}) => ({
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: overrides.coordinates ?? [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    },
    properties: {
      coordinateProperties: overrides.coordinateProperties ?? {
        times: [1000, 2000, 3000],
      },
    },
  })

  const createUserTrack = (features: ReturnType<typeof createLineStringFeature>[]) => ({
    type: 'FeatureCollection',
    features,
  })

  const toArrayBuffer = (str: string): ArrayBuffer => {
    const encoded = new TextEncoder().encode(str)
    return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength)
  }

  it('should return empty object when invalid JSON', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const arrayBuffer = toArrayBuffer('invalid json')

    const result = parseUserTrack(arrayBuffer)

    expect(result).toEqual({})
    consoleSpy.mockRestore()
  })

  it('should return empty object when invalid JSON structure', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const arrayBuffer = toArrayBuffer('null')

    const result = parseUserTrack(arrayBuffer)

    expect(result).toEqual({})
    consoleSpy.mockRestore()
  })

  it('should parse valid GeoJSON with LineString and return data and binary', () => {
    const userTrack = createUserTrack([createLineStringFeature()])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer)

    expect(result).toHaveProperty('data')
    expect(result).toHaveProperty('binary')
    expect(result.data.type).toBe('FeatureCollection')
    expect(result.data.features).toHaveLength(1)
    expect(result.data.features[0].geometry.type).toBe('LineString')
  })

  it('should populate binary with correct structure', () => {
    const userTrack = createUserTrack([createLineStringFeature()])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer)

    expect(result.binary).toMatchObject({
      length: expect.any(Number),
      startIndices: expect.any(Array),
      attributes: {
        getPath: { value: expect.any(Float32Array), size: 2 },
        getTimestamp: { value: expect.any(Float32Array), size: 1 },
      },
    })
  })

  it('should flatten coordinates into getPath Float32Array', () => {
    const userTrack = createUserTrack([
      createLineStringFeature({
        coordinates: [
          [10, 20],
          [30, 40],
        ],
      }),
    ])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer)

    const pathValues = Array.from(result.binary.attributes.getPath.value)
    expect(pathValues).toEqual([10, 20, 30, 40])
  })

  it('should use coordinateProperties times for getTimestamp', () => {
    const userTrack = createUserTrack([
      createLineStringFeature({
        coordinates: [
          [0, 0],
          [1, 1],
        ],
        coordinateProperties: { times: [100, 200] },
      }),
    ])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer)

    const timestampValues = Array.from(result.binary.attributes.getTimestamp.value)
    expect(timestampValues).toEqual([100, 200])
  })

  it('should handle MultiLineString from filterTrackByCoordinateProperties', () => {
    const userTrack = createUserTrack([
      createLineStringFeature({
        coordinates: [
          [0, 0],
          [1, 1],
        ],
        coordinateProperties: { times: [100, 200] },
      }),
    ])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer)

    expect(result.binary).toBeDefined()
    expect(result.binary.length).toBeGreaterThan(0)
  })

  it('should apply filters when provided', () => {
    const userTrack = createUserTrack([
      createLineStringFeature({
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
        coordinateProperties: { times: [100, 200, 300] },
      }),
    ])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer, {
      filters: { times: [150, 250] },
    })

    expect(result.data.features).toHaveLength(1)
  })

  it('should return empty data when FeatureCollection has no features', () => {
    const userTrack = createUserTrack([])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer)

    expect(result.data.features).toHaveLength(0)
    expect(result.binary.length).toBe(0)
    expect(result.binary.startIndices).toEqual([0])
  })

  it('should use custom includeCoordinateProperties when provided', () => {
    const userTrack = createUserTrack([
      createLineStringFeature({
        coordinates: [
          [0, 0],
          [1, 1],
        ],
        coordinateProperties: { times: [100, 200], customProp: [1, 2] },
      }),
    ])
    const arrayBuffer = toArrayBuffer(JSON.stringify(userTrack))

    const result = parseUserTrack(arrayBuffer, {
      filters: {},
      includeCoordinateProperties: ['times', 'customProp'],
    })

    expect(result.data.features).toHaveLength(1)
  })
})
