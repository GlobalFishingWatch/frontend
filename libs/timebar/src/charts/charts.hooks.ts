import { useMemo } from 'react'
import { scaleTime } from 'd3-scale'

import { EventTypes } from '@globalfishingwatch/api-types'
import { getUTCDate } from '@globalfishingwatch/data-transforms'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { TimelineScale } from '../timeline/timeline-context'
import { useTimelineContext } from '../timeline/timeline-context'

import type {
  ActivityTimeseriesFrame,
  HighlighterCallback,
  HighlighterIconCallback,
  TimebarChartChunk,
  TimebarChartData,
  TimebarChartItem,
  TimebarChartValue,
} from './charts.types'

export const filterData = <T>(
  data: TimebarChartData<T>,
  start: string,
  end: string
): TimebarChartData<T> => {
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

const MIN_DISTANCE_PX_TO_CLUSTER = 2

export const clusterData = <T>(
  data: TimebarChartData<T>,
  outerScale: TimelineScale
): TimebarChartData<T> => {
  return data.map((item) => {
    const aggregatedChunks = item.chunks.reduce(
      (currentClusteredEvents: TimebarChartChunk<T>[], currentEvent: TimebarChartChunk<T>) => {
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
          const newClusteredEvent: TimebarChartChunk<T> = {
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
      [] as TimebarChartChunk<T>[]
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
  const { outerStart, outerEnd } = useTimelineContext()
  const delta = +new Date(outerEnd) - +new Date(outerStart)
  return delta
}

export const useOuterScale = () => {
  const { outerStart, outerEnd, outerWidth } = useTimelineContext()
  return useMemo(() => {
    return scaleTime()
      .domain([getUTCDate(outerStart), getUTCDate(outerEnd)])
      .range([0, outerWidth])
  }, [outerStart, outerEnd, outerWidth])
}

export const useTimebarTimeOrigin = () => {
  const { overallScale } = useTimelineContext()
  return useMemo(() => overallScale.domain()[0]?.getTime() ?? 0, [overallScale])
}

export const useClusteredChartData = <T>(data: TimebarChartData<T>) => {
  const outerScale = useOuterScale()
  const delta = useDelta()
  return useMemo(() => {
    return clusterData(data, outerScale)
    // only memoize when delta changes (ie start and end can change with delta staying the same)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, delta])
}

const EVENT_TYPES_SORT_ORDER = {
  [EventTypes.Fishing]: 1,
  [EventTypes.Port]: 2,
  [EventTypes.Gap]: 3,
  [EventTypes.Gaps]: 3,
  [EventTypes.Loitering]: 4,
  [EventTypes.Encounter]: 5,
}

const sortChunksByType = (chunkA: TimebarChartChunk, chunkB: TimebarChartChunk) => {
  const first = chunkA.type ? EVENT_TYPES_SORT_ORDER[chunkA.type] : Number.MAX_SAFE_INTEGER
  const second = chunkB.type ? EVENT_TYPES_SORT_ORDER[chunkB.type] : Number.MAX_SAFE_INTEGER
  return first - second
}

const sortDataByType = <T>(data: TimebarChartData<T>): TimebarChartData<T> => {
  return data.map((item) => {
    return {
      ...item,
      chunks: item.chunks.sort(sortChunksByType),
    }
  })
}

const sortDataByTime = <T>(data: TimebarChartData<T>): TimebarChartData<T> => {
  return data.map((item) => {
    return {
      ...item,
      chunks: item.chunks.sort((chunkA, chunkB) => {
        return chunkA.start - chunkB.start
      }),
    }
  })
}

export const useSortedChartData = <T>(data: TimebarChartData<T>, type?: 'byType' | 'byTime') => {
  // Sort events to pick prioritized event on highlight
  return useMemo(() => {
    return type && type === 'byTime' ? sortDataByTime(data) : sortDataByType(data)
  }, [data, type])
}

export const useTimeseriesToChartData = (
  data: ActivityTimeseriesFrame[],
  dataviews: UrlDataviewInstance[],
  highlighterCallback?: HighlighterCallback,
  highlighterIconCallback?: HighlighterIconCallback
): TimebarChartData => {
  return useMemo(() => {
    if (!data || !data.length || !dataviews?.length) return []
    return dataviews?.map((dataview, dataviewIndex) => {
      const values: TimebarChartValue[] = data.map((frame) => {
        return {
          timestamp: frame.date,
          value: frame[dataviewIndex],
          count: frame.count ? frame.count[dataviewIndex] : undefined,
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
