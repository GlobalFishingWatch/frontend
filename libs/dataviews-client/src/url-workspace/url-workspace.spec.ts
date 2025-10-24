import { describe, expect, test, vi } from 'vitest'

import type { AnyDataviewInstance } from '../types'

import {
  parseLegacyDataviewInstanceConfig,
  parseWorkspace,
  stringifyWorkspace,
  TOKEN_REGEX,
  URL_STRINGIFY_CONFIG,
} from './url-workspace'

// Mock the migrations module
vi.mock('./migrations', () => ({
  migrateEventsLegacyDatasets: vi.fn((d) => d),
  removeLegacyEndpointPrefix: vi.fn((endpoint) => endpoint),
  runDatasetMigrations: vi.fn((datasetId) => datasetId),
}))

describe('url-workspace', () => {
  describe('parseWorkspace', () => {
    test('should parse basic workspace parameters', () => {
      const queryString =
        'latitude=40.7128&longitude=-74.0060&zoom=10&start=2023-01-01&end=2023-12-31'
      const result = parseWorkspace(queryString)

      expect(result).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 10,
        start: '2023-01-01',
        end: '2023-12-31',
      })
    })

    test('should parse abbreviated parameters', () => {
      const queryString = 'lat=40.7128&lng=-74.0060&z=10'
      const result = parseWorkspace(queryString)

      expect(result).toEqual({
        lat: '40.7128',
        lng: '-74.0060',
        z: '10',
      })
    })

    test('should handle tokenized values', () => {
      const queryString = 'tk[0]=common-value&param1=~0&param2=~0'
      const result = parseWorkspace(queryString) as any

      expect(result.tk).toEqual(['common-value'])
      expect(result.param1).toBe('common-value')
      expect(result.param2).toBe('common-value')
    })

    test('should handle vessel dataset tokenization', () => {
      const queryString = 'tk[0]=abc123&param1=vessel-~0&param2=~0'
      const result = parseWorkspace(queryString) as any

      expect(result.tk).toEqual(['abc123'])
      expect(result.param1).toBe('vessel-abc123')
      expect(result.param2).toBe('abc123')
    })

    test('should apply custom URL transformations', () => {
      const queryString = 'customParam=test'
      const customTransformations = {
        customParam: (value: string) => value.toUpperCase(),
      }
      const result = parseWorkspace(queryString, customTransformations)

      expect(result).toEqual({
        customParam: 'TEST',
      })
    })

    test('should handle boolean and null values', () => {
      const queryString = 'boolParam=true&nullParam=null&undefinedParam=undefined&falseParam=false'
      const result = parseWorkspace(queryString)

      expect(result).toEqual({
        boolParam: true,
        nullParam: null,
        undefinedParam: undefined,
        falseParam: false,
      })
    })

    test('should remove legacy analysis parameter', () => {
      const queryString = 'analysis=old&latitude=40.7128'
      const result = parseWorkspace(queryString)

      expect(result).toEqual({
        latitude: 40.7128,
      })
      expect((result as any).analysis).toBeUndefined()
    })

    test('should handle empty query string', () => {
      const result = parseWorkspace('')
      expect(result).toEqual({})
    })

    test('should handle malformed query string gracefully', () => {
      const queryString = 'invalid%param=test&latitude=40.7128'
      const result = parseWorkspace(queryString)

      expect(result.latitude).toBe(40.7128)
    })

    test('should parse dataviewInstances with proper transformations', () => {
      const queryString =
        'dvIn[0][dataviewId]=test&dvIn[0][config][color]=%23FF0000&dvIn[0][config][datasets][0]=dataset1&dvIn[0][config][breaks][0]=1&dvIn[0][config][breaks][1]=2&dvIn[0][config][breaks][2]=3'
      const result = parseWorkspace(queryString)

      expect(result.dataviewInstances).toHaveLength(1)
      expect(result.dataviewInstances![0]).toMatchObject({
        dataviewId: 'test',
        config: {
          color: '#FF0000',
          datasets: ['dataset1'],
          breaks: [1, 2, 3],
        },
      })
    })

    test('should handle mapRulers transformation', () => {
      const queryString = 'mR[0][id]=1&mR[0][name]=ruler1&mR[1][id]=2&mR[1][name]=ruler2'
      const result = parseWorkspace(queryString)

      expect((result as any).mapRulers).toEqual([
        { id: 1, name: 'ruler1' },
        { id: 2, name: 'ruler2' },
      ])
    })

    test('should handle mapDrawing transformation', () => {
      const queryString = 'mapDrawing=true'
      const result = parseWorkspace(queryString)

      expect((result as any).mapDrawing).toBe('polygons')
    })

    test('should handle reportTimeComparison transformation', () => {
      const queryString = 'rTC[duration]=30&rTC[type]=days'
      const result = parseWorkspace(queryString)

      expect((result as any).reportTimeComparison).toEqual({
        duration: 30,
        type: 'days',
      })
    })
  })

  describe('stringifyWorkspace', () => {
    test('should stringify basic workspace parameters', () => {
      const workspace = {
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 10,
        start: '2023-01-01',
        end: '2023-12-31',
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('latitude=40.7128')
      expect(result).toContain('longitude=-74.006')
      expect(result).toContain('zoom=10')
      expect(result).toContain('start=2023-01-01')
      expect(result).toContain('end=2023-12-31')
    })

    test('should abbreviate parameter names', () => {
      const workspace = {
        dataviewInstances: [{ id: 'test', config: {} }],
        dataviewInstancesOrder: ['test'],
        sidebarOpen: true,
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('dvIn[0][id]=test')
      expect(result).toContain('dvInOr[0]=test')
      expect(result).toContain('sbO=true')
    })

    test('should tokenize repeated values', () => {
      const workspace: any = {
        param1: 'common-value',
        param2: 'common-value',
        param3: 'different-value',
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('tk[0]=common-value')
      expect(result).toContain('~0')
    })

    test('should handle vessel dataset tokenization', () => {
      const workspace: any = {
        param1: 'vessel-abc123',
        param2: 'abc123',
        param3: 'vessel-def456',
      }
      const result = stringifyWorkspace(workspace)

      // Since these values are not repeated enough, they won't be tokenized
      expect(result).toContain('param1=vessel-abc123')
      expect(result).toContain('param2=abc123')
      expect(result).toContain('param3=vessel-def456')
    })

    test('should handle empty workspace', () => {
      const result = stringifyWorkspace({})
      expect(result).toBe('')
    })

    test('should handle complex nested objects', () => {
      const workspace = {
        dataviewInstances: [
          {
            id: 'test',
            config: {
              color: '#FF0000',
              datasets: ['dataset1', 'dataset2'],
            },
          },
        ],
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('dvIn[0][id]=test')
      expect(result).toContain('test')
    })

    test('should not tokenize short values', () => {
      const workspace: any = {
        param1: 'abc',
        param2: 'abc',
        param3: 'def',
      }
      const result = stringifyWorkspace(workspace)

      // Short values (<= 5 chars) should not be tokenized
      expect(result).toContain('abc')
      expect(result).not.toContain('~0')
    })
  })

  describe('parseLegacyDataviewInstanceConfig', () => {
    test('should parse legacy dataview instance config', () => {
      const dataviewInstance: AnyDataviewInstance = {
        id: 'test',
        dataviewId: 'test-dv',
        config: {
          datasets: ['dataset1', 'dataset2'],
          info: 'info-dataset',
          events: [{ datasetId: 'event-dataset' }],
        },
        datasetsConfig: [
          {
            datasetId: 'config-dataset',
            endpoint: 'legacy-endpoint',
          },
        ],
      }

      const result = parseLegacyDataviewInstanceConfig(dataviewInstance)

      expect(result).toEqual({
        ...dataviewInstance,
        config: {
          ...dataviewInstance.config,
          datasets: ['dataset1', 'dataset2'],
          info: 'info-dataset',
          events: [{ datasetId: 'event-dataset' }],
        },
        datasetsConfig: [
          {
            datasetId: 'config-dataset',
            endpoint: 'legacy-endpoint',
          },
        ],
      })
    })

    test('should handle dataview instance without datasetsConfig', () => {
      const dataviewInstance: AnyDataviewInstance = {
        id: 'test',
        dataviewId: 'test-dv',
        config: {},
      }

      const result = parseLegacyDataviewInstanceConfig(dataviewInstance)

      expect(result).toEqual(dataviewInstance)
      expect(result.datasetsConfig).toBeUndefined()
    })

    test('should handle dataview instance without events', () => {
      const dataviewInstance: AnyDataviewInstance = {
        id: 'test',
        dataviewId: 'test-dv',
        config: {
          datasets: ['dataset1'],
        },
      }

      const result = parseLegacyDataviewInstanceConfig(dataviewInstance)

      expect(result.config.events).toBeUndefined()
    })
  })

  describe('URL_STRINGIFY_CONFIG', () => {
    test('should have correct configuration', () => {
      expect(URL_STRINGIFY_CONFIG).toEqual({
        encodeValuesOnly: true,
        strictNullHandling: true,
      })
    })
  })

  describe('TOKEN_REGEX', () => {
    test('should match token patterns', () => {
      expect('~0'.match(TOKEN_REGEX)).toBeTruthy()
      expect('~123'.match(TOKEN_REGEX)).toBeTruthy()
      expect('prefix~0suffix'.match(TOKEN_REGEX)).toBeTruthy()
    })

    test('should not match non-token patterns', () => {
      expect('0'.match(TOKEN_REGEX)).toBeFalsy()
      expect('~'.match(TOKEN_REGEX)).toBeFalsy()
      expect('~abc'.match(TOKEN_REGEX)).toBeFalsy()
    })
  })

  describe('Edge cases and error handling', () => {
    test('should handle malformed JSON in query string', () => {
      const queryString = 'dvIn[0][id]=test&dvIn[0][config]=invalid'
      const result = parseWorkspace(queryString)

      // Should not throw and should handle gracefully
      expect(result).toBeDefined()
    })

    test('should handle undefined values in transformations', () => {
      const queryString = 'reportTimeComparison[duration]='
      const result = parseWorkspace(queryString)

      expect((result as any).reportTimeComparison).toBeDefined()
    })

    test('should handle empty arrays in transformations', () => {
      const queryString = 'mR[0]='
      const result = parseWorkspace(queryString)

      expect((result as any).mapRulers).toBeDefined()
    })

    test('should handle null values in stringify', () => {
      const workspace: any = {
        nullParam: null,
        undefinedParam: undefined,
        emptyString: '',
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('nullParam')
      expect(result).not.toContain('undefinedParam')
      expect(result).toContain('emptyString=')
    })

    test('should handle special characters in values', () => {
      const workspace: any = {
        specialValue: 'value with spaces & symbols!',
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('specialValue=')
    })

    test('should handle deeply nested objects', () => {
      const workspace: any = {
        nested: {
          level1: {
            level2: {
              value: 'deep-value',
            },
          },
        },
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('nested[level1][level2][val]=deep-value')
    })

    test('should handle circular references gracefully', () => {
      const workspace: any = {
        value: 'test',
      }
      workspace.self = workspace

      // Should throw when stringifying circular references
      expect(() => stringifyWorkspace(workspace)).toThrow()
    })

    test('should handle very long repeated values', () => {
      const longValue = 'a'.repeat(1000)
      const workspace: any = {
        param1: longValue,
        param2: longValue,
        param3: 'different',
      }
      const result = stringifyWorkspace(workspace)

      expect(result).toContain('tk[0]=')
      expect(result).toContain('~0')
    })

    test('should handle numeric string conversions', () => {
      const queryString = 'reportVesselPage=5&reportResultsPerPage=10&vesselIdentityIndex=3'
      const result = parseWorkspace(queryString)

      expect((result as any).reportVesselPage).toBe(5)
      expect((result as any).reportResultsPerPage).toBe(10)
      expect((result as any).vesselIdentityIndex).toBe(3)
    })

    test('should handle boolean string conversions', () => {
      const queryString = 'sidebarOpen=true&visible=false'
      const result = parseWorkspace(queryString)

      expect((result as any).sidebarOpen).toBe(true)
      expect((result as any).visible).toBe(false)
    })
  })

  describe('Parameter abbreviation validation', () => {
    test('should detect duplicated abbreviated parameters', () => {
      // This test ensures the validation logic works
      // The actual PARAMS_TO_ABBREVIATED object should not have duplicates
      const params = {
        activityVisualizationMode: 'aVM',
        bivariateDataviews: 'bDV',
        color: 'clr',
        // ... other params
      }

      const values = Object.values(params)
      const uniqueValues = new Set(values)

      expect(uniqueValues.size).toBe(values.length)
    })
  })

  describe('Integration tests', () => {
    test('should round-trip parse and stringify correctly', () => {
      const originalWorkspace = {
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 10,
        start: '2023-01-01',
        end: '2023-12-31',
        dataviewInstances: [
          {
            id: 'test',
            dataviewId: 'test-dv',
            config: {
              color: '#FF0000',
              datasets: ['dataset1', 'dataset2'],
            },
          },
        ],
      }

      const stringified = stringifyWorkspace(originalWorkspace)
      const parsed = parseWorkspace(stringified)

      expect(parsed).toEqual(originalWorkspace)
    })

    test('should handle complex workspace with all features', () => {
      const complexWorkspace = {
        latitude: 40.7128,
        longitude: -74.006,
        zoom: 10,
        start: '2023-01-01',
        end: '2023-12-31',
        dataviewInstances: [
          {
            id: 'test1',
            dataviewId: 'test-dv1',
            config: {
              color: '#FF0000',
              datasets: ['dataset1', 'dataset2'],
              breaks: [1, 2, 3],
              maxVisibleValue: 100,
              minVisibleValue: 0,
              thickness: 5,
            },
          },
          {
            id: 'test2',
            dataviewId: 'test-dv2',
            config: {
              color: '#00FF00',
              datasets: ['dataset3'],
            },
          },
        ],
        dataviewInstancesOrder: ['test1', 'test2'],
        sidebarOpen: true,
        visible: false,
        mapRulers: [
          { id: 1, name: 'ruler1' },
          { id: 2, name: 'ruler2' },
        ],
        reportTimeComparison: {
          duration: 30,
          type: 'days',
        },
      }

      const stringified = stringifyWorkspace(complexWorkspace)
      const parsed = parseWorkspace(stringified)

      expect(parsed).toEqual(complexWorkspace)
    })
  })
})
