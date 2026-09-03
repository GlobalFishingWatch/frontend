import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import {
  getVesselGraphExtentClamped,
  MAX_DEPTH_VALUE,
  MAX_SPEED_VALUE,
  MIN_DEPTH_VALUE,
  MIN_SPEED_VALUE,
  parseTrack,
} from './parse-tracks'
import { DeckTrack } from './vessel-track-proto'

describe('parse-tracks', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('getVesselGraphExtentClamped', () => {
    it('should return speed extent when colorBy is speed', () => {
      const domain: [number, number] = [5, 15]
      const result = getVesselGraphExtentClamped(domain, 'speed')

      expect(result).toEqual([5, 15])
    })

    it('should clamp speed values to MIN_SPEED_VALUE and MAX_SPEED_VALUE', () => {
      const domain: [number, number] = [-5, 30]
      const result = getVesselGraphExtentClamped(domain, 'speed')

      expect(result[0]).toBe(MIN_SPEED_VALUE)
      expect(result[1]).toBe(MAX_SPEED_VALUE)
    })

    it('should return elevation extent when colorBy is elevation', () => {
      const domain: [number, number] = [-1000, -100]
      const result = getVesselGraphExtentClamped(domain, 'elevation')

      expect(result[0]).toBe(-100)
      expect(result[1]).toBe(-1000)
    })

    it('should clamp elevation values to MIN_DEPTH_VALUE and MAX_DEPTH_VALUE', () => {
      const domain: [number, number] = [-8000, -100]
      const result = getVesselGraphExtentClamped(domain, 'elevation')

      expect(result[0]).toBe(-100)
      expect(result[1]).toBe(MAX_DEPTH_VALUE)
    })

    it('should return [shallow, deep] order for elevation (negative values)', () => {
      const domain: [number, number] = [-500, -200]
      const result = getVesselGraphExtentClamped(domain, 'elevation')

      expect(result[0]).toBe(-200)
      expect(result[1]).toBe(-500)
    })

    it('should return default speed extent when domain contains NaN', () => {
      const domain: [number, number] = [NaN, 15]
      const result = getVesselGraphExtentClamped(domain, 'speed')

      expect(result).toEqual([MIN_SPEED_VALUE, MAX_SPEED_VALUE])
    })

    it('should return default elevation extent when domain contains NaN', () => {
      const domain: [number, number] = [-100, NaN]
      const result = getVesselGraphExtentClamped(domain, 'elevation')

      expect(result).toEqual([MIN_DEPTH_VALUE, MAX_DEPTH_VALUE])
    })
  })

  describe('parseTrack', () => {
    // A chunk with no positions in range comes back with an empty body, which protobuf decodes
    // to `attributes: null`.
    it('should return an empty track for an empty response body', () => {
      expect(parseTrack(new ArrayBuffer(0))).toEqual({})
    })

    // Guards the protobuf wire format itself, not just our post-processing: every field here is
    // length-delimited (packed `repeated float`/`repeated uint32`, plus two levels of nested
    // message). protobufjs 8.8.0 stopped decoding past a declared length, so a decoder regression
    // shows up as a short/garbled attribute rather than a thrown error.
    it('should round-trip an encoded track through the protobuf decoder', () => {
      const buffer = DeckTrack.encode({
        length: 3,
        startIndices: [0, 2],
        attributes: {
          getPath: { value: [1, 2, 3, 4, 5, 6], size: 2 },
          getTimestamp: { value: [0, 3600000, 7200000], size: 1 },
          getSpeed: { value: [1.5, 2.5, 30], size: 1 },
          getElevation: { value: [-100, -200, -7000], size: 1 },
        },
      }).finish()

      const track = parseTrack(
        buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
      )

      expect(track.length).toBe(3)
      expect(Array.from(track.startIndices)).toEqual([0, 2])
      expect(Array.from(track.attributes.getPath.value)).toEqual([1, 2, 3, 4, 5, 6])
      expect(track.attributes.getPath.size).toBe(2)
      expect(Array.from(track.attributes.getTimestamp.value)).toEqual([0, 3600000, 7200000])
      expect(Array.from(track.attributes.getSpeed.value)).toEqual([1.5, 2.5, 30])
      expect(Array.from(track.attributes.getElevation.value)).toEqual([-100, -200, -7000])
      // Extents are clamped from the decoded values, so a truncated attribute would move them.
      expect(track.attributes.getSpeed.extent).toEqual([MIN_SPEED_VALUE + 1.5, MAX_SPEED_VALUE])
      expect(track.attributes.getElevation.extent).toEqual([-100, MAX_DEPTH_VALUE])
    })

    it('should compute per-point gaps across path boundaries when computeGaps is on', () => {
      const buffer = DeckTrack.encode({
        length: 3,
        startIndices: [0, 2],
        attributes: {
          getPath: { value: [1, 2, 3, 4, 5, 6], size: 2 },
          getTimestamp: { value: [0, 3600000, 7200000], size: 1 },
          getSpeed: { value: [1, 1, 1], size: 1 },
          getElevation: { value: [-1, -1, -1], size: 1 },
        },
      }).finish()

      const track = parseTrack(
        buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        ) as ArrayBuffer,
        { computeGaps: true }
      )

      // index 0 -> 1h to the next point; index 1 starts a new path at index 2 so it has no
      // outgoing segment; index 2 is the last point.
      expect(Array.from(track.attributes.getGap!.value)).toEqual([1, 0, 0])
    })
  })
})
