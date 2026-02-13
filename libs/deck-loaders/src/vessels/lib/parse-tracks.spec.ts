import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import {
  getVesselGraphExtentClamped,
  MAX_DEPTH_VALUE,
  MAX_SPEED_VALUE,
  MIN_DEPTH_VALUE,
  MIN_SPEED_VALUE,
} from './parse-tracks'

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
})
