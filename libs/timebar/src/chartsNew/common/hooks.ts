import { useContext, useMemo } from 'react'
import TimelineContext from '../../timelineContext'
import { TimebarChartData } from './types'

export const useFilteredChartData = (data: TimebarChartData) => {
  const { outerStart, outerEnd } = useContext(TimelineContext)
  // TODO overflow + debounce?
  return useMemo(() => {
    return data.map((item) => {
      const filteredChunks = item.chunks.filter((chunk) => {
        const chunkStart = chunk.start
        const chunkEnd = chunk.end || chunk.start
        return chunkEnd > +new Date(outerStart) && chunkStart < +new Date(outerEnd)
      })
      return {
        ...item,
        chunks: filteredChunks,
      }
    })
  }, [data, outerStart, outerEnd])
}

export const useClusteredChartData = (data: TimebarChartData) => {}
