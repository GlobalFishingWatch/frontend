import { PathLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { scaleLinear } from 'd3-scale'
import { describe, expect, it } from 'vitest'

import { FourwingsAggregationOperation, FourwingsComparisonMode } from './fourwings-heatmap.types'
import { EMPTY_CELL_COLOR } from './fourwings-heatmap.utils'
import { FourwingsHeatmapLayer } from './FourwingsHeatmapLayer'

const startTime = Date.UTC(2023, 0, 1)
const endTime = Date.UTC(2023, 5, 1)

const colorObj = (v: number) => ({ r: v, g: v, b: v, a: 1 })
// 0..100 → black..white, mirrors the scales the tile layer builds
const scale = scaleLinear([0, 100], [colorObj(0), colorObj(255)]).clamp(true) as any

const baseProps = {
  id: 'fourwings-cell-test',
  startTime,
  endTime,
  category: 'activity',
  resolution: 'default',
  tile: { index: { x: 0, y: 0, z: 0 } },
  tilesCache: { bufferedStart: startTime },
  sublayers: [{ id: 'ais' }, { id: 'vms' }],
  aggregationOperation: FourwingsAggregationOperation.Sum,
  comparisonMode: FourwingsComparisonMode.Compare,
  colorDomain: [0, 100],
  colorRanges: [
    [colorObj(0), colorObj(255)],
    [colorObj(0), colorObj(255)],
  ],
  scales: [scale, scale],
} as any

const makeLayer = (props: Record<string, unknown> = {}) => {
  const layer = new FourwingsHeatmapLayer({ ...baseProps, ...props })
  layer.timeRangeKey = '0-2'
  layer.startFrame = 0
  layer.endFrame = 2
  return layer
}

const feature = (values: number[][], initialValues = {}) =>
  ({
    properties: {
      values,
      initialValues,
      startOffsets: values.map(() => 0),
    },
  }) as any

const target = { target: [0, 0, 0, 0] as any }

describe('FourwingsHeatmapLayer', () => {
  describe('getCompareFillColor', () => {
    it('colors the cell by its highest sublayer aggregation', () => {
      const f = feature([
        [10, 10],
        [30, 30],
      ])
      // sublayer aggregations: [20, 60] → chosen 60 → scale(60) = 153
      expect(makeLayer().getCompareFillColor(f, target)).toEqual([153, 153, 153, 255])
      expect(f.aggregatedValues).toEqual([20, 60])
    })

    it('uses precomputed initialValues for the current time range key', () => {
      const f = feature([[999]], { '0-2': [50] })
      expect(makeLayer().getCompareFillColor(f, target)).toEqual([127.5, 127.5, 127.5, 255])
      expect(f.aggregatedValues).toEqual([50])
    })

    it('hides cells outside the visible value range', () => {
      const f = feature([[10, 10]])
      expect(makeLayer({ minVisibleValue: 30 }).getCompareFillColor(f, target)).toEqual(
        EMPTY_CELL_COLOR
      )
      expect(makeLayer({ maxVisibleValue: 10 }).getCompareFillColor(f, target)).toEqual(
        EMPTY_CELL_COLOR
      )
    })

    it('returns empty color without a color domain', () => {
      expect(
        makeLayer({ colorDomain: [] }).getCompareFillColor(feature([[10]]), target)
      ).toEqual(EMPTY_CELL_COLOR)
    })
  })

  describe('getTimeCompareFillColor', () => {
    const compareProps = {
      comparisonMode: FourwingsComparisonMode.TimeCompare,
      compareStart: Date.UTC(2022, 0, 1),
      compareEnd: Date.UTC(2022, 5, 1),
      colorDomain: [-100, 0, 100],
      scales: [scaleLinear([-100, 100], [colorObj(0), colorObj(255)]).clamp(true)],
    }

    it('colors the cell by the difference between periods', () => {
      const f = feature([[10], [30]])
      // compared - initial = 20 → scale(20) = 153
      expect(makeLayer(compareProps).getTimeCompareFillColor(f, target)).toEqual([
        153, 153, 153, 255,
      ])
      expect(f.aggregatedValues).toEqual([20])
    })

    it('returns empty color without compare range', () => {
      expect(
        makeLayer({ ...compareProps, compareStart: undefined }).getTimeCompareFillColor(
          feature([[10], [30]]),
          target
        )
      ).toEqual(EMPTY_CELL_COLOR)
    })
  })

  describe('getBivariateFillColor', () => {
    it('screen-blends both sublayer colors', () => {
      const f = feature([
        [50, 0],
        [80, 0],
      ])
      const color = makeLayer({ comparisonMode: FourwingsComparisonMode.Bivariate })
        .getBivariateFillColor(f, target)
      expect(color).toHaveLength(4)
      expect(color).not.toEqual(EMPTY_CELL_COLOR)
    })

    it('returns empty color without scales', () => {
      expect(
        makeLayer({ scales: [] }).getBivariateFillColor(feature([[10], [10]]), target)
      ).toEqual(EMPTY_CELL_COLOR)
    })
  })

  describe('getPickingInfo', () => {
    it('enriches the picked object with sublayer values and interval', () => {
      const info = makeLayer().getPickingInfo({
        info: { object: { aggregatedValues: [42, 7] } } as any,
      })
      expect(info.object?.sublayers?.map((s: any) => s.value)).toEqual([42, 7])
      expect(info.object?.interval).toBeDefined()
      expect(info.object?.visualizationMode).toBe('heatmap')
    })

    it('drops the object when no sublayer value is within visible limits', () => {
      const info = makeLayer({ minVisibleValue: 50 }).getPickingInfo({
        info: { object: { aggregatedValues: [42, 7] } } as any,
      })
      expect(info.object).toBeUndefined()
    })
  })

  describe('renderLayers', () => {
    it('renders cells plus highlight path layer', () => {
      const layers = makeLayer({ data: [feature([[10]])] }).renderLayers() as any[]
      expect(layers).toHaveLength(2)
      expect(layers[0]).toBeInstanceOf(SolidPolygonLayer)
      expect(layers[1]).toBeInstanceOf(PathLayer)
    })

    it('renders nothing without color config', () => {
      expect(
        makeLayer({ data: [feature([[1]])], colorDomain: undefined }).renderLayers()
      ).toEqual([])
    })
  })
})
