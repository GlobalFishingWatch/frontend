import { useEffect } from 'react'
import { atom, useSetAtom } from 'jotai'

import type { ChartType, TimebarChartData, TimebarChartsData } from '.'

const chartsDataState = atom({} as TimebarChartsData)

export default chartsDataState

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
