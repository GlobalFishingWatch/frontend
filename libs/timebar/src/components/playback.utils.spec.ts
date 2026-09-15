import { describe, expect, test } from 'vitest'

import { getTimebarStepByDelta } from './playback.utils'

const ABSOLUTE_START = '2012-01-01T00:00:00.000Z'
const ABSOLUTE_END = '2026-12-31T00:00:00.000Z'

describe('getTimebarStepByDelta', () => {
  test('steps a valid range forward', () => {
    const { start, end } = getTimebarStepByDelta({
      start: '2026-01-01T00:00:00.000Z',
      end: '2026-01-02T00:00:00.000Z',
      absoluteStart: ABSOLUTE_START,
      absoluteEnd: ABSOLUTE_END,
      deltaMultiplicator: 1,
    })

    expect(start).toBe('2026-01-01T01:00:00.000Z')
    expect(end).toBe('2026-01-02T01:00:00.000Z')
  })

  test('returns the range untouched when it is not a parseable date', () => {
    // `start`/`end` url params are only validated as strings, so garbage reaches the timebar
    const result = getTimebarStepByDelta({
      start: 'not-a-date',
      end: '2026-01-02T00:00:00.000Z',
      absoluteStart: ABSOLUTE_START,
      absoluteEnd: ABSOLUTE_END,
      deltaMultiplicator: 1,
    })

    expect(result).toEqual({
      start: 'not-a-date',
      end: '2026-01-02T00:00:00.000Z',
      clamped: 'none',
    })
  })
})
