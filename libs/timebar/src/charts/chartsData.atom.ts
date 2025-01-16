import { useCallback, useEffect } from 'react'
import { atom, useSetAtom } from 'jotai'

import type { ChartType, TimebarChartData, TimebarChartsData } from '.'

const chartsDataState = atom({} as TimebarChartsData)

export default chartsDataState

export const useUpdateChartsData = (key: ChartType, data: TimebarChartData<void>) => {
  const updateChartsData = useSetAtom(chartsDataState)

  const setChartDataKeyActive = useCallback(
    ({ key, data, active = true }: { key: ChartType; data: TimebarChartData; active: boolean }) => {
      updateChartsData((chartsData: TimebarChartsData) => {
        return {
          ...chartsData,
          [key]: {
            data,
            active,
          },
        }
      })
    },
    [updateChartsData]
  )

  useEffect(() => {
    setChartDataKeyActive({ key, data, active: true })
    return () => {
      setChartDataKeyActive({ key, data, active: false })
    }
  }, [data, key, setChartDataKeyActive])
}

export const hoveredEventState = atom(undefined as string | undefined)
