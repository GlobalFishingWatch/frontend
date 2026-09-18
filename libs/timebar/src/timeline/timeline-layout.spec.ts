import { describe, expect, it } from 'vitest'

import { getBaseUnit } from './timeline-layout'

const range = (hours: number) => ({
  start: '2026-09-16T00:00:00.000Z',
  end: new Date(Date.UTC(2026, 8, 16, hours)).toISOString(),
})

describe('getBaseUnit', () => {
  it('drops minute ticks to hours when the data is hourly', () => {
    const { start, end } = range(1)
    expect(getBaseUnit(start, end, 'hour').baseUnit).toBe('hour')
    expect(getBaseUnit(start, end, 'minute').baseUnit).toBe('minute')
  })

  it('leaves coarser units untouched', () => {
    const { start, end } = range(24 * 10)
    expect(getBaseUnit(start, end, 'hour').baseUnit).toBe('day')
  })
})
