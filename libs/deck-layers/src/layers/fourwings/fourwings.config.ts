import { DateTime, DateTimeUnit, Duration, DurationLikeObject } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { getUTCDateTime } from '../../utils/dates'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')

export const HEATMAP_ID = 'heatmap'
export const POSITIONS_ID = 'positions'

export const CHUNKS_BY_INTERVAL: Record<
  Interval,
  { unit: DateTimeUnit; value: number } | undefined
> = {
  HOUR: {
    unit: 'day',
    value: 20,
  },
  DAY: {
    unit: 'year',
    value: 1,
  },
  MONTH: undefined,
  YEAR: undefined,
}

export const LIMITS_BY_INTERVAL: Record<
  Interval,
  { unit: keyof DurationLikeObject; value: number; buffer: number } | undefined
> = {
  HOUR: {
    unit: 'days',
    value: 3,
    buffer: 1,
  },
  DAY: {
    unit: 'months',
    value: 6,
    buffer: 1,
  },
  MONTH: {
    unit: 'year',
    value: 6,
    buffer: 1,
  },
  YEAR: undefined,
}

export const getInterval = (start: number, end: number): Interval => {
  const duration = Duration.fromMillis(end - start)
  const validIntervals = Object.entries(LIMITS_BY_INTERVAL).flatMap(([interval, limits]) => {
    if (!limits) return interval as Interval
    return Math.round(duration.as(limits.unit)) <= limits.value ? (interval as Interval) : []
  })
  return validIntervals[0]
}

export const getDateInIntervalResolution = (date: number, interval: Interval): number => {
  return DateTime.fromMillis(date)
    .startOf(interval as any)
    .toMillis()
}

export const getDatesInIntervalResolution = (
  start: number,
  end: number
): { start: number; end: number } => {
  const interval = getInterval(start, end)
  return {
    start: getDateInIntervalResolution(start, interval),
    end: getDateInIntervalResolution(end, interval),
  }
}

export type Chunk = {
  id: string
  interval: Interval
  start: number
  end: number
}

export const CHUNKS_BUFFER = 1
// TODO: validate if worth to make this dynamic for the playback
export const getChunksByInterval = (start: number, end: number, interval: Interval): Chunk[] => {
  const intervalUnit = LIMITS_BY_INTERVAL[interval]?.unit
  if (!intervalUnit) {
    return [{ id: 'full-time-range', interval, start, end }]
  }
  const bufferedStartDate = getUTCDateTime(start)
    .startOf(intervalUnit as any)
    .minus({ [intervalUnit]: CHUNKS_BUFFER })
  const bufferedEndDate = getUTCDateTime(end)
    .endOf(intervalUnit as any)
    .plus({ [intervalUnit]: CHUNKS_BUFFER, millisecond: 1 })
  const dataNew = [
    {
      id: `${intervalUnit}-chunk`,
      interval,
      start: bufferedStartDate.toMillis(),
      end: bufferedEndDate.toMillis(),
      startISO: bufferedStartDate.toISO(),
      endISO: bufferedEndDate.toISO(),
    },
  ]
  return dataNew
}

export const getChunkBuffer = (interval: Interval) => {
  const { buffer, unit } = LIMITS_BY_INTERVAL[interval] || {}
  if (!unit) {
    return 0
  }
  return Duration.fromObject({ [unit]: buffer }).toMillis()
}

// TODO use the existing class function instead of repeating the logic
export const getChunks = (minFrame: number, maxFrame: number) => {
  const interval = getInterval(minFrame, maxFrame)
  const chunks = getChunksByInterval(minFrame, maxFrame, interval)
  return chunks
}
