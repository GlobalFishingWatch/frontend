import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { parseEvents } from './parse-events'

const toArrayBuffer = (str: string): ArrayBuffer => {
  const encoded = new TextEncoder().encode(str)
  return encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength)
}

describe('parseEvents', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  it('should parse events from ArrayBuffer and return deck layer format', () => {
    const events = [
      {
        position: { lon: -122.4, lat: 37.8 },
        start: '2024-01-15T10:00:00.000Z',
        end: '2024-01-15T12:00:00.000Z',
        type: 'fishing',
      },
    ]
    const arrayBuffer = toArrayBuffer(JSON.stringify({ entries: events }))

    const result = parseEvents(arrayBuffer)

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      type: 'fishing',
      coordinates: [-122.4, 37.8],
      start: expect.any(Number),
      end: expect.any(Number),
      props: { color: expect.any(String) },
    })
  })

  it('should convert ISO dates to millisecond timestamps', () => {
    const events = [
      {
        position: { lon: 0, lat: 0 },
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-01T01:00:00.000Z',
        type: 'encounter',
      },
    ]
    const arrayBuffer = toArrayBuffer(JSON.stringify({ entries: events }))

    const result = parseEvents(arrayBuffer)

    expect(result[0].start).toBe(1704067200000)
    expect(result[0].end).toBe(1704070800000)
  })

  it('should return empty array when entries is empty', () => {
    const arrayBuffer = toArrayBuffer(JSON.stringify({ entries: [] }))

    const result = parseEvents(arrayBuffer)

    expect(result).toEqual([])
  })

  it('should return undefined when entries is undefined', () => {
    const arrayBuffer = toArrayBuffer(JSON.stringify({}))

    const result = parseEvents(arrayBuffer)

    expect(result).toBeUndefined()
  })

  it('should assign color from EVENTS_COLORS for each event type', () => {
    const events = [
      {
        position: { lon: 0, lat: 0 },
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-01T01:00:00.000Z',
        type: 'port_visit',
      },
    ]
    const arrayBuffer = toArrayBuffer(JSON.stringify({ entries: events }))

    const result = parseEvents(arrayBuffer)

    expect(result[0].props?.color).toBe('#99EEFF')
  })

  it('should preserve event attributes other than position, start, end, type', () => {
    const events = [
      {
        position: { lon: -10, lat: 20 },
        start: '2024-01-01T00:00:00.000Z',
        end: '2024-01-01T01:00:00.000Z',
        type: 'loitering',
        vesselId: 'vessel-123',
        customField: 'custom-value',
      },
    ]
    const arrayBuffer = toArrayBuffer(JSON.stringify({ entries: events }))

    const result = parseEvents(arrayBuffer)

    expect(result[0]).toMatchObject({
      vesselId: 'vessel-123',
      customField: 'custom-value',
    })
  })
})
