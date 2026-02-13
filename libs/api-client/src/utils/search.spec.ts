import { describe, expect, it } from 'vitest'

import { type AdvancedSearchQueryField, getAdvancedSearchQuery } from './search'

describe('search', () => {
  describe('getAdvancedSearchQuery', () => {
    it('should build shipname LIKE query with wildcards', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'shipname', value: 'test' }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('LIKE')
      expect(result).toContain('*TEST*')
    })

    it('should build ssvid = query with uppercase', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'ssvid', value: 'abc123' }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain("'ABC123'")
    })

    it('should build flag = query with quotation marks', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'flag', value: 'USA' }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain("'USA'")
    })

    it('should combine multiple fields with AND', () => {
      const fields: AdvancedSearchQueryField[] = [
        { key: 'ssvid', value: '123' },
        { key: 'flag', value: 'NOR' },
      ]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('AND')
      expect(result).toContain('123')
      expect(result).toContain('NOR')
    })

    it('should combine OR fields with OR and wrap in parentheses', () => {
      const fields: AdvancedSearchQueryField[] = [
        { key: 'flag', value: 'USA', combinedWithOR: true },
        { key: 'flag', value: 'NOR', combinedWithOR: true },
      ]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('OR')
      expect(result).toContain('(')
      expect(result).toContain(')')
    })

    it('should return empty string when no valid fields', () => {
      const fields: AdvancedSearchQueryField[] = [
        { key: 'shipname', value: '' },
        { key: 'ssvid', value: undefined },
      ]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toBe('')
    })

    it('should filter out empty and undefined values', () => {
      const fields: AdvancedSearchQueryField[] = [
        { key: 'shipname', value: '' },
        { key: 'ssvid', value: 'valid' },
      ]

      const result = getAdvancedSearchQuery(fields)

      expect(result).not.toContain('shipname')
      expect(result).toContain('VALID')
    })

    it('should use rootObject prefix when rootObject is selfReportedInfo', () => {
      const fields: AdvancedSearchQueryField[] = [
        { key: 'origin', value: 'test', combinedWithOR: false },
      ]

      const result = getAdvancedSearchQuery(fields, {
        rootObject: 'selfReportedInfo',
      })

      expect(result).toContain('selfReportedInfo.origin')
    })

    it('should use combinedSourcesInfo for geartypes when rootObject is selfReportedInfo', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'geartypes', value: 'trawler' }]

      const result = getAdvancedSearchQuery(fields, {
        rootObject: 'selfReportedInfo',
      })

      expect(result).toContain('combinedSourcesInfo.geartypes.name')
      expect(result).toContain('trawler')
    })

    it('should add rootObject prefix when field does not include it', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'origin', value: 'Spain' }]

      const result = getAdvancedSearchQuery(fields, {
        rootObject: 'registryInfo',
      })

      expect(result).toContain('registryInfo.origin')
    })

    it('should build id field with selfReportedInfo prefix', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'id', value: 'vessel-123' }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('selfReportedInfo.id')
      expect(result).toContain("'vessel-123'")
    })

    it('should build owner field with registryOwners prefix', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'owner', value: 'ACME' }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('registryOwners.name')
      expect(result).toContain("'*ACME*'")
    })

    it('should build shiptypes field with combinedSourcesInfo prefix', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'shiptypes', value: 'cargo' }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('combinedSourcesInfo.shiptypes.name')
    })

    it('should handle array values with OR', () => {
      const fields: AdvancedSearchQueryField[] = [{ key: 'flag', value: ['USA', 'NOR'] }]

      const result = getAdvancedSearchQuery(fields)

      expect(result).toContain('OR')
      expect(result).toContain("'USA'")
      expect(result).toContain("'NOR'")
    })
  })
})
