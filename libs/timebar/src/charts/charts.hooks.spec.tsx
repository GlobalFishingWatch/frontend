import type { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { TimelineContextProps } from '../timeline/timeline-context'
import { TimelineContext } from '../timeline/timeline-context'

import { filterData, useFilteredChartData } from './charts.hooks'
import type { TimebarChartData } from './charts.types'

describe('filterData', () => {
  it('keeps only chunks overlapping the range and uses start when end is missing', () => {
    const data: TimebarChartData = [
      {
        color: 'x',
        chunks: [
          { start: 0, end: 10 }, // overlaps [5,20]
          { start: 15 }, // no end -> treated as [15,15], overlaps
          { start: 1000, end: 1010 }, // outside
        ],
      },
    ]
    const result = filterData(data, new Date(5).toISOString(), new Date(20).toISOString())
    expect(result[0].chunks).toHaveLength(2)
    expect(result[0].chunks.map((c) => c.start)).toEqual([0, 15])
  })
})

const timelineValue = {
  outerStart: new Date(0).toISOString(),
  outerEnd: new Date(1000).toISOString(),
  outerWidth: 100,
} as unknown as TimelineContextProps

const wrapper = ({ children }: { children: ReactNode }) => (
  <TimelineContext.Provider value={timelineValue}>{children}</TimelineContext.Provider>
)

describe('useFilteredChartData', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('filters to the visible range and dedups no-op updates by reference', () => {
    const data: TimebarChartData = [
      {
        color: 'x',
        chunks: [
          { start: 0, end: 100 },
          { start: 5000, end: 5010 },
        ],
      },
    ]
    const { result, rerender } = renderHook(({ data }) => useFilteredChartData(data), {
      initialProps: { data },
      wrapper,
    })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current[0].chunks).toHaveLength(1)
    expect(result.current[0].chunks[0].start).toBe(0)

    // Re-render with the same data -> filtered result keeps the same reference (no rebuild).
    const filtered = result.current
    rerender({ data })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(result.current).toBe(filtered)
  })
})
