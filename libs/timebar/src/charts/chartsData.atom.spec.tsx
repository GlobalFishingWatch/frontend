import type { ReactNode } from 'react'
import { renderHook } from '@testing-library/react'
import { createStore, Provider } from 'jotai'
import { describe, expect, it } from 'vitest'

import type { TimebarChartData } from './common/types'
import chartsDataState, { useUpdateChartsData } from './chartsData.atom'

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

    expect(store.get(chartsDataState).activity).toEqual({ data: DATA_A, active: true })

    rerender({ data: DATA_B })
    expect(store.get(chartsDataState).activity.data).toBe(DATA_B)
    expect(store.get(chartsDataState).activity.active).toBe(true)

    unmount()
    expect(store.get(chartsDataState).activity.active).toBe(false)
    // data is retained after unmount
    expect(store.get(chartsDataState).activity.data).toBe(DATA_B)
  })
})
