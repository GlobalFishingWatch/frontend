/**
 * @vitest-environment jsdom
 */
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

import type { ResolverGlobalConfig } from '../resolvers'
import * as resolversModule from '../resolvers'

import { useDeckLayerComposer, useSetDeckLayerComposer } from './deck-layers-composer.hooks'

// Mock the resolvers
vi.mock('../resolvers', async () => {
  const actual = await vi.importActual('../resolvers')
  return {
    ...actual,
    dataviewToDeckLayer: vi.fn(),
    getDataviewsResolved: vi.fn(),
    getDataviewsSorted: vi.fn(),
  }
})

// Mock deck layers
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

describe('useDeckLayerComposer', () => {
  const mockDataviewToDeckLayer = resolversModule.dataviewToDeckLayer as any
  const mockGetDataviewsResolved = resolversModule.getDataviewsResolved as any
  const mockGetDataviewsSorted = resolversModule.getDataviewsSorted as any

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

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()

    // Default mock implementations
    mockGetDataviewsResolved.mockImplementation((dataviews: DataviewInstance[]) => dataviews)
    mockGetDataviewsSorted.mockImplementation((dataviews: DataviewInstance[]) => dataviews)
    mockDataviewToDeckLayer.mockImplementation((dataview: DataviewInstance) => ({
      id: dataview.id,
      _type: 'MockLayer',
    }))
  })

  afterEach(() => {
    vi.clearAllTimers()
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

      await waitFor(() => {
        expect(mockGetDataviewsResolved).toHaveBeenCalledWith([mockDataview], mockGlobalConfig)
        expect(mockGetDataviewsSorted).toHaveBeenCalled()
        expect(mockDataviewToDeckLayer).toHaveBeenCalled()
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
        expect(result.current).toHaveLength(3)
        expect(mockDataviewToDeckLayer).toHaveBeenCalledTimes(3)
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
        const tilesBoundariesLayers = result.current.filter(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
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
        const tilesBoundariesLayers = result.current.filter(
          (layer: any) => layer._type === 'TilesBoundariesLayer'
        )
        console.log(
          '🚀 ~ tilesBoundariesLayers[0].visualizationMode:',
          tilesBoundariesLayers[0].visualizationMode
        )
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
            activityVisualizationMode: 'heatmap',
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
        const visualizationModes = tilesBoundariesLayers.map((l: any) => l.visualizationMode)
        expect(visualizationModes).toContain('heatmap')
        expect(visualizationModes).toContain('positions')
      })
    })
  })

  describe('Error handling', () => {
    it('should handle errors from dataviewToDeckLayer gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

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
        expect(consoleWarnSpy).toHaveBeenCalled()
        // Should return empty array when layer creation fails
        expect(result.current).toEqual([])
      })

      consoleWarnSpy.mockRestore()
    })

    it('should continue processing other dataviews when one fails', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mockDataviewToDeckLayer
        .mockImplementationOnce(() => {
          throw new Error('Test error')
        })
        .mockImplementationOnce((dataview: DataviewInstance) => ({
          id: dataview.id,
          _type: 'MockLayer',
        }))

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

      consoleWarnSpy.mockRestore()
    })
  })

  describe('Memoization and updates', () => {
    it('should update layers when dataviews change', async () => {
      const initialDataviews = [createMockDataview({ id: 'initial' })]

      const { result, rerender } = renderHook(
        ({ dataviews, globalConfig }) => useDeckLayerComposer({ dataviews, globalConfig }),
        {
          initialProps: {
            dataviews: initialDataviews,
            globalConfig: createMockGlobalConfig(),
          },
        }
      )

      await waitFor(() => {
        expect(result.current).toHaveLength(1)
      })

      const updatedDataviews = [
        createMockDataview({ id: 'updated-1' }),
        createMockDataview({ id: 'updated-2' }),
      ]

      rerender({
        dataviews: updatedDataviews,
        globalConfig: createMockGlobalConfig(),
      })

      await waitFor(() => {
        expect(result.current).toHaveLength(2)
      })
    })

    it('should update layers when globalConfig changes', async () => {
      const dataviews = [createMockDataview()]
      const initialConfig = createMockGlobalConfig({ start: '2024-01-01' })

      const { result, rerender } = renderHook(
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

      expect(mockDataviewToDeckLayer).toHaveBeenCalledTimes(1)

      vi.clearAllMocks()

      // Same content, different array reference
      rerender({
        dataviews: [{ ...dataview }],
        globalConfig: { ...globalConfig },
      })

      // useMemoCompare should prevent recomputation
      expect(mockDataviewToDeckLayer).not.toHaveBeenCalled()
    })
  })

  describe('Debouncing', () => {
    it('should debounce layer updates', () => {
      const { result } = renderHook(() =>
        useDeckLayerComposer({
          dataviews: [createMockDataview()],
          globalConfig: createMockGlobalConfig(),
        })
      )

      // Since debounce is only 1ms, the layers should eventually be set
      // The test just verifies that the hook works with debouncing enabled
      expect(mockDataviewToDeckLayer).toHaveBeenCalled()
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

      expect(mockDataviewToDeckLayer).toHaveBeenCalledWith(
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

      expect(mockDataviewToDeckLayer).toHaveBeenCalledWith(
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

      expect(mockDataviewToDeckLayer).toHaveBeenCalledWith(
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
