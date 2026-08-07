import { describe, expect, it } from 'vitest'

import { getLegendColorScale } from './timebar.utils'

// value domain and rgba colors as published by a layer legend
const DOMAIN = [0, 10, 20]
const COLORS = ['rgba(0, 0, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 0, 0, 1)']

describe('getLegendColorScale', () => {
  it('interpolates between the legend stops', () => {
    const scale = getLegendColorScale(DOMAIN, COLORS)!
    expect(scale(0)).toEqual([0, 0, 255, 255])
    expect(scale(10)).toEqual([255, 255, 255, 255])
    // half way between the first two stops, not snapped to either
    expect(scale(5)).toEqual([128, 128, 255, 255])
  })

  it('clamps outside the domain', () => {
    const scale = getLegendColorScale(DOMAIN, COLORS)!
    expect(scale(-100)).toEqual([0, 0, 255, 255])
    expect(scale(100)).toEqual([255, 0, 0, 255])
  })

  it('returns undefined when domain and colors do not match', () => {
    expect(getLegendColorScale(DOMAIN, COLORS.slice(1))).toBeUndefined()
    expect(getLegendColorScale([], [])).toBeUndefined()
  })
})
