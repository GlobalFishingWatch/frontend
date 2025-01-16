import { intersection } from 'lodash'
import type { DurationLikeObject} from 'luxon';
import { DateTime, Duration, Interval as LuxonInterval } from 'luxon'

import type { Interval } from '../types'

import { getSourceId } from '.'

export type TimeChunk = {
  id: string
  sourceId?: string
  start?: string
  viewEnd?: string
  dataEnd?: string
  quantizeOffset: number
  frame: number
  active: boolean
}

export type TimeChunks = {
  chunks: TimeChunk[]
  delta: number
  deltaInIntervalUnits: number
  deltaInDays: number
  interval: Interval
  activeStart: string
  activeEnd: string
  activeChunkFrame: number
  activeSourceId: string
  visibleStartFrame: number
  visibleEndFrame: number
}

export const toDT = (dateISO: string) => DateTime.fromISO(dateISO, { zone: 'utc' })

export const pickActiveTimeChunk = (timeChunks: TimeChunks) =>
  timeChunks?.chunks?.find((t) => t.active) || timeChunks?.chunks[0]

// Buffer size relative to active time delta
const TIME_CHUNK_BUFFER_RELATIVE_SIZE = 0.2

const getVisibleStartFrame = (rawFrame: number) => {
  return Math.floor(rawFrame)
}

export const INTERVAL_ORDER: Interval[] = ['HOUR', 'DAY', 'MONTH', 'YEAR']
export const LIMITS_BY_INTERVAL: Record<
  Interval,
  { unit: keyof DurationLikeObject; value: number } | undefined
> = {
  HOUR: {
    unit: 'days',
    value: 3,
  },
  DAY: {
    unit: 'months',
    value: 3,
  },
  MONTH: {
    unit: 'year',
    value: 6,
  },
  YEAR: undefined,
}

const checkValidInterval = (interval: Interval, duration: Duration) => {
  const intervalLimit = LIMITS_BY_INTERVAL[interval]
  if (intervalLimit) {
    return Math.round(duration.as(intervalLimit.unit)) <= intervalLimit.value
  }
  return true
}

export const CONFIG_BY_INTERVAL: Record<Interval, Record<string, any>> = {
  HOUR: {
    isValid: (duration: Duration): boolean => {
      return checkValidInterval('HOUR', duration)
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      return DateTime.fromMillis(bufferedActiveStart, { zone: 'utc' }).startOf('week')
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ days: 14 })
    },
    getChunkDataEnd: (chunkViewEnd: DateTime): DateTime => {
      return chunkViewEnd.plus({ days: 2 })
    },
    // We will substract every timestamp with a quantize offset to end up with shorter arrays indexes
    getRawFrame: (start: number) => {
      return start / 1000 / 60 / 60
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60)
    },
  },
  DAY: {
    isValid: (duration: Duration): boolean => {
      return checkValidInterval('DAY', duration)
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      const monthStart = DateTime.fromMillis(bufferedActiveStart, { zone: 'utc' }).startOf('month')
      const monthStartMonth = monthStart.get('month')
      const chunkStart = monthStart.set({ month: monthStartMonth - ((monthStartMonth - 1) % 2) })

      return chunkStart
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ months: 5 })
    },
    getChunkDataEnd: (chunkViewEnd: DateTime): DateTime => {
      return chunkViewEnd.plus({ months: 1 })
    },
    getRawFrame: (start: number) => {
      return start / 1000 / 60 / 60 / 24
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60 * 24)
    },
  },
  MONTH: {
    isValid: (duration: Duration): boolean => {
      return checkValidInterval('MONTH', duration)
    },
    getRawFrame: (start: number) => {
      return LuxonInterval.fromDateTimes(
        DateTime.fromMillis(0, { zone: 'utc' }).minus({ years: 1970 }),
        DateTime.fromMillis(start, { zone: 'utc' })
      ).toDuration('month').months
    },
    getDate: (frame: number) => {
      const year = Math.floor(frame / 12)
      const month = frame % 12
      return new Date(Date.UTC(year, month, 1))
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      return DateTime.fromMillis(bufferedActiveStart).toUTC().startOf('month')
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ months: 3 })
    },
    getChunkDataEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ month: 2 })
    },
  },
  YEAR: {
    isValid: (duration: Duration): boolean => {
      return checkValidInterval('YEAR', duration)
    },
    getRawFrame: (start: number) => {
      return LuxonInterval.fromDateTimes(
        DateTime.fromMillis(0, { zone: 'utc' }).minus({ years: 1970 }),
        DateTime.fromMillis(start, { zone: 'utc' })
      ).toDuration('year').years
    },
    getDate: (frame: number) => {
      return new Date(Date.UTC(frame, 0, 1))
    },
  },
}

/**
 * Returns the type of interval for a given delta in ms
 * @param delta delta in ms
 * @param availableIntervals a set of availableIntervals (ie one for each sublayer)
 * @param omitIntervals remove intervals for consideration (ie TimeCompare mode)
 */
export const getInterval = (
  activeStart: string,
  activeEnd: string,
  availableIntervals: Interval[][],
  omitIntervals: Interval[] = []
): Interval => {
  const deltaMs = +toDT(activeEnd) - +toDT(activeStart)

  // Get intervals that are common to all dataset (initial array provided to ensure order from smallest to largest)
  const commonIntervals = intersection(INTERVAL_ORDER, ...availableIntervals)
  const intervals = commonIntervals.filter((interval) => !omitIntervals.includes(interval))
  const fallbackOption = intervals.length ? intervals[intervals.length - 1] : 'DAY'
  if (!intervals.length) {
    console.warn(
      `no common interval found, using the largest available option (${fallbackOption})`,
      availableIntervals,
      omitIntervals
    )
    return fallbackOption
  }

  const duration = Duration.fromMillis(deltaMs)
  const validIntervals = intervals.filter((interval) => {
    const valid = CONFIG_BY_INTERVAL[interval].isValid(duration)
    return valid
  })
  if (!validIntervals?.length) {
    if (!omitIntervals?.length) {
      // Warn only needed when no omitedIntervals becuase anaylis mode needs to fallback
      // to day when out of range for hours
      console.warn(
        `no valid interval found, using the largest available option (${fallbackOption})`,
        validIntervals
      )
    }
    return fallbackOption
  }
  return validIntervals[0]
}

/**
 * Returns an array of starting points for future time chunks
 * @param bufferedActiveStart start of the buffer in ms
 * @param bufferedActiveEnd  end of the buffer in ms
 * @param interval interval to consider ('day' or 'hour')
 */
const getChunkStarts = (
  bufferedActiveStart: number,
  bufferedActiveEnd: number,
  interval: Interval
): DateTime[] => {
  const config = CONFIG_BY_INTERVAL[interval]
  const firstChunkStart = config.getFirstChunkStart(bufferedActiveStart)
  const chunkStarts: DateTime[] = [firstChunkStart]
  while (true) {
    const nextChunkStart = config.getChunkViewEnd(chunkStarts[chunkStarts.length - 1])
    if (+nextChunkStart > Date.now() || +nextChunkStart > bufferedActiveEnd) {
      break
    }
    chunkStarts.push(nextChunkStart)
  }
  return chunkStarts
}

/**
 * Derive full time chunks from chunk starts
 * @param chunkStarts a series of chunk starts as DT objects
 * @param datasetStart start of available data for this dataset
 * @param datasetEnd end of available data for this dataset
 * @param interval interval to consider ('day' or 'hour')
 */
const getTimeChunks = (
  baseId: string,
  chunkStarts: DateTime[],
  datasetStart: string,
  datasetEnd: string,
  interval: Interval,
  activeStart: string
) => {
  const config = CONFIG_BY_INTERVAL[interval]
  let activeChunkFrame = 0
  let activeSourceId = ''

  const chunks: TimeChunk[] = chunkStarts.flatMap((chunkStart) => {
    // end of *usable* tileset is end of year
    // end of *loaded* tileset is end of year + 100 days
    const chunkViewEnd = config.getChunkViewEnd(chunkStart)
    let chunkDataEnd = config.getChunkDataEnd(chunkViewEnd)
    // use dataset start if chunk starts before dataset
    if (+chunkStart < +toDT(datasetStart)) chunkStart = toDT(datasetStart)
    // use dataset end if chunk ends after dataset
    if (+chunkDataEnd > +toDT(datasetEnd)) {
      // in case the start of the chunk is after the dataset extend the chunk is discarded
      if ((chunkStart.toISODate() as string) >= datasetEnd.split('T')[0]) {
        return []
      }
      chunkDataEnd = toDT(datasetEnd)
    }
    const start = chunkStart.toString()
    const viewEnd = chunkViewEnd.toString()
    const dataEnd = chunkDataEnd.toString()

    // we will substract every timestamp with this to end up with shorter arrays indexes
    const quantizeOffset = getVisibleStartFrame(config.getRawFrame(+chunkStart))

    const activeStartDT = +toDT(activeStart)
    const isActive = activeStartDT > +chunkStart && activeStartDT <= chunkViewEnd
    const frame = toQuantizedFrame(activeStart, quantizeOffset, interval)
    const id = `heatmapchunk_${start.slice(0, 13)}_${viewEnd.slice(0, 13)}`

    const chunk: TimeChunk = {
      start,
      viewEnd,
      dataEnd,
      quantizeOffset,
      id,
      frame,
      active: isActive,
    }
    chunk.sourceId = getSourceId(baseId, chunk)
    if (isActive) {
      activeChunkFrame = frame
      activeSourceId = chunk.sourceId
    }
    return chunk
  })
  return { chunks, activeChunkFrame, activeSourceId }
}

/**
 * Returns the time chunks that should be loaded for a viewed time range
 * @param activeStart   active time range start (timebar selection)
 * @param activeEnd     active time range end (timebar selection)
 * @param datasetStart  start of available data for this dataset
 * @param datasetEnd    end of available data for this dataset
 */
export const getActiveTimeChunks = (
  baseId: string,
  activeStart: string,
  activeEnd: string,
  datasetStart: string,
  datasetEnd: string,
  interval: Interval
): TimeChunks => {
  const deltaMs = +toDT(activeEnd) - +toDT(activeStart)

  const finalIntervalConfig = CONFIG_BY_INTERVAL[interval]
  const visibleStartFrameRaw = finalIntervalConfig.getRawFrame(+toDT(activeStart))
  const visibleStartFrame = getVisibleStartFrame(visibleStartFrameRaw)
  const visibleEndFrameRaw = finalIntervalConfig.getRawFrame(+toDT(activeEnd))
  const deltaInIntervalUnits = Math.round(visibleEndFrameRaw - visibleStartFrameRaw)
  const visibleEndFrame = visibleStartFrame + deltaInIntervalUnits

  const timeChunks: TimeChunks = {
    activeStart,
    activeEnd,
    chunks: [],
    delta: deltaMs,
    deltaInIntervalUnits,
    deltaInDays: Duration.fromMillis(deltaMs).as('days'),
    interval,
    activeChunkFrame: 0,
    activeSourceId: '',
    visibleStartFrame,
    visibleEndFrame,
  }

  // ignore any start/end time chunk calculation as for the 'month' interval the entire tileset is loaded
  if (timeChunks.interval === 'MONTH') {
    const frame = toQuantizedFrame(activeStart, 0, timeChunks.interval)
    const chunk: TimeChunk = {
      quantizeOffset: 0,
      id: 'heatmapchunk_month',
      frame,
      active: true,
    }
    chunk.sourceId = getSourceId(baseId, chunk)
    timeChunks.chunks = [chunk]
    timeChunks.activeSourceId = chunk.sourceId
    timeChunks.activeChunkFrame = frame
    return timeChunks
  } else if (timeChunks.interval === 'YEAR') {
    const frame = toQuantizedFrame(activeStart, 0, timeChunks.interval)
    const chunk: TimeChunk = {
      quantizeOffset: 0,
      id: 'heatmapchunk_year',
      frame,
      active: true,
    }
    chunk.sourceId = getSourceId(baseId, chunk)
    timeChunks.chunks = [chunk]
    timeChunks.activeSourceId = chunk.sourceId
    timeChunks.activeChunkFrame = frame
    return timeChunks
  }

  // calculate start and end taking some buffer into account to proactively load time chunks
  const bufferSize = deltaMs * TIME_CHUNK_BUFFER_RELATIVE_SIZE
  const bufferedActiveStart = +toDT(activeStart) - bufferSize
  const bufferedActiveEnd = +toDT(activeEnd) + bufferSize

  // case when view range is completely outside of dataset range - no chunks
  if (bufferedActiveEnd < +toDT(datasetStart) || bufferedActiveStart > +toDT(datasetEnd)) {
    return timeChunks
  }

  const chunkStarts = getChunkStarts(bufferedActiveStart, bufferedActiveEnd, timeChunks.interval)
  const { chunks, activeChunkFrame, activeSourceId } = getTimeChunks(
    baseId,
    chunkStarts,
    datasetStart,
    datasetEnd,
    timeChunks.interval,
    activeStart
  )
  timeChunks.chunks = chunks
  timeChunks.activeChunkFrame = activeChunkFrame
  timeChunks.activeSourceId = activeSourceId

  return timeChunks
}

const toQuantizedFrame = (date: string, quantizeOffset: number, interval: Interval) => {
  const config = CONFIG_BY_INTERVAL[interval]
  const ms = DateTime.fromISO(date, { zone: 'utc' }).toMillis()
  const frame = getVisibleStartFrame(config.getRawFrame(ms))
  return frame - quantizeOffset
}

export const frameToDate = (frame: number, quantizeOffset: number, interval: Interval) => {
  const offsetedFrame = frame + quantizeOffset
  const config = CONFIG_BY_INTERVAL[interval]
  return config.getDate(offsetedFrame) as Date
}

export const quantizeOffsetToDate = (quantizeOffset: number, interval: Interval) => {
  return frameToDate(0, quantizeOffset, interval)
}
