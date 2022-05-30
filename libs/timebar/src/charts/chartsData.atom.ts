import { atom, useSetRecoilState } from 'recoil'
import { useCallback, useEffect } from 'react'
import { ChartType, TimebarChartData, TimebarChartsData } from '.'

const chartsDataState = atom({
  key: 'charts-data',
  default: {} as TimebarChartsData,
})

export default chartsDataState

export const useUpdateChartsData = (key: ChartType, data: TimebarChartData<void>) => {
  const updateChartsData = useSetRecoilState(chartsDataState)

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

export const hoveredEventState = atom({
  key: 'hovered-event',
  default: undefined as string | undefined,
})
