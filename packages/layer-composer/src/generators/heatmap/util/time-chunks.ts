import { DateTime, Duration, Interval as LuxonInterval } from 'luxon'
import { DEFAULT_HEATMAP_INTERVALS } from '../config'
import { Interval } from '../types'
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

export const toDT = (dateISO: string) => DateTime.fromISO(dateISO).toUTC()

export const pickActiveTimeChunk = (timeChunks: TimeChunks) =>
  timeChunks.chunks.find((t) => t.active) || timeChunks.chunks[0]

// Buffer size relative to active time delta
const TIME_CHUNK_BUFFER_RELATIVE_SIZE = 0.2

const getVisibleStartFrame = (rawFrame: number) => {
  return Math.floor(rawFrame)
}

export const CONFIG_BY_INTERVAL: Record<Interval, Record<string, any>> = {
  hour: {
    isValid: (duration: Duration): boolean => {
      return duration.as('days') < 5
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      const TWENTY_DAYS_MS = 1000 * 60 * 60 * 24 * 20
      const time = TWENTY_DAYS_MS * Math.floor(bufferedActiveStart / TWENTY_DAYS_MS)
      return DateTime.fromMillis(time).toUTC()
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ days: 20 })
    },
    getChunkDataEnd: (chunkViewEnd: DateTime): DateTime => {
      return chunkViewEnd.plus({ days: 5 })
    },
    // We will substract every timestamp with a quantize offset to end up with shorter arrays indexes
    getRawFrame: (start: number) => {
      return start / 1000 / 60 / 60
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60)
    },
  },
  day: {
    isValid: (duration: Duration): boolean => {
      return duration.as('days') < 100
    },
    getFirstChunkStart: (bufferedActiveStart: number): DateTime => {
      // tileset should start at current year
      return DateTime.fromMillis(bufferedActiveStart).toUTC().startOf('year')
    },
    getChunkViewEnd: (chunkStart: DateTime): DateTime => {
      return chunkStart.plus({ years: 1 })
    },
    getChunkDataEnd: (chunkViewEnd: DateTime): DateTime => {
      return chunkViewEnd.plus({ days: 100 })
    },
    getRawFrame: (start: number) => {
      return start / 1000 / 60 / 60 / 24
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60 * 24)
    },
  },
  '10days': {
    getRawFrame: (start: number) => {
      return start / 1000 / 60 / 60 / 24 / 10
    },
    getDate: (frame: number) => {
      return new Date(frame * 1000 * 60 * 60 * 24 * 10)
    },
  },
  month: {
    getRawFrame: (start: number) => {
      return LuxonInterval.fromDateTimes(
        DateTime.fromMillis(0).toUTC(),
        DateTime.fromMillis(start).toUTC()
      ).toDuration('month').months
    },
    getDate: (frame: number) => {
      const year = 1970 + Math.floor(frame / 12)
      const month = frame % 12
      return new Date(Date.UTC(year, month, 1))
    },
  },
}

/**
 * Returns the type of interval for a given delta in ms
 * @param delta delta in ms
 */
const getInterval = (
  deltaMs: number,
  supportedIntervals: Interval[] = DEFAULT_HEATMAP_INTERVALS
): Interval => {
  const duration = Duration.fromMillis(deltaMs)
  if (
    CONFIG_BY_INTERVAL.day.isValid(duration) &&
    (supportedIntervals.includes('day') || supportedIntervals.includes('hour'))
  ) {
    if (CONFIG_BY_INTERVAL.hour.isValid(duration) && supportedIntervals.includes('hour')) {
      return 'hour'
    }
    return 'day'
  }
  // If interval is not valid on hour or day, fallback on biggest interval (assumed to be last item of supportedIntervals)
  // Should be 10days, or day in the case of TimeCompare mode
  return supportedIntervals[supportedIntervals.length - 1]
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
    if (+nextChunkStart > bufferedActiveEnd) {
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
  const chunks: TimeChunk[] = chunkStarts.map((chunkStart) => {
    // end of *usable* tileset is end of year
    // end of *loaded* tileset is end of year + 100 days
    const chunkViewEnd = config.getChunkViewEnd(chunkStart)
    let chunkDataEnd = config.getChunkDataEnd(chunkViewEnd)
    // use dataset start if chunk starts before dataset
    if (+chunkStart < +toDT(datasetStart)) chunkStart = toDT(datasetStart)
    // use dataset end if chunk ends after dataset
    if (+chunkDataEnd > +toDT(datasetEnd)) chunkDataEnd = toDT(datasetEnd)
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
  interval?: Interval | Interval[]
): TimeChunks => {
  const deltaMs = +toDT(activeEnd) - +toDT(activeStart)

  const finalInterval: Interval =
    !interval || Array.isArray(interval) ? getInterval(deltaMs, interval) : (interval as Interval)

  const finalIntervalConfig = CONFIG_BY_INTERVAL[finalInterval]
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
    interval: finalInterval,
    activeChunkFrame: 0,
    activeSourceId: '',
    visibleStartFrame,
    visibleEndFrame,
  }

  // ignore any start/end time chunk calculation as for the '10 days' interval the entire tileset is loaded
  if (timeChunks.interval === '10days') {
    const frame = toQuantizedFrame(activeStart, 0, timeChunks.interval)
    const chunk: TimeChunk = {
      quantizeOffset: 0,
      id: 'heatmapchunk_10days',
      frame,
      active: true,
    }
    chunk.sourceId = getSourceId(baseId, chunk)
    timeChunks.chunks = [chunk]
    timeChunks.activeSourceId = chunk.sourceId
    timeChunks.activeChunkFrame = frame
    return timeChunks
  } else if (timeChunks.interval === 'month') {
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
  // TODO Use Luxon to use UTC!!!!
  const ms = new Date(date).getTime()
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
