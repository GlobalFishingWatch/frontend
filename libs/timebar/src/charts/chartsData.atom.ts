import { useEffect } from 'react'
import { atom, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'

import type { ChartType, TimebarChartData, TimebarChartsData } from '.'

const chartsDataState = atom({} as TimebarChartsData)

export default chartsDataState

const selectActiveCharts = (s: TimebarChartsData) =>
  Object.fromEntries(Object.entries(s).filter(([, v]) => v?.active)) as TimebarChartsData

const activeChartsEqual = (a: TimebarChartsData, b: TimebarChartsData) => {
  const ak = Object.keys(a)
  if (ak.length !== Object.keys(b).length) return false
  return ak.every((k) => a[k as ChartType]?.data === b[k as ChartType]?.data)
}

// Active-only view so the highlighter re-renders only when active-chart data changes
export const activeChartsDataState = selectAtom(
  chartsDataState,
  selectActiveCharts,
  activeChartsEqual
)

export const useUpdateChartsData = (key: ChartType, data: TimebarChartData) => {
  const setChartsData = useSetAtom(chartsDataState)

  // Keep this chart's data current (one atom write per data change; stays active while mounted).
  useEffect(() => {
    setChartsData((prev) => ({ ...prev, [key]: { data, active: true } }))
  }, [key, data, setChartsData])

  // Flag inactive on unmount so the highlighter ignores it (keeps the last data).
  useEffect(() => {
    return () => {
      setChartsData((prev) => ({ ...prev, [key]: { ...prev[key], active: false } }))
    }
  }, [key, setChartsData])
}

export const hoveredEventState = atom(undefined as string | undefined)
