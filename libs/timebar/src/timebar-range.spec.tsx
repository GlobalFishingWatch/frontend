import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useTimebarRange } from './timebar-range'

const baseParams = {
  start: '2020-01-01T00:00:00.000Z',
  end: '2020-02-01T00:00:00.000Z',
  minimumRangeMs: 1000 * 60 * 60, // 1h
  maximumRangeMs: Number.POSITIVE_INFINITY,
}

describe('useTimebarRange', () => {
  afterEach(() => vi.restoreAllMocks())

  it('advances cumulatively with no prop feedback (parent ignores onChange)', () => {
    const onChange = vi.fn()
    // Parent never feeds the emitted range back as props — mimics the lagged/ignored
    // round-trip. rangeRef must keep the value notifyChange wrote.
    const { result } = renderHook(() => useTimebarRange({ ...baseParams, onChange }))

    act(() => {
      result.current.notifyChange('2020-01-02T00:00:00.000Z', '2020-02-02T00:00:00.000Z')
    })
    expect(result.current.rangeRef.current.start).toBe('2020-01-02T00:00:00.000Z')

    act(() => {
      // Builds on the previous emit, not on the stale prop.
      const next = result.current.rangeRef.current
      result.current.notifyChange(
        new Date(new Date(next.start).getTime() + 86400000).toISOString(),
        new Date(new Date(next.end).getTime() + 86400000).toISOString()
      )
    })
    expect(result.current.rangeRef.current.start).toBe('2020-01-03T00:00:00.000Z')
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('adopts an external prop change while idle', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    rerender({ ...baseParams, start: '2019-06-01T00:00:00.000Z', onChange })
    expect(result.current.range.start).toBe('2019-06-01T00:00:00.000Z')
    expect(result.current.rangeRef.current.start).toBe('2019-06-01T00:00:00.000Z')
  })

  it('ignores a prop echo while interacting (no snap-back)', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    act(() => {
      result.current.beginInteraction()
      result.current.notifyChange('2020-03-01T00:00:00.000Z', '2020-04-01T00:00:00.000Z')
    })
    // Parent echoes a stale/lagged value back as props mid-interaction.
    rerender({ ...baseParams, start: '2020-01-01T00:00:00.000Z', onChange })

    expect(result.current.rangeRef.current.start).toBe('2020-03-01T00:00:00.000Z')
  })

  it('adopts the next external change after the interaction ends', () => {
    // The interaction-guard contract the timeline/playback loops rely on: echoes are
    // ignored while interacting, but once endInteraction runs the next external prop
    // change must win again (otherwise bookmarks/URL/presets would be stuck).
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    act(() => {
      result.current.beginInteraction()
      result.current.notifyChange('2020-03-01T00:00:00.000Z', '2020-04-01T00:00:00.000Z')
    })
    // Echo while interacting is ignored.
    rerender({ ...baseParams, start: '2020-01-01T00:00:00.000Z', onChange })
    expect(result.current.rangeRef.current.start).toBe('2020-03-01T00:00:00.000Z')

    act(() => {
      result.current.endInteraction()
    })
    // A genuine external change arriving after the gesture is adopted.
    rerender({ ...baseParams, start: '2018-05-01T00:00:00.000Z', onChange })
    expect(result.current.range.start).toBe('2018-05-01T00:00:00.000Z')
    expect(result.current.rangeRef.current.start).toBe('2018-05-01T00:00:00.000Z')
  })

  it('clamps to the minimum range', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useTimebarRange({ ...baseParams, onChange }))

    act(() => {
      // 1 minute < 1h minimum -> start pulled back to keep the minimum span.
      result.current.notifyChange('2020-01-01T00:00:00.000Z', '2020-01-01T00:01:00.000Z')
    })
    const { start, end } = result.current.rangeRef.current
    expect(new Date(end).getTime() - new Date(start).getTime()).toBe(baseParams.minimumRangeMs)
  })
})
