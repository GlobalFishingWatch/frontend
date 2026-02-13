import { getDefaultStore } from 'jotai'
import { afterEach, beforeEach, describe, expect, it, vitest } from 'vitest'

import type { Dataset, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  DatasetStatus,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  EndpointId,
} from '@globalfishingwatch/api-types'
import type { DeckLayerPickingObject } from '@globalfishingwatch/deck-layers'
import {
  BaseMapImageLayer,
  BaseMapLabelsLayer,
  BaseMapLayer,
  BathymetryContourLayer,
  ContextLayer,
  FourwingsClustersLayer,
  FourwingsLayer,
  FourwingsVectorsTileLayer,
  GraticulesLayer,
  PolygonsLayer,
  UserContextTileLayer,
  UserPointsTileLayer,
  UserTracksLayer,
  VesselLayer,
  WorkspacesLayer,
} from '@globalfishingwatch/deck-layers'

import { deckLayerInstancesAtom } from '../hooks/deck-layers-composer.hooks'
import type { ResolvedDataviewInstance } from '../types/dataviews'
import type { ResolverGlobalConfig } from '../types/resolvers'

import { dataviewToDeckLayer, getDataviewHighlightedFeatures } from './resolvers'

describe('resolvers', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vitest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up after each test
    const store = getDefaultStore()
    store.set(deckLayerInstancesAtom, [])
  })

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

  const createMockDataset = (overrides: Partial<Dataset> = {}): Dataset => ({
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
    ...overrides,
  })

  describe('getDataviewHighlightedFeatures', () => {
    it('should return undefined when no highlighted features in global config', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig()

      const result = getDataviewHighlightedFeatures(dataview, globalConfig)

      expect(result).toBeUndefined()
    })

    it('should return undefined when highlightedFeatures is undefined', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig({ highlightedFeatures: undefined })

      const result = getDataviewHighlightedFeatures(dataview, globalConfig)

      expect(result).toBeUndefined()
    })

    it('should return empty array when highlightedFeatures is empty array', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig({ highlightedFeatures: [] })

      const result = getDataviewHighlightedFeatures(dataview, globalConfig)

      expect(result).toEqual([])
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

      expect(result).toHaveLength(2)
      expect(result).toEqual([
        expect.objectContaining({ layerId: 'test-layer', id: '1' }),
        expect.objectContaining({ layerId: 'test-layer', id: '2' }),
      ])
    })

    it('should return empty array when no matching highlighted features', () => {
      const dataview = createMockDataview({ id: 'test-layer' })
      const globalConfig = createMockGlobalConfig({
        highlightedFeatures: [
          {
            layerId: 'other-layer',
            object: {},
            properties: {},
            id: '3',
            category: DataviewCategory.Activity,
          },
        ],
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

        expect(layer.id).toContain('test-dataview')
        expect(layer).toBeInstanceOf(BaseMapLayer)
      })

      it('should create BaseMapImageLayer for BasemapImage type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.BasemapImage },
          datasets: [createMockDataset()],
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(BaseMapImageLayer)
      })

      it('should create BaseMapLabelsLayer for BasemapLabels type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.BasemapLabels },
          datasets: [createMockDataset({ type: DatasetTypes.PMTiles })],
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(BaseMapLabelsLayer)
      })
    })

    describe('Bathymetry layer', () => {
      it('should create BathymetryContourLayer for Bathymetry type', () => {
        const dataview = createMockDataview({
          config: {
            type: DataviewType.Bathymetry,
          },
          datasets: [
            createMockDataset({
              endpoints: [
                {
                  id: EndpointId.ContextTiles,
                  downloadable: true,
                  pathTemplate: 'https://example.com/tiles/{z}/{x}/{y}.png',
                  params: [
                    { id: EndpointId.ContextTiles, label: 'label', type: '4wings-datasets' },
                  ],
                  query: [],
                },
              ],
            }),
          ],
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(BathymetryContourLayer)
      })
    })

    describe('Graticules layer', () => {
      it('should create GraticulesLayer for Graticules type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Graticules },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(GraticulesLayer)
      })
    })

    describe('Fourwings layers', () => {
      it('should create FourwingsLayer for HeatmapAnimated type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.HeatmapAnimated },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(FourwingsLayer)
      })

      it('should create FourwingsLayer for HeatmapStatic type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.HeatmapStatic },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(FourwingsLayer)
      })

      it('should create FourwingsVectorsTileLayer for FourwingsVector type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.FourwingsVector },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(FourwingsVectorsTileLayer)
      })

      it('should create FourwingsClustersLayer for FourwingsTileCluster type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.FourwingsTileCluster },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(FourwingsClustersLayer)
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

        expect(layer).toBeInstanceOf(ContextLayer)
      })

      it('should create PolygonsLayer for Polygons type', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.Context,
          config: { type: DataviewType.Polygons },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(PolygonsLayer)
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

        expect(layer).toBeInstanceOf(UserContextTileLayer)
      })

      it('should create UserPointsTileLayer for UserPoints type', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.User,
          config: { type: DataviewType.UserPoints },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(UserPointsTileLayer)
      })

      it('should create UserTracksLayer for Track type with User category', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.User,
          config: { type: DataviewType.Track },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(UserTracksLayer)
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

        expect(layer).toBeInstanceOf(VesselLayer)
      })

      it('should create VesselLayer for Track type with Activity category', () => {
        const dataview = createMockDataview({
          category: DataviewCategory.Activity,
          config: { type: DataviewType.Track },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(VesselLayer)
      })
    })

    describe('Workspaces layer', () => {
      it('should create WorkspacesLayer for Workspaces type', () => {
        const dataview = createMockDataview({
          config: { type: DataviewType.Workspaces, data: { features: [] } },
        })
        const globalConfig = createMockGlobalConfig()

        const layer = dataviewToDeckLayer(dataview, globalConfig)

        expect(layer).toBeInstanceOf(WorkspacesLayer)
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
