import { DateTime, DateTimeUnit, Duration, DurationLikeObject } from 'luxon'
import { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getUTCDateTime } from '../../utils/dates'
import { Chunk } from './fourwings.types'

export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')

export const HEATMAP_ID = 'heatmap'
export const POSITIONS_ID = 'positions'

export const FOURWINGS_MAX_ZOOM = 12
export const POSITIONS_VISUALIZATION_MIN_ZOOM = 9

export const DEFAULT_FOURWINGS_INTERVALS: FourwingsInterval[] = ['HOUR', 'DAY', 'MONTH', 'YEAR']

export const CHUNKS_BY_INTERVAL: Record<
  FourwingsInterval,
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
  FourwingsInterval,
  { unit: keyof DurationLikeObject; value: number; buffer: number } | undefined
> = {
  HOUR: {
    unit: 'days',
    value: 3,
    buffer: 1,
  },
  DAY: {
    unit: 'months',
    value: 3,
    buffer: 1,
  },
  MONTH: {
    unit: 'year',
    value: 3,
    buffer: 1,
  },
  YEAR: undefined,
}

export const getInterval = (start: number, end: number): FourwingsInterval => {
  const duration = Duration.fromMillis(end - start)
  const validIntervals = Object.entries(LIMITS_BY_INTERVAL).flatMap(([interval, limits]) => {
    if (!limits) return interval as FourwingsInterval
    return Math.round(duration.as(limits.unit)) <= limits.value
      ? (interval as FourwingsInterval)
      : []
  })
  return validIntervals[0]
}

export const getDateInIntervalResolution = (date: number, interval: FourwingsInterval): number => {
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

export const CHUNKS_BUFFER = 1
// TODO: validate if worth to make this dynamic for the playback
export const getChunkByInterval = (
  start: number,
  end: number,
  interval: FourwingsInterval
): Chunk => {
  const intervalUnit = LIMITS_BY_INTERVAL[interval]?.unit
  if (!intervalUnit) {
    return { id: 'full-time-range', interval, start, end, bufferedStart: start, bufferedEnd: end }
  }
  const startDate = getUTCDateTime(start)
    .startOf(intervalUnit as any)
    .minus({ [intervalUnit]: CHUNKS_BUFFER })
  const bufferedStartDate = startDate.minus({ [intervalUnit]: CHUNKS_BUFFER })
  const now = DateTime.now().toUTC().startOf('day')
  const endDate = getUTCDateTime(end)
    .endOf(intervalUnit as any)
    .plus({ [intervalUnit]: CHUNKS_BUFFER, millisecond: 1 })
  const bufferedEndDate = endDate.plus({ [intervalUnit]: CHUNKS_BUFFER })
  return {
    id: `${intervalUnit}-chunk`,
    interval,
    start: startDate.toMillis(),
    end: Math.min(endDate.toMillis(), now.toMillis()),
    bufferedStart: bufferedStartDate.toMillis(),
    bufferedEnd: Math.min(bufferedEndDate.toMillis(), now.toMillis()),
  }
}

export const getChunkBuffer = (interval: FourwingsInterval) => {
  const { buffer, unit } = LIMITS_BY_INTERVAL[interval] || {}
  if (!unit) {
    return 0
  }
  return Duration.fromObject({ [unit]: buffer }).toMillis()
}
