import { useContext, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { TimelineContextProps, TimelineScale } from '../../types'
import TimelineContext from '../../timelineContext'
import { TimebarChartChunk } from '..'
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

const MIN_DISTANCE_PX_TO_CLUSTER = 2

const clusterData = (data: TimebarChartData, outerScale: TimelineScale) => {
  return data.map((item) => {
    const aggregatedChunks = item.chunks.reduce(
      (currentClusteredEvents: TimebarChartChunk[], currentEvent: TimebarChartChunk) => {
        const lastClusteredEvent = currentClusteredEvents[currentClusteredEvents.length - 1]
        const lastType = lastClusteredEvent ? lastClusteredEvent.type : null
        const lastEnd =
          lastClusteredEvent && lastClusteredEvent.end
            ? lastClusteredEvent.end
            : Number.NEGATIVE_INFINITY
        const currentEventStartPx = outerScale(currentEvent.start)
        const lastEndPx = outerScale(lastEnd)
        const deltaPx = currentEventStartPx - lastEndPx

        if (deltaPx > MIN_DISTANCE_PX_TO_CLUSTER || currentEvent.type !== lastType) {
          // create new agg event
          const newClusteredEvent: TimebarChartChunk = {
            ...currentEvent,
            cluster: {
              numChunks: 1,
            },
          }
          return [...currentClusteredEvents, newClusteredEvent]
        }
        lastClusteredEvent.end = currentEvent.end
        lastClusteredEvent.cluster!.numChunks++
        return currentClusteredEvents
      },
      []
    )
    return {
      ...item,
      chunks: aggregatedChunks,
    }
  })
}

export const useClusteredChartData = (data: TimebarChartData) => {
  const { outerStart, outerEnd, outerScale } = useContext(TimelineContext) as TimelineContextProps
  const delta = +new Date(outerEnd) - +new Date(outerStart)
  return useMemo(() => {
    return clusterData(data, outerScale)
  }, [data, delta])
}
