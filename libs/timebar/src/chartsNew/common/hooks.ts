import { useMemo } from 'react'
import { TimebarChartData } from './types'

export const useFilteredChartData = (
  data: TimebarChartData,
  outerStartMs: number,
  outerEndMs: number
) => {
  // TODO overflow + debounce?
  return useMemo(() => {
    return data.map((item) => {
      const filteredChunks = item.chunks.filter((chunk) => {
        const chunkStart = chunk.start
        const chunkEnd = chunk.end || chunk.start
        return chunkEnd > outerStartMs && chunkStart < outerEndMs
      })
      return {
        ...item,
        chunks: filteredChunks,
      }
    })
  }, [data, outerStartMs, outerEndMs])
}

export const useClusteredChartData = (data: TimebarChartData) => {}
