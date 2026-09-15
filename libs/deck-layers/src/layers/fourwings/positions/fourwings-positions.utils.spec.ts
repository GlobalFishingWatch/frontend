import { describe, expect, it } from 'vitest'

import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'

import { getVesselTracks } from './fourwings-positions.utils'

const pos = (
  id: string,
  lon: number,
  lat: number,
  stime: number,
  layer = 0
): FourwingsPositionFeature =>
  ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [lon, lat] },
    properties: { id, stime, layer, value: 1 },
  }) as FourwingsPositionFeature

describe('getVesselTracks', () => {
  it('builds one track per vessel, newest ping last', () => {
    const { lastPositions, tracks } = getVesselTracks([
      pos('v1', 0, 0, 10),
      pos('v2', 5, 5, 15),
      pos('v1', 2, 2, 20),
      pos('v1', 1, 1, 30),
    ])

    expect(tracks).toHaveLength(1)
    expect(tracks[0].id).toBe('v1')
    expect([...tracks[0].path]).toEqual([0, 0, 2, 2, 1, 1])
    expect([...lastPositions].map((p) => p.properties.stime).sort()).toEqual([15, 30])
  })

  it('emits no track for a single ping but still records it as last position', () => {
    const ping = pos('v1', 10, 20, 1)
    const { lastPositions, tracks } = getVesselTracks([ping])

    expect(tracks).toEqual([])
    expect([...lastPositions]).toEqual([ping])
  })

  it('keeps an antimeridian crossing as one unwrapped path', () => {
    const { tracks } = getVesselTracks([pos('v1', 179, 0, 1), pos('v1', -179, 0, 2)])

    expect([...tracks[0].path]).toEqual([179, 0, 181, 0])
  })

  it('keeps unwrapping across a crossing that passes through lon 0', () => {
    const { tracks } = getVesselTracks([
      pos('v1', 0, 0, 1),
      pos('v1', 179, 0, 2),
      pos('v1', -179, 0, 3),
    ])

    expect([...tracks[0].path]).toEqual([0, 0, 179, 0, 181, 0])
  })

  it('drops positions with an undefined id', () => {
    const { lastPositions, tracks } = getVesselTracks([
      pos(undefined as unknown as string, 0, 0, 1),
      pos(undefined as unknown as string, 1, 1, 2),
    ])

    expect(tracks).toEqual([])
    expect(lastPositions.size).toBe(0)
  })

  it('skips path geometry but still reports last positions when includeTracks is false', () => {
    const { lastPositions, tracks } = getVesselTracks([pos('v1', 0, 0, 1), pos('v1', 1, 1, 2)], {
      includeTracks: false,
    })

    expect(tracks).toEqual([])
    expect([...lastPositions].map((p) => p.properties.stime)).toEqual([2])
  })
})
