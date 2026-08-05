import { describe, expect, it } from 'vitest'

import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  getColorRamp,
  SPECTRAL_COLOR_RAMP,
  SPECTRAL_COLOR_RAMP_ID,
  SPECTRAL_REVERSED_COLOR_RAMP_ID,
} from './colorRamps'

describe('getColorRamp', () => {
  it('returns the spectral ramp fully opaque, ignoring whiteEnd', () => {
    const ramp = getColorRamp({ rampId: SPECTRAL_COLOR_RAMP_ID, whiteEnd: true, format: 'object' })
    expect(ramp).toHaveLength(SPECTRAL_COLOR_RAMP.length)
    expect(ramp).toHaveLength(COLOR_RAMP_DEFAULT_NUM_STEPS)
    expect(ramp.every((color) => color.a === 1)).toBe(true)
    // blue at the bottom of the domain, red at the top
    expect(ramp[0]).toEqual({ r: 49, g: 54, b: 149, a: 1 })
    expect(ramp[ramp.length - 1]).toEqual({ r: 165, g: 0, b: 38, a: 1 })
  })

  it('flips the spectral ramp when reversed', () => {
    const ramp = getColorRamp({ rampId: SPECTRAL_REVERSED_COLOR_RAMP_ID, format: 'object' })
    expect(ramp).toHaveLength(SPECTRAL_COLOR_RAMP.length)
    // red at the bottom of the domain, blue at the top
    expect(ramp[0]).toEqual({ r: 165, g: 0, b: 38, a: 1 })
    expect(ramp[ramp.length - 1]).toEqual({ r: 49, g: 54, b: 149, a: 1 })
  })

  it('keeps single hue ramps as opacity steps', () => {
    const ramp = getColorRamp({ rampId: 'teal', format: 'object' })
    expect(ramp).toHaveLength(COLOR_RAMP_DEFAULT_NUM_STEPS)
    expect(ramp[0].a).toBeLessThan(1)
  })
})
