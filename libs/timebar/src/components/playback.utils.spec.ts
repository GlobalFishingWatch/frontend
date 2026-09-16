import { describe, expect, test } from 'vitest'

import { getTimebarStepByDelta } from './playback.utils'

const ABSOLUTE_START = '2012-01-01T00:00:00.000Z'
const ABSOLUTE_END = '2026-12-31T00:00:00.000Z'

describe('getTimebarStepByDelta', () => {
  test('steps a valid range forward', () => {
    const result = getTimebarStepByDelta({
      start: '2026-01-01T00:00:00.000Z',
      end: '2026-01-02T00:00:00.000Z',
      absoluteStart: ABSOLUTE_START,
      absoluteEnd: ABSOLUTE_END,
      deltaMultiplicator: 1,
    })

    expect(result.start).toBe('2026-01-01T01:00:00.000Z')
    expect(result.end).toBe('2026-01-02T01:00:00.000Z')
    // in-bounds clamp still leaves `clamped` unset — do not start returning `'none'`
    expect(result.clamped).toBeUndefined()
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

  test('does not throw when a step overflows the Date range', () => {
    // Sentry 7733882780: a background-tab rAF gap × a long span overflowed Date and
    // threw RangeError on toISOString. Callers must get the current range back instead.
    expect(() =>
      getTimebarStepByDelta({
        start: '2012-01-01T00:00:00.000Z',
        end: '2026-01-01T00:00:00.000Z',
        absoluteStart: ABSOLUTE_START,
        absoluteEnd: ABSOLUTE_END,
        deltaMultiplicator: 1e12,
        byIntervals: false,
        speedStep: 10,
      })
    ).not.toThrow()
  })
})
