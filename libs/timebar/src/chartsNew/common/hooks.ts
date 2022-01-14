import { useContext, useMemo, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { EventTypes } from '@globalfishingwatch/api-types'
import TimelineContext, { TimelineScale } from '../../timelineContext'
import { TimebarChartData, TimebarChartChunk } from './types'

export const filterData = (data: TimebarChartData<any>, start: string, end: string) => {
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

export const useFilteredChartData = (data: TimebarChartData<any>) => {
  const { outerStart, outerEnd } = useContext(TimelineContext)
  const [filteredData, setFilteredData] = useState<TimebarChartData<any>>([])
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

export const clusterData = (data: TimebarChartData<any>, outerScale: TimelineScale) => {
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

const useDelta = () => {
  const { outerStart, outerEnd } = useContext(TimelineContext)
  const delta = +new Date(outerEnd) - +new Date(outerStart)
  return delta
}

export const useClusteredChartData = (data: TimebarChartData<any>) => {
  const ctx = useContext(TimelineContext)
  const outerScale = ctx.outerScale
  const delta = useDelta()
  return useMemo(() => {
    return clusterData(data, outerScale)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, delta]) // only memoize when delta changes (ie start and end can change with delta staying the same)
}

const EVENT_TYPES_SORT_ORDER = {
  [EventTypes.Encounter]: 1,
  [EventTypes.Loitering]: 2,
  [EventTypes.Gap]: 3,
  [EventTypes.Port]: 4,
  [EventTypes.Fishing]: 5,
}

const sortData = (data: TimebarChartData<any>) => {
  return data.map((item) => {
    return {
      ...item,
      chunks: item.chunks.sort((chunkA, chunkB) => {
        const first = chunkA.type ? EVENT_TYPES_SORT_ORDER[chunkA.type] : Number.MAX_SAFE_INTEGER
        const second = chunkB.type ? EVENT_TYPES_SORT_ORDER[chunkB.type] : Number.MAX_SAFE_INTEGER
        let result = 0
        if (first < second) result = -1
        else if (first > second) result = 1
        return result
      }),
    }
  })
}

export const useSortedChartData = (data: TimebarChartData<any>) => {
  // Sort events to pick prioritized event on highlight
  return useMemo(() => {
    return sortData(data)
  }, [data])
}
