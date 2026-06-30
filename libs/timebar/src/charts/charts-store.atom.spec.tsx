import type { ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { createStore, Provider } from 'jotai'
import { describe, expect, it } from 'vitest'

import type { TimebarChartData } from './charts.types'
import chartsStore, { activeChartsDataState, useUpdateChartsData } from './charts-store.atom'

const DATA_A: TimebarChartData = [{ color: 'a', chunks: [{ start: 0, end: 10 }] }]
const DATA_B: TimebarChartData = [{ color: 'b', chunks: [{ start: 5, end: 15 }] }]

describe('useUpdateChartsData', () => {
  it('registers active data, updates it, and flags inactive on unmount', () => {
    const store = createStore()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { rerender, unmount } = renderHook(({ data }) => useUpdateChartsData('activity', data), {
      initialProps: { data: DATA_A },
      wrapper,
    })

    expect(store.get(chartsStore).activity).toMatchObject({ data: DATA_A, active: true })

    rerender({ data: DATA_B })
    expect(store.get(chartsStore).activity!.data).toBe(DATA_B)
    expect(store.get(chartsStore).activity!.active).toBe(true)

    unmount()
    expect(store.get(chartsStore).activity!.active).toBe(false)
    // data is retained after unmount
    expect(store.get(chartsStore).activity!.data).toBe(DATA_B)
  })

  it('activeChartsDataState excludes inactive charts', () => {
    const store = createStore()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    )

    const { unmount } = renderHook(() => useUpdateChartsData('activity', DATA_A), { wrapper })
    expect(store.get(activeChartsDataState).activity?.data).toBe(DATA_A)

    unmount()
    expect(store.get(activeChartsDataState).activity).toBeUndefined()
  })
})
