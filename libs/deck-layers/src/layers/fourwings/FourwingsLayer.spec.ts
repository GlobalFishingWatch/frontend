import { testLayer } from '@deck.gl/test-utils/vitest'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { FourwingsFootprintTileLayer } from './footprint/FourwingsFootprintTileLayer'
import { FourwingsHeatmapStaticLayer } from './heatmap/FourwingsHeatmapStaticLayer'
import { FourwingsHeatmapTileLayer } from './heatmap/FourwingsHeatmapTileLayer'
import { FourwingsPositionsTileLayer } from './positions/FourwingsPositionsTileLayer'
import {
  FOOTPRINT_HIGH_RES_ID,
  FOOTPRINT_ID,
  HEATMAP_HIGH_RES_ID,
  POSITIONS_ID,
} from './fourwings.config'
import type { FourwingsLayerProps } from './FourwingsLayer'
import { FourwingsLayer } from './FourwingsLayer'

const baseProps = {
  id: 'fourwings-test',
  startTime: Date.UTC(2023, 0, 1),
  endTime: Date.UTC(2023, 5, 1),
  category: 'activity',
  sublayers: [
    {
      id: 'ais',
      visible: true,
      datasets: ['public-global-fishing-effort'],
      colorRamp: 'teal',
    },
  ],
} as any

beforeAll(() => {
  // keep tile sublayers offline: these tests only assert orchestration
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response(new ArrayBuffer(0), { status: 200 }))
  )
})

// Renders without the deck lifecycle (no device needed): class selection in
// renderLayers only depends on props/state, and building a sublayer instance
// does not allocate GPU resources
const renderSubLayer = (props: Partial<FourwingsLayerProps>) => {
  const layer = new FourwingsLayer({ ...baseProps, ...props })
  layer.state = { highlightedFeatures: [] }
  return layer.renderLayers()
}

describe('FourwingsLayer', () => {
  it('selects the sublayer class matching each visualization mode', () => {
    expect(renderSubLayer({})).toBeInstanceOf(FourwingsHeatmapTileLayer)
    expect(renderSubLayer({ visualizationMode: HEATMAP_HIGH_RES_ID })).toBeInstanceOf(
      FourwingsHeatmapTileLayer
    )
    expect(renderSubLayer({ static: true })).toBeInstanceOf(FourwingsHeatmapStaticLayer)
    expect(renderSubLayer({ visualizationMode: POSITIONS_ID })).toBeInstanceOf(
      FourwingsPositionsTileLayer
    )
    expect(renderSubLayer({ visualizationMode: FOOTPRINT_ID })).toBeInstanceOf(
      FourwingsFootprintTileLayer
    )
    expect(renderSubLayer({ visualizationMode: FOOTPRINT_HIGH_RES_ID })).toBeInstanceOf(
      FourwingsFootprintTileLayer
    )
  })

  // Full deck lifecycle (initialize/update/finalize on a NullDevice). Positions
  // mode is excluded: its IconLayer loads a png atlas and allocates textures,
  // which the null device can't finalize
  it('runs the heatmap lifecycle and exposes mode getters', () => {
    testLayer({
      Layer: FourwingsLayer,
      onError: (error) => {
        throw error
      },
      testCases: [
        {
          title: 'default heatmap mode',
          props: baseProps,
          onAfterUpdate: ({ subLayer, layer }) => {
            expect(subLayer).toBeInstanceOf(FourwingsHeatmapTileLayer)
            // getMode() falls back to heatmap but isHeatmapVisualizationMode
            // requires an explicit visualizationMode prop
            expect((layer as FourwingsLayer).isHeatmapVisualizationMode).toBe(false)
            expect((layer as FourwingsLayer).getMode()).toBe('heatmap')
            expect((layer as FourwingsLayer).getResolution()).toBe('default')
          },
        },
        {
          title: 'high res heatmap mode',
          updateProps: { visualizationMode: HEATMAP_HIGH_RES_ID },
          onAfterUpdate: ({ subLayer, layer }) => {
            expect(subLayer).toBeInstanceOf(FourwingsHeatmapTileLayer)
            expect((layer as FourwingsLayer).isHeatmapVisualizationMode).toBe(true)
            expect((layer as FourwingsLayer).getResolution()).toBe('high')
            expect((layer as FourwingsLayer).getZoomOffset()).toBe(1)
          },
        },
      ],
    })
  })

  it('runs the static heatmap lifecycle', () => {
    testLayer({
      Layer: FourwingsLayer,
      onError: (error) => {
        throw error
      },
      testCases: [
        {
          title: 'static heatmap',
          props: { ...baseProps, static: true },
          onAfterUpdate: ({ subLayer }) => {
            expect(subLayer).toBeInstanceOf(FourwingsHeatmapStaticLayer)
          },
        },
      ],
    })
  })

  it('exposes highlighted features and time range from state', () => {
    const stateFeature = { id: 'highlighted' } as any
    testLayer({
      Layer: FourwingsLayer,
      onError: (error) => {
        throw error
      },
      testCases: [
        {
          title: 'highlight state',
          props: baseProps,
          onAfterUpdate: ({ layer }) => {
            const fourwingsLayer = layer as FourwingsLayer
            expect(fourwingsLayer._getHighlightedFeatures()).toEqual([])
            fourwingsLayer.setHighlightedFeatures([stateFeature])
            expect(fourwingsLayer._getHighlightedFeatures()).toEqual([stateFeature])
            fourwingsLayer.setHighlightedTime({ start: 1, end: 2 })
            expect(fourwingsLayer._getHighlightTimes()).toEqual({
              highlightStartTime: 1,
              highlightEndTime: 2,
            })
          },
        },
      ],
    })
  })
})
