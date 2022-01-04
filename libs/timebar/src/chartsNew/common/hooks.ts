import { useContext, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { TimelineContextProps } from '../../types'
import TimelineContext from '../../timelineContext'
import { TimebarChartData } from './types'

const filterData = (data: TimebarChartData, start: string, end: string) => {
  return data.map((item) => {
    const filteredChunks = item.chunks.filter((chunk) => {
      const chunkStart = chunk.start
      const chunkEnd = chunk.end || chunk.start
      return chunkEnd > +new Date(start) && chunkStart < +new Date(end)
    })
    return {
      ...item,
      chunks: filteredChunks,
    }
  })
}

export const useFilteredChartData = (data: TimebarChartData) => {
  const { outerStart, outerEnd } = useContext(TimelineContext) as TimelineContextProps

  const [filteredData, setFilteredData] = useState<TimebarChartData>([])
  const debounced = useDebouncedCallback(
    (start, end) => {
      setFilteredData(filterData(data, start, end))
    },
    100,
    { maxWait: 1000, leading: true }
  )

  useMemo(() => {
    debounced(outerStart, outerEnd)
  }, [outerStart, outerEnd, debounced])

  return filteredData
}

export const useClusteredChartData = (data: TimebarChartData) => {}
