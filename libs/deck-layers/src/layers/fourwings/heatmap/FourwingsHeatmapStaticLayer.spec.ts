import { scaleLinear } from 'd3-scale'
import { describe, expect, it, vi } from 'vitest'

import { EMPTY_CELL_COLOR } from './fourwings-heatmap.utils'
import { FourwingsHeatmapStaticLayer } from './FourwingsHeatmapStaticLayer'

const colorObj = (v: number) => ({ r: v, g: v, b: v, a: 1 })
const scale = scaleLinear([0, 100], [colorObj(0), colorObj(255)]).clamp(true)

const baseProps = {
  id: 'fourwings-static-test',
  category: 'activity',
  resolution: 'default',
  sublayers: [
    {
      id: 'ais',
      visible: true,
      datasets: ['ds-a'],
      colorRamp: 'teal',
    },
  ],
} as any

const makeLayer = (props: Record<string, unknown> = {}) => {
  const layer = new FourwingsHeatmapStaticLayer({ ...baseProps, ...props })
  layer.state = {
    error: '',
    colorDomain: [],
    colorRanges: layer._getColorRanges(),
    scales: [scale],
    rampDirty: false,
    viewportLoaded: false,
    tilesCacheUpdateTimeout: null,
  } as any
  return layer
}

const staticFeature = (count?: number) => ({ properties: { count } }) as any

describe('FourwingsHeatmapStaticLayer', () => {
  describe('getFillColor', () => {
    it('colors the cell by its count through the scale', () => {
      expect(makeLayer().getFillColor(staticFeature(60))).toEqual([153, 153, 153, 255])
    })

    it('returns empty color without value or scale', () => {
      expect(makeLayer().getFillColor(staticFeature(undefined))).toEqual(EMPTY_CELL_COLOR)
      const layer = makeLayer()
      layer.state.scales = []
      expect(layer.getFillColor(staticFeature(60))).toEqual(EMPTY_CELL_COLOR)
    })

    it('hides cells outside the visible value range', () => {
      expect(makeLayer({ minVisibleValue: 70 }).getFillColor(staticFeature(60))).toEqual(
        EMPTY_CELL_COLOR
      )
      expect(makeLayer({ maxVisibleValue: 50 }).getFillColor(staticFeature(60))).toEqual(
        EMPTY_CELL_COLOR
      )
    })
  })

  describe('_calculateColorDomain', () => {
    it('returns ascending steps from feature counts', () => {
      const layer = makeLayer()
      vi.spyOn(layer, 'getData').mockReturnValue(
        Array.from({ length: 30 }, (_, i) => staticFeature(i + 1))
      )
      const domain = layer._calculateColorDomain() as number[]
      expect(domain.length).toBeGreaterThan(0)
      expect(domain).toEqual([...domain].sort((a, b) => a - b))
    })

    it('returns the current domain when there is no data', () => {
      const layer = makeLayer()
      layer.state.colorDomain = [1, 2, 3]
      vi.spyOn(layer, 'getData').mockReturnValue([])
      expect(layer._calculateColorDomain()).toEqual([1, 2, 3])
    })
  })

  describe('getPickingInfo', () => {
    it('maps the cell id and stamps sublayer values', () => {
      const info = makeLayer().getPickingInfo({
        info: { object: { properties: { count: 30, cell: 123 } } } as any,
      })
      expect(info.object?.properties.cellId).toBe(123)
      expect(info.object?.properties.values).toEqual([[30]])
      expect(info.object?.sublayers?.[0].value).toBe(30)
    })

    it('drops the object when the value is outside visible limits', () => {
      const info = makeLayer({ minVisibleValue: 50 }).getPickingInfo({
        info: { object: { properties: { count: 30, cell: 123 } } } as any,
      })
      expect(info.object).toBeUndefined()
    })
  })

  it('cacheHash tracks ramp dirtiness', () => {
    const layer = makeLayer()
    expect(layer.cacheHash).toBe('false')
    layer.state.rampDirty = true
    expect(layer.cacheHash).toBe('true')
  })
})
