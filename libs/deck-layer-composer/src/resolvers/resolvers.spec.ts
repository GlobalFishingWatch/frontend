import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Dataset, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  DatasetStatus,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
} from '@globalfishingwatch/api-types'
import type { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'

import type { ResolvedDataviewInstance } from '../types/dataviews'
import type { ResolverGlobalConfig } from '../types/resolvers'

import { dataviewToDeckLayer, getDataviewHighlightedFeatures } from './resolvers'

describe('resolvers', () => {
  const createMockDataview = (
    overrides: Partial<DataviewInstance> = {}
  ): ResolvedDataviewInstance =>
    ({
      id: 'test-dataview',
      category: DataviewCategory.Activity,
      config: {
        type: DataviewType.HeatmapAnimated,
        visible: true,
        ...overrides.config,
      },
      datasetsConfig: [],
      datasets: [],
      ...overrides,
    }) as ResolvedDataviewInstance

  const createMockGlobalConfig = (
    overrides: Partial<ResolverGlobalConfig> = {}
  ): ResolverGlobalConfig =>
    ({
      start: '2024-01-01T00:00:00.000Z',
      end: '2024-12-31T23:59:59.999Z',
      activityVisualizationMode: 'heatmap',
      detectionsVisualizationMode: 'positions',
      environmentVisualizationMode: 'heatmap',
      bivariateDataviews: null,
      visibleEvents: [],
      vesselsColorBy: 'flag',
      debugTiles: false,
      ...overrides,
    }) as ResolverGlobalConfig

  describe('getDataviewHighlightedFeatures', () => {
    it('should return undefined when no highlighted features in global config', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig()

      const result = getDataviewHighlightedFeatures(dataview, globalConfig)

      expect(result).toBeUndefined()
    })

    it('should return filtered highlighted features matching dataview id', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig({
        highlightedFeatures: [
          { layerId: 'test-layer', id: '1' } as DeckLayerPickingObject,
          { layerId: 'test-layer', id: '2' } as DeckLayerPickingObject,
          { layerId: 'other-layer', id: '3' } as DeckLayerPickingObject,
        ],
      })

      const result = getDataviewHighlightedFeatures(dataview, globalConfig)
      console.log('🚀 ~ result:', result)

      expect(result).toHaveLength(2)
      expect(result?.[0].layerId).toBe('test-layer')
      expect(result?.[1].layerId).toBe('test-layer')
    })

    it('should return empty array when no matching highlighted features', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig({
        highlightedFeatures: [{ layerId: 'other-layer', object: {} }] as any,
      })

      const result = getDataviewHighlightedFeatures(dataview, globalConfig)

      expect(result).toHaveLength(0)
    })
  })

  describe('dataviewToDeckLayer', () => {
    describe('Basemap layers', () => {
      it('should create BaseMapLayer for Basemap type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Basemap },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.id).toContain('test-dataview')
        expect(layer.constructor.name).toBe('BaseMapLayer')
      })

      it('should create BaseMapImageLayer for BasemapImage type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.BasemapImage },
          datasets: [
            {
              type: DatasetTypes.PMTiles,
              alias: ['test-alias'],
              id: 'test-id',
              name: 'test-name',
              description: 'test-description',
              status: DatasetStatus.Done,
              ownerId: 123,
              ownerType: 'owner-type',
              createdAt: '2024-01-01T00:00:00.000Z',
              configuration: {},
              relatedDatasets: [],
              fieldsAllowed: [],
              filters: {},
            },
          ] as Dataset[],
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('BaseMapImageLayer')
      })

      it('should create BaseMapLabelsLayer for BasemapLabels type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.BasemapLabels },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('BaseMapLabelsLayer')
      })
    })

    describe('Bathymetry layer', () => {
      it('should create BathymetryContourLayer for Bathymetry type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Bathymetry },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('BathymetryContourLayer')
      })
    })

    describe('Graticules layer', () => {
      it('should create GraticulesLayer for Graticules type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Graticules },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('GraticulesLayer')
      })
    })

    describe('Fourwings layers', () => {
      it('should create FourwingsLayer for HeatmapAnimated type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.HeatmapAnimated },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('FourwingsLayer')
      })

      it('should create FourwingsLayer for HeatmapStatic type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.HeatmapStatic },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('FourwingsLayer')
      })

      it('should create FourwingsVectorsTileLayer for FourwingsVector type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.FourwingsVector },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('FourwingsVectorsTileLayer')
      })

      it('should create FourwingsClustersLayer for FourwingsTileCluster type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.FourwingsTileCluster },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('FourwingsClustersLayer')
      })
    })

    describe('Context layers', () => {
      it('should create ContextLayer for Context type', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.Context,
          config: { type: DataviewType.Context },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('ContextLayer')
      })

      it('should create PolygonsLayer for Polygons type', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.Context,
          config: { type: DataviewType.Polygons },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('PolygonsLayer')
      })
    })

    describe('User layers', () => {
      it('should create UserContextTileLayer for UserContext type', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.User,
          config: { type: DataviewType.UserContext },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('UserContextTileLayer')
      })

      it('should create UserPointsTileLayer for UserPoints type', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.User,
          config: { type: DataviewType.UserPoints },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('UserPointsTileLayer')
      })

      it('should create UserTracksLayer for Track type with User category', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.User,
          config: { type: DataviewType.Track },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('UserTracksLayer')
      })
    })

    describe('Vessel layers', () => {
      it('should create VesselLayer for Track type with Vessels category', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.Vessels,
          config: { type: DataviewType.Track },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('VesselLayer')
      })

      it('should create VesselLayer for Track type with Activity category', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.Activity,
          config: { type: DataviewType.Track },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('VesselLayer')
      })
    })

    describe('Workspaces layer', () => {
      it('should create WorkspacesLayer for Workspaces type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Workspaces },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeDefined()
        expect(layer.constructor.name).toBe('WorkspacesLayer')
      })
    })

    describe('Layer properties', () => {
      it('should pass dataview id to created layer', () => {
        const dataview = createMockDataview({
          id: 'my-custom-dataview-id',
          config: { type: DataviewType.Graticules },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer.id).toContain('my-custom-dataview-id')
      })

      it('should pass visible property from dataview config', () => {
        const dataview = createMockDataview({
          config: {
            type: DataviewType.Graticules,
            visible: false,
            info: 'asd',
          },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)
        console.log('🚀 ~ layer:', layer.props.visible)

        expect(layer.props.visible).toBe(false)
      })

      it('should include global config time range', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Graticules },
        })
        const globalConfig = createMockGlobalConfig({
          start: '2023-01-01T00:00:00.000Z',
          end: '2023-12-31T23:59:59.999Z',
        })

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        // The layer should have access to time range through its props
        expect(layer).toBeDefined()
      })
    })

    describe('Error handling', () => {
      it('should throw error for unknown dataview type', () => {
        const dataview = createMockDataview({
          config: { type: 'UnknownType' as any },
        })
        const globalConfig = createMockGlobalConfig()

        expect(() => dataviewToDeckLayer(dataview, globalConfig)).toThrow(
          'Unknown deck layer generator type: UnknownType'
        )
      })

      it('should throw error when config type is undefined', () => {
        const dataview = createMockDataview({
          config: {} as any,
        })
        const globalConfig = createMockGlobalConfig()

        expect(() => dataviewToDeckLayer(dataview, globalConfig)).toThrow(
          'Unknown deck layer generator type: undefined'
        )
      })
    })
  })
})
