import { atom, useSetRecoilState } from 'recoil'
import { useMemo } from 'react'
import { ChartType, TimebarChartData, TimebarChartsData } from '.'

const chartsDataState = atom({
  key: 'charts-data',
  default: {} as TimebarChartsData,
})

export default chartsDataState

export const useUpdateChartsData = (key: ChartType, data: TimebarChartData<void>) => {
  const updateChartsData = useSetRecoilState(chartsDataState)
  useMemo(() => {
    updateChartsData((chartsData: TimebarChartsData) => {
      return {
        ...chartsData,
        [key]: data,
      }
    })
  }, [data, key, updateChartsData])
}
