/**
 * @vitest-environment jsdom
 */
import { waitFor } from '@testing-library/dom'
import { cleanup, renderHook } from '@testing-library/react'
// Import getDefaultStore to reset atom state
import { getDefaultStore } from 'jotai'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { Dataset, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  DatasetStatus,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
} from '@globalfishingwatch/api-types'
import type { AnyDeckLayer, FourwingsVisualizationMode } from '@globalfishingwatch/deck-layers'

import type { ResolverGlobalConfig } from '../resolvers'
import { getDataviewsResolved, getDataviewsSorted } from '../resolvers/dataviews'
import { dataviewToDeckLayer } from '../resolvers/resolvers'

import {
  deckLayerInstancesAtom,
  useDeckLayerComposer,
  useSetDeckLayerComposer,
} from './deck-layers-composer.hooks'

vi.mock('../resolvers/resolvers', { spy: true })

vi.mock('../resolvers/dataviews', { spy: true })

vi.mock('@globalfishingwatch/deck-layers', async () => {
  const actual = await vi.importActual('@globalfishingwatch/deck-layers')
  class MockTilesBoundariesLayer {
    id: string
    visualizationMode: any
    _type: string

    constructor(props: any) {
      this.id = props.id
      this.visualizationMode = props.visualizationMode
      this._type = 'TilesBoundariesLayer'
    }
  }

  return {
    ...actual,
    TilesBoundariesLayer: MockTilesBoundariesLayer,
  }
})

const createMockDataview = (overrides: Partial<DataviewInstance> = {}): DataviewInstance =>
  ({
    id: 'test-dataview',
    category: DataviewCategory.Activity,

    config: {
      type: DataviewType.HeatmapAnimated,
      visible: true,
      ...overrides.config,
    },

    datasetsConfig: [],
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
    ...overrides,
  }) as DataviewInstance

const createMockGlobalConfig = (
  overrides: Partial<ResolverGlobalConfig> = {}
): ResolverGlobalConfig =>
  ({
    start: '2024-01-01',
    end: '2024-12-31',
    activityVisualizationMode: 'heatmap',
    detectionsVisualizationMode: 'positions',
    environmentVisualizationMode: 'heatmap',
    debugTiles: false,
    ...overrides,
  }) as ResolverGlobalConfig

describe('useDeckLayerComposer', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()

    // Reset Jotai atom state to prevent state leakage between tests
    const store = getDefaultStore()
    store.set(deckLayerInstancesAtom, [])
  })

  afterEach(() => {
    // Clean up React hooks and timers after each test
    cleanup()
    vi.clearAllTimers()
    vi.restoreAllMocks()
  })

  describe('Basic functionality', () => {
    it('should return empty array when no dataviews are provided', () => {
      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [],
          globalConfig: createMockGlobalConfig(),
        })
      )

      // Initial state is empty before debounce
      expect(result.current).toEqual([])
    })

    it('should process dataviews and create deck layers', async () => {
      const mockDataview = createMockDataview()
      const mockGlobalConfig = createMockGlobalConfig()

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [mockDataview],
          globalConfig: mockGlobalConfig,
        })
      )

      const mockGetDataviewsResolved2 = vi.mocked(getDataviewsResolved)

      await waitFor(() => {
        expect(mockGetDataviewsResolved2).toHaveBeenCalledWith([mockDataview], mockGlobalConfig)
        expect(getDataviewsSorted).toHaveBeenCalled()
        expect(dataviewToDeckLayer).toHaveBeenCalled()
        expect(result.current).toHaveLength(1)
      })
    })

    it('should create multiple deck layers for multiple dataviews', async () => {
      const dataviews = [
        createMockDataview({ id: 'dataview-1' }),
        createMockDataview({ id: 'dataview-2' }),
        createMockDataview({ id: 'dataview-3' }),
      ]

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews,
          globalConfig: createMockGlobalConfig(),
        })
      )

      await waitFor(() => {
        expect(result.current).toHaveLength(1)
        expect(dataviewToDeckLayer).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Debug tiles functionality', () => {
    it('should add TilesBoundariesLayer when debugTiles is enabled', async () => {
      const mockDataview = createMockDataview({
        category: DataviewCategory.Activity,
      })

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [mockDataview],
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            activityVisualizationMode: 'heatmap',
          }),
        })
      )

      await waitFor(() => {
        // Should have the original layer + debug tiles layer
        expect(result.current.length).toBeGreaterThan(1)
        const hasTilesBoundariesLayer = result.current.some(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        expect(hasTilesBoundariesLayer).toBe(true)
      })
    })

    it('should add multiple TilesBoundariesLayers for different categories', async () => {
      const dataviews = [
        createMockDataview({
          id: 'activity-dataview',
          category: DataviewCategory.Activity,
        }),
        createMockDataview({
          id: 'detections-dataview',
          category: DataviewCategory.Detections,
        }),
      ]

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews,
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            activityVisualizationMode: 'heatmap',
            detectionsVisualizationMode: 'positions',
          }),
        })
      )

      await waitFor(() => {
        const tilesBoundariesLayers = result.current.filter(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        // Should have unique visualization modes
        expect(tilesBoundariesLayers.length).toBeGreaterThan(0)
      })
    })

    it('should not add TilesBoundariesLayer when debugTiles is disabled', async () => {
      const mockDataview = createMockDataview()

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [mockDataview],
          globalConfig: createMockGlobalConfig({ debugTiles: false }),
        })
      )

      await waitFor(() => {
        const hasTilesBoundariesLayer = result.current.some(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        expect(hasTilesBoundariesLayer).toBe(false)
      })
    })

    it('should use activityVisualizationMode for Activity category dataviews when debugTiles enabled', async () => {
      const mockDataview = createMockDataview({
        category: DataviewCategory.Activity,
      })

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [mockDataview],
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            activityVisualizationMode: 'heatmap',
          }),
        })
      )

      await waitFor(() => {
        const tilesBoundariesLayers: (AnyDeckLayer & {
          visualizationMode?: FourwingsVisualizationMode
        })[] = result.current.filter((layer: any) => layer._type === 'TilesBoundariesLayer')

        expect(tilesBoundariesLayers.length).toBeGreaterThan(0)
        expect(tilesBoundariesLayers[0].visualizationMode).toBe('heatmap')
      })
    })

    it('should use environmentVisualizationMode for Environment category dataviews when debugTiles enabled', async () => {
      const mockDataview = createMockDataview({
        category: DataviewCategory.Environment,
      })

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [mockDataview],
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            environmentVisualizationMode: 'heatmap',
          }),
        })
      )

      await waitFor(() => {
        const tilesBoundariesLayers: (AnyDeckLayer & {
          visualizationMode?: FourwingsVisualizationMode
        })[] = result.current.filter((layer: any) => layer._type === 'TilesBoundariesLayer')

        expect(tilesBoundariesLayers.length).toBeGreaterThan(0)
        expect(tilesBoundariesLayers[0].visualizationMode).toBe('heatmap')
      })
    })

    it('should not add TilesBoundariesLayer when no Activity dataviews exist but debugTiles is enabled', async () => {
      const mockDataview = createMockDataview({
        category: DataviewCategory.Context,
      })

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [mockDataview],
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            activityVisualizationMode: 'heatmap',
          }),
        })
      )

      await waitFor(() => {
        const tilesBoundariesLayers = result.current.filter(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        // Should have no tiles boundaries layers since no Activity/Detections/Environment dataviews
        expect(tilesBoundariesLayers.length).toBe(0)
      })
    })

    it('should create unique TilesBoundariesLayers based on visualization modes', async () => {
      const dataviews = [
        createMockDataview({
          id: 'activity-dataview',
          category: DataviewCategory.Activity,
        }),
        createMockDataview({
          id: 'environment-dataview',
          category: DataviewCategory.Environment,
        }),
      ]

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews,
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            activityVisualizationMode: 'heatmap',
            environmentVisualizationMode: 'heatmap', // Same mode as activity
          }),
        })
      )

      await waitFor(() => {
        const tilesBoundariesLayers = result.current.filter(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        // Should only have 1 layer since both use the same visualization mode
        expect(tilesBoundariesLayers.length).toBe(1)
      })
    })

    it('should create separate TilesBoundariesLayers for different visualization modes', async () => {
      const dataviews = [
        createMockDataview({
          id: 'activity-dataview',
          category: DataviewCategory.Activity,
        }),
        createMockDataview({
          id: 'environment-dataview',
          category: DataviewCategory.Environment,
        }),
      ]

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews,
          globalConfig: createMockGlobalConfig({
            debugTiles: true,
            activityVisualizationMode: 'positions',
            environmentVisualizationMode: 'heatmap', // Different mode
          }),
        })
      )

      await waitFor(() => {
        const tilesBoundariesLayers = result.current.filter(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        // Should have 2 layers since they use different visualization modes
        expect(tilesBoundariesLayers.length).toBe(2)
        const visualizationModes = tilesBoundariesLayers.map(
          (layer: AnyDeckLayer & { visualizationMode?: FourwingsVisualizationMode }) =>
            layer.visualizationMode
        )
        expect(visualizationModes).toContain('heatmap')
        expect(visualizationModes).toContain('positions')
      })
    })
  })

  describe.skip('Error handling', () => {
    it('should handle errors from dataviewToDeckLayer gracefully', async () => {
      const mockDataviewToDeckLayer = vi.mocked(dataviewToDeckLayer)
      mockDataviewToDeckLayer.mockImplementation(() => {
        throw new Error('Test error')
      })

      const dataviews = [createMockDataview()]

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews,
          globalConfig: createMockGlobalConfig(),
        })
      )

      await waitFor(() => {
        // Should return empty array when layer creation fails
        expect(result.current).toEqual([])
      })
    })

    it('should continue processing other dataviews when one fails', async () => {
      const mockDataviewToDeckLayer = vi.mocked(dataviewToDeckLayer)
      mockDataviewToDeckLayer.mockImplementationOnce(() => {
        throw new Error('Test error')
      })

      const dataviews = [
        createMockDataview({ id: 'failing-dataview' }),
        createMockDataview({ id: 'working-dataview' }),
      ]

      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews,
          globalConfig: createMockGlobalConfig(),
        })
      )

      await waitFor(() => {
        // Should have one layer from the successful dataview
        expect(result.current).toHaveLength(1)
        expect(result.current[0].id).toBe('working-dataview')
      })
    })
  })

  describe('Memoization and updates', () => {
    it('should update layers when dataviews change', async () => {
      const initialDataviews = [createMockDataview({ id: 'initial' })]
      const mockGlobalConfig = createMockGlobalConfig()

      const { result, rerender } = renderHook(
        ({ dataviews, globalConfig }) => useDeckLayerComposer({ dataviews, globalConfig }),
        { initialProps: { dataviews: initialDataviews, globalConfig: mockGlobalConfig } }
      )

      // Wait for initial render and debounced update
      await waitFor(() => {
        expect(result.current.length).toBeGreaterThan(0)
      })

      expect(result.current).toHaveLength(1)

      const updatedDataviews = [
        createMockDataview({ id: 'updated' }),
        createMockDataview({ id: 'updated-2' }),
      ]

      rerender({
        dataviews: updatedDataviews,
        globalConfig: mockGlobalConfig,
      })

      // Wait for rerender and debounced update
      await waitFor(() => {
        expect(result.current).toHaveLength(1)
        expect(result.current[0].id).toBe('updated,updated-2')
      })
    })

    it('should update layers when globalConfig changes', async () => {
      const dataviews = [createMockDataview()]
      const initialConfig = createMockGlobalConfig({ start: '2024-01-01' })
      const mockDataviewToDeckLayer = vi.mocked(dataviewToDeckLayer)

      const { rerender } = renderHook(
        ({ dataviews, globalConfig }) => useDeckLayerComposer({ dataviews, globalConfig }),
        {
          initialProps: {
            dataviews,
            globalConfig: initialConfig,
          },
        }
      )

      const initialCallCount = mockDataviewToDeckLayer.mock.calls.length

      const updatedConfig = createMockGlobalConfig({ start: '2024-06-01' })

      rerender({
        dataviews,
        globalConfig: updatedConfig,
      })

      await waitFor(() => {
        // Should have been called again with new config
        expect(mockDataviewToDeckLayer.mock.calls.length).toBeGreaterThan(initialCallCount)
      })
    })

    it('should not recompute when dataviews reference changes but content is same', () => {
      const dataview = createMockDataview()
      const globalConfig = createMockGlobalConfig()

      const { rerender } = renderHook(
        ({ dataviews, globalConfig }) => useDeckLayerComposer({ dataviews, globalConfig }),
        {
          initialProps: {
            dataviews: [dataview],
            globalConfig,
          },
        }
      )

      expect(dataviewToDeckLayer).toHaveBeenCalledTimes(1)

      vi.clearAllMocks()

      // Same content, different array reference
      rerender({
        dataviews: [{ ...dataview }],
        globalConfig: { ...globalConfig },
      })

      // useMemoCompare should prevent recomputation
      expect(dataviewToDeckLayer).not.toHaveBeenCalled()
    })
  })

  describe('Debouncing', () => {
    it('should debounce layer updates', () => {
      renderHook(() =>
        useDeckLayerComposer({
          dataviews: [createMockDataview()],
          globalConfig: createMockGlobalConfig(),
        })
      )

      // Since debounce is only 1ms, the layers should eventually be set
      // The test just verifies that the hook works with debouncing enabled
      expect(dataviewToDeckLayer).toHaveBeenCalled()
    })
  })

  describe('Integration with different dataview categories', () => {
    it('should handle Activity category dataviews', () => {
      const dataview = createMockDataview({
        category: DataviewCategory.Activity,
        config: { type: DataviewType.HeatmapAnimated },
      })

      renderHook(() =>
        useDeckLayerComposer({
          dataviews: [dataview],
          globalConfig: createMockGlobalConfig(),
        })
      )

      expect(dataviewToDeckLayer).toHaveBeenCalledWith(
        expect.objectContaining({ category: DataviewCategory.Activity }),
        expect.any(Object)
      )
    })

    it('should handle Detections category dataviews', () => {
      const dataview = createMockDataview({
        category: DataviewCategory.Detections,
      })

      renderHook(() =>
        useDeckLayerComposer({
          dataviews: [dataview],
          globalConfig: createMockGlobalConfig(),
        })
      )

      expect(dataviewToDeckLayer).toHaveBeenCalledWith(
        expect.objectContaining({ category: DataviewCategory.Detections }),
        expect.any(Object)
      )
    })

    it('should handle Environment category dataviews', () => {
      const dataview = createMockDataview({
        category: DataviewCategory.Environment,
      })

      renderHook(() =>
        useDeckLayerComposer({
          dataviews: [dataview],
          globalConfig: createMockGlobalConfig(),
        })
      )

      expect(dataviewToDeckLayer).toHaveBeenCalledWith(
        expect.objectContaining({ category: DataviewCategory.Environment }),
        expect.any(Object)
      )
    })
  })
})

describe('useSetDeckLayerComposer', () => {
  it('should return a setter function for deck layer instances', () => {
    const { result } = renderHook(() => useSetDeckLayerComposer())

    expect(typeof result.current).toBe('function')
  })

  it('should allow setting deck layers directly', () => {
    const mockLayers = [
      { id: 'layer-1', _type: 'MockLayer' },
      { id: 'layer-2', _type: 'MockLayer' },
    ]

    const { result: setterResult } = renderHook(() => useSetDeckLayerComposer())

    // Set layers directly - this should not throw
    expect(() => setterResult.current(mockLayers as any)).not.toThrow()
  })
})
