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

  it('ignores a lagged echo of its own emission (no snap-back)', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    act(() => {
      result.current.notifyChange('2020-03-01T00:00:00.000Z', '2020-04-01T00:00:00.000Z')
      result.current.notifyChange('2020-03-02T00:00:00.000Z', '2020-04-02T00:00:00.000Z')
    })
    // Parent echoes the older emission back as props, one commit late.
    rerender({
      ...baseParams,
      start: '2020-03-01T00:00:00.000Z',
      end: '2020-04-01T00:00:00.000Z',
      onChange,
    })

    expect(result.current.rangeRef.current.start).toBe('2020-03-02T00:00:00.000Z')
    expect(result.current.range.start).toBe('2020-03-02T00:00:00.000Z')
  })

  it('adopts a genuine external change even between emissions (playback running)', () => {
    // No interaction guard: a workspace load / URL nav arriving mid-playback must win,
    // and the playback cursor (rangeRef) must continue from it.
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    act(() => {
      result.current.notifyChange('2020-03-01T00:00:00.000Z', '2020-04-01T00:00:00.000Z')
      result.current.notifyChange('2020-03-02T00:00:00.000Z', '2020-04-02T00:00:00.000Z')
    })
    // Never-emitted value: external change, not an echo.
    rerender({
      ...baseParams,
      start: '2018-05-01T00:00:00.000Z',
      end: '2018-06-01T00:00:00.000Z',
      onChange,
    })

    expect(result.current.range.start).toBe('2018-05-01T00:00:00.000Z')
    expect(result.current.rangeRef.current.start).toBe('2018-05-01T00:00:00.000Z')
  })

  it('keeps range monotonic when lagged echoes arrive between playback steps', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    const starts: string[] = []
    let prev: { start: string; end: string } | null = null
    for (let day = 1; day <= 5; day++) {
      const newStart = `2020-01-0${day}T00:00:00.000Z`
      const newEnd = `2020-02-0${day}T00:00:00.000Z`
      act(() => {
        result.current.notifyChange(newStart, newEnd)
      })
      // Parent echoes the previous frame's emission between rAF frames.
      if (prev) {
        rerender({ ...baseParams, start: prev.start, end: prev.end, onChange })
      }
      starts.push(result.current.rangeRef.current.start)
      expect(result.current.range.start).toBe(newStart)
      prev = { start: newStart, end: newEnd }
    }

    for (let i = 1; i < starts.length; i++) {
      expect(new Date(starts[i]).getTime()).toBeGreaterThan(new Date(starts[i - 1]).getTime())
    }
  })

  it('adopts a snapped value the parent sends back after a release', () => {
    // On RELEASE sources the app snaps the emitted value to the interval and sends the
    // snapped (different) value back. It was never emitted, so it must be adopted.
    const onChange = vi.fn()
    const { result, rerender } = renderHook((props) => useTimebarRange(props), {
      initialProps: { ...baseParams, onChange },
    })

    act(() => {
      result.current.notifyChange('2020-03-01T11:37:00.000Z', '2020-04-01T15:02:00.000Z')
    })
    rerender({
      ...baseParams,
      start: '2020-03-01T00:00:00.000Z',
      end: '2020-04-02T00:00:00.000Z',
      onChange,
    })

    expect(result.current.range.start).toBe('2020-03-01T00:00:00.000Z')
    expect(result.current.rangeRef.current.end).toBe('2020-04-02T00:00:00.000Z')
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
