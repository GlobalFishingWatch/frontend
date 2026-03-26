import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import {
  CONFIG_BY_INTERVAL,
  FOURWINGS_INTERVALS_ORDER,
  getFourwingsInterval,
  getTimeRangeKey,
} from './time'

describe('time helpers', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('getTimeRangeKey', () => {
    it('should return formatted key from start and end frame numbers', () => {
      expect(getTimeRangeKey(0, 10)).toBe('0-10')
      expect(getTimeRangeKey(100, 200)).toBe('100-200')
    })
  })

  describe('getFourwingsInterval', () => {
    it('should return first available interval when start or end is empty', () => {
      expect(getFourwingsInterval('', '2024-01-02')).toBe('HOUR')
      expect(getFourwingsInterval('2024-01-01', '')).toBe('HOUR')
    })

    it('should return HOUR for short duration (less than 3 days)', () => {
      const start = '2024-01-01T00:00:00.000Z'
      const end = '2024-01-02T00:00:00.000Z'
      expect(getFourwingsInterval(start, end)).toBe('HOUR')
    })

    it('should return DAY for medium duration (less than 3 months)', () => {
      const start = '2024-01-01T00:00:00.000Z'
      const end = '2024-02-15T00:00:00.000Z'
      expect(getFourwingsInterval(start, end)).toBe('DAY')
    })

    it('should return MONTH for longer duration (less than 3 years)', () => {
      const start = '2024-01-01T00:00:00.000Z'
      const end = '2025-06-01T00:00:00.000Z'
      expect(getFourwingsInterval(start, end)).toBe('MONTH')
    })

    it('should return YEAR for very long duration', () => {
      const start = '2020-01-01T00:00:00.000Z'
      const end = '2024-12-31T00:00:00.000Z'
      expect(getFourwingsInterval(start, end)).toBe('YEAR')
    })

    it('should accept millisecond timestamps', () => {
      const start = 1704067200000
      const end = 1704153600000
      expect(getFourwingsInterval(start, end)).toBe('HOUR')
    })

    it('should respect custom availableIntervals', () => {
      const start = '2024-01-01T00:00:00.000Z'
      const end = '2024-01-02T00:00:00.000Z'
      expect(
        getFourwingsInterval(start, end, ['DAY', 'MONTH', 'YEAR'])
      ).toBe('DAY')
    })
  })

  describe('CONFIG_BY_INTERVAL', () => {
    describe('HOUR', () => {
      it('should convert frame to timestamp (milliseconds)', () => {
        expect(CONFIG_BY_INTERVAL.HOUR.getIntervalTimestamp(0)).toBe(0)
        expect(CONFIG_BY_INTERVAL.HOUR.getIntervalTimestamp(1)).toBe(
          1000 * 60 * 60
        )
        expect(CONFIG_BY_INTERVAL.HOUR.getIntervalTimestamp(24)).toBe(
          24 * 1000 * 60 * 60
        )
      })

      it('should convert timestamp to frame', () => {
        expect(CONFIG_BY_INTERVAL.HOUR.getIntervalFrame(0)).toBe(0)
        expect(CONFIG_BY_INTERVAL.HOUR.getIntervalFrame(3600000)).toBe(1)
      })
    })

    describe('DAY', () => {
      it('should convert frame to timestamp', () => {
        expect(CONFIG_BY_INTERVAL.DAY.getIntervalTimestamp(0)).toBe(0)
        expect(CONFIG_BY_INTERVAL.DAY.getIntervalTimestamp(1)).toBe(
          1000 * 60 * 60 * 24
        )
      })

      it('should convert timestamp to frame', () => {
        expect(CONFIG_BY_INTERVAL.DAY.getIntervalFrame(0)).toBe(0)
        expect(CONFIG_BY_INTERVAL.DAY.getIntervalFrame(86400000)).toBe(1)
      })
    })

    describe('MONTH', () => {
      it('should convert frame to timestamp', () => {
        expect(CONFIG_BY_INTERVAL.MONTH.getIntervalTimestamp(0)).toBe(
          Date.UTC(0, 0)
        )
        expect(CONFIG_BY_INTERVAL.MONTH.getIntervalTimestamp(12)).toBe(
          Date.UTC(1, 0)
        )
      })

      it('should convert timestamp to frame', () => {
        const jan2024 = new Date('2024-01-15').getTime()
        expect(CONFIG_BY_INTERVAL.MONTH.getIntervalFrame(jan2024)).toBe(
          2024 * 12 + 0
        )
      })
    })

    describe('YEAR', () => {
      it('should convert frame to timestamp', () => {
        expect(CONFIG_BY_INTERVAL.YEAR.getIntervalTimestamp(2024)).toBe(
          Date.UTC(2024)
        )
      })

      it('should convert timestamp to frame', () => {
        const jan2024 = new Date('2024-06-15').getTime()
        expect(CONFIG_BY_INTERVAL.YEAR.getIntervalFrame(jan2024)).toBe(2024)
      })
    })
  })

  describe('FOURWINGS_INTERVALS_ORDER', () => {
    it('should have correct order from finest to coarsest', () => {
      expect(FOURWINGS_INTERVALS_ORDER).toEqual(['HOUR', 'DAY', 'MONTH', 'YEAR'])
    })
  })
})
