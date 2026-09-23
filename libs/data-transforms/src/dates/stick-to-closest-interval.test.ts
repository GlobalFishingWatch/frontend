import { describe, expect, it } from 'vitest'

import { stickToClosestInterval } from './dates'

describe('stickToClosestInterval', () => {
  it('snaps a sub-day range to hour boundaries', () => {
    expect(
      stickToClosestInterval({ start: '2026-09-16T14:23:00.000Z', end: '2026-09-16T20:41:00.000Z' })
    ).toEqual({ start: '2026-09-16T14:00:00.000Z', end: '2026-09-16T21:00:00.000Z' })
  })

  it('never returns an empty range', () => {
    const { start, end } = stickToClosestInterval({
      start: '2026-09-16T14:02:00.000Z',
      end: '2026-09-16T14:04:00.000Z',
    })
    expect(new Date(end).getTime()).toBeGreaterThan(new Date(start).getTime())
  })
})
