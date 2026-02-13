import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import { isFeatureInFilter, isFeatureInFilters } from './features.utils'

describe('features.utils', () => {
  beforeEach(() => {
    vitest.clearAllMocks()
  })

  afterEach(() => {
    vitest.restoreAllMocks()
  })

  describe('isFeatureInFilter', () => {
    it('should return true when values is undefined', () => {
      const feature = { properties: { foo: 'bar' } }
      expect(isFeatureInFilter(feature, { id: 'foo', values: undefined })).toBe(true)
    })

    it('should match numeric range filter (min/max)', () => {
      const feature = { properties: { depth: 100 } }
      expect(
        isFeatureInFilter(feature, {
          id: 'depth',
          values: [50, 150],
        })
      ).toBe(true)
    })

    it('should reject when value outside numeric range', () => {
      const feature = { properties: { depth: 200 } }
      expect(
        isFeatureInFilter(feature, {
          id: 'depth',
          values: [50, 150],
        })
      ).toBe(false)
    })

    it('should match value in list filter', () => {
      const feature = { properties: { type: 'fishing' } }
      expect(
        isFeatureInFilter(feature, {
          id: 'type',
          values: ['fishing', 'trawling'],
        })
      ).toBe(true)
    })

    it('should reject when value not in list', () => {
      const feature = { properties: { type: 'other' } }
      expect(
        isFeatureInFilter(feature, {
          id: 'type',
          values: ['fishing', 'trawling'],
        })
      ).toBe(false)
    })

    it('should match value with exclude operator', () => {
      const feature = { properties: { type: 'fishing' } }
      expect(
        isFeatureInFilter(feature, {
          id: 'type',
          values: ['fishing', 'trawling'],
          operator: 'exclude',
        })
      ).toBe(false)
    })

    it('should exclude value with exclude operator when in list', () => {
      const feature = { properties: { type: 'other' } }
      expect(
        isFeatureInFilter(feature, {
          id: 'type',
          values: ['fishing', 'trawling'],
          operator: 'exclude',
        })
      ).toBe(true)
    })

    it('should return falsy when feature has no matching property', () => {
      const feature = { properties: {} }
      const result = isFeatureInFilter(feature, {
        id: 'type',
        values: ['fishing'],
      })
      expect(result).toBeFalsy()
    })
  })

  describe('isFeatureInFilters', () => {
    it('should return true when filters is empty', () => {
      const feature = { properties: { foo: 'bar' } }
      expect(isFeatureInFilters(feature, {})).toBe(true)
      expect(isFeatureInFilters(feature, undefined)).toBe(true)
    })

    it('should return true when feature matches all filters', () => {
      const feature = { properties: { type: 'fishing', depth: 100 } }
      expect(
        isFeatureInFilters(feature, {
          type: ['fishing'],
          depth: [50, 150],
        })
      ).toBe(true)
    })

    it('should return false when feature fails one filter', () => {
      const feature = { properties: { type: 'fishing', depth: 200 } }
      expect(
        isFeatureInFilters(feature, {
          type: ['fishing'],
          depth: [50, 150],
        })
      ).toBe(false)
    })
  })
})
