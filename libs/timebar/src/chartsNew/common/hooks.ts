import { useContext, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import TimelineContext, { TimelineScale } from '../../timelineContext'
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
  const { outerStart, outerEnd } = useContext(TimelineContext)

  const [filteredData, setFilteredData] = useState<TimebarChartData>([])
  const debouncedSetFilteredData = useDebouncedCallback(
    (data, outerStart, outerEnd) => {
      setFilteredData(filterData(data, outerStart, outerEnd))
    },
    100,
    { maxWait: 1000, leading: true }
  )

  useMemo(() => {
    debouncedSetFilteredData(data, outerStart, outerEnd)
  }, [outerStart, outerEnd, data, debouncedSetFilteredData])

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

        if (
          !lastClusteredEvent ||
          !lastClusteredEvent.end ||
          deltaPx > MIN_DISTANCE_PX_TO_CLUSTER ||
          currentEvent.type !== lastType
        ) {
          if (lastClusteredEvent && lastClusteredEvent.cluster?.numChunks === 1) {
            delete lastClusteredEvent.cluster
          }
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
        if (lastClusteredEvent.cluster) lastClusteredEvent.cluster.numChunks++
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
  const { outerStart, outerEnd, outerScale } = useContext(TimelineContext)
  const delta = +new Date(outerEnd) - +new Date(outerStart)
  return useMemo(() => {
    return clusterData(data, outerScale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, delta]) // only memoize when delta changes (ie start and end can change with delta staying the same)
}
