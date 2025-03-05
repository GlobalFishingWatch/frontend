import { useContext, useEffect, useMemo, useState } from 'react'
import { scaleTime } from 'd3-scale'
import { useDebouncedCallback } from 'use-debounce'

import { EventTypes } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { TimelineScale } from '../../timelineContext'
import TimelineContext from '../../timelineContext'

import type {
  ActivityTimeseriesFrame,
  HighlighterCallback,
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TimebarChartValue,
} from './types'

export const filterData = (data: TimebarChartData<any>, start: string, end: string) => {
  const startMillis = getUTCDate(start).getTime()
  const endMillis = getUTCDate(end).getTime()
  return data?.map((item) => {
    const filteredChunks = item?.chunks?.length
      ? item.chunks.filter((chunk) => {
          const chunkStart = chunk.start
          const chunkEnd = chunk.end || chunk.start
          return chunkEnd > startMillis && chunkStart < endMillis
        })
      : []
    return {
      ...item,
      chunks: filteredChunks,
    }
  })
}

export const useFilteredChartData = (data: TimebarChartData<any>) => {
  const { outerStart, outerEnd } = useContext(TimelineContext)
  const [filteredData, setFilteredData] = useState<TimebarChartData<any>>([])

  const getDataHash = (d: TimebarChartData<any>) => {
    return d
      .flatMap((vessel) => [
        vessel.chunks[0]?.start,
        vessel.chunks[0]?.values?.[0]?.value,
        vessel.chunks[vessel.chunks.length - 1]?.end,
        vessel.chunks[vessel.chunks.length - 1]?.values?.[vessel.chunks.length - 1]?.value,
        Object.values(vessel.filters || {}).join(''),
      ])
      .join()
  }

  const debouncedSetFilteredData = useDebouncedCallback(
    (data, outerStart, outerEnd) => {
      const newData = filterData(data, outerStart, outerEnd)
      if (getDataHash(filteredData) !== getDataHash(newData)) setFilteredData(newData)
    },
    100,
    { maxWait: 1000, leading: true }
  )

  useEffect(() => {
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
              ids: [currentEvent.id as string],
              numChunks: 1,
            },
          }
          return [...currentClusteredEvents, newClusteredEvent]
        }
        lastClusteredEvent.end = currentEvent.end
        if (lastClusteredEvent.cluster) {
          lastClusteredEvent.cluster.numChunks++
          lastClusteredEvent.cluster.ids.push(currentEvent.id as string)
        }
        return currentClusteredEvents
      },
      []
    )
    const lastChunk = aggregatedChunks[aggregatedChunks.length - 1]
    if (lastChunk && lastChunk.cluster?.numChunks === 1) {
      delete lastChunk.cluster
    }

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

export const useOuterScale = () => {
  const { outerStart, outerEnd, outerWidth } = useContext(TimelineContext)
  return useMemo(() => {
    return scaleTime()
      .domain([getUTCDate(outerStart), getUTCDate(outerEnd)])
      .range([0, outerWidth])
  }, [outerStart, outerEnd, outerWidth])
}

export const useClusteredChartData = (data: TimebarChartData<any>) => {
  const outerScale = useOuterScale()
  const delta = useDelta()
  return useMemo(() => {
    return clusterData(data, outerScale)
  }, [data, delta]) // only memoize when delta changes (ie start and end can change with delta staying the same)
}

const EVENT_TYPES_SORT_ORDER = {
  [EventTypes.Fishing]: 1,
  [EventTypes.Port]: 2,
  [EventTypes.Gap]: 3,
  [EventTypes.Loitering]: 4,
  [EventTypes.Encounter]: 5,
}

export const sortChunksByType = (chunkA: TimebarChartChunk, chunkB: TimebarChartChunk) => {
  const first = chunkA.type ? EVENT_TYPES_SORT_ORDER[chunkA.type] : Number.MAX_SAFE_INTEGER
  const second = chunkB.type ? EVENT_TYPES_SORT_ORDER[chunkB.type] : Number.MAX_SAFE_INTEGER
  let result = 0
  if (first < second) result = -1
  else if (first > second) result = 1
  return result
}

const sortDataByType = (data: TimebarChartData<any>) => {
  return data.map((item) => {
    return {
      ...item,
      chunks: item.chunks.sort(sortChunksByType),
    }
  })
}

const sortDataByTime = (data: TimebarChartData<any>) => {
  return data.map((item) => {
    return {
      ...item,
      chunks: item.chunks.sort((chunkA, chunkB) => {
        return chunkA.start - chunkB.start
      }),
    }
  })
}

export const useSortedChartData = (data: TimebarChartData<any>, type?: 'byType' | 'byTime') => {
  // Sort events to pick prioritized event on highlight
  return useMemo(() => {
    return type && type === 'byTime' ? sortDataByTime(data) : sortDataByType(data)
  }, [data, type])
}

export const useTimeseriesToChartData = (
  data: ActivityTimeseriesFrame[],
  dataviews: UrlDataviewInstance[],
  highlighterCallback?: HighlighterCallback,
  highlighterIconCallback?: HighlighterCallback
): TimebarChartData => {
  return useMemo(() => {
    if (!data || !data.length || !dataviews?.length) return []
    return dataviews?.map((dataview, dataviewIndex) => {
      const values: TimebarChartValue[] = data.map((frame) => {
        return {
          timestamp: frame.date,
          value: frame[dataviewIndex],
        }
      })
      const chunk: TimebarChartChunk = {
        start: data[0].date,
        end: data[data.length - 1].date,
        values,
      }
      const item: TimebarChartItem = {
        chunks: [chunk],
        color: dataview.config?.color,
        getHighlighterLabel: highlighterCallback,
        getHighlighterIcon: highlighterIconCallback,
        props: {
          unit: dataview.datasets?.[0]?.unit || '',
          dataviewId: dataview.id,
        },
      }
      return item
    })
  }, [data, dataviews, highlighterCallback, highlighterIconCallback])
}
