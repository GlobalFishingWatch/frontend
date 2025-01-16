import intersection from 'lodash/intersection'
import { DateTime, Duration } from 'luxon'

import type { FourwingsInterval } from '../lib/types'

export const FOURWINGS_INTERVALS_ORDER: FourwingsInterval[] = ['HOUR', 'DAY', 'MONTH', 'YEAR']
export const TIME_COMPARISON_NOT_SUPPORTED_INTERVALS: FourwingsInterval[] = ['MONTH', 'YEAR']

export const LIMITS_BY_INTERVAL: Record<
  FourwingsInterval,
  { unit: 'days' | 'months' | 'year'; value: number; buffer: number } | undefined
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

export const getFourwingsInterval = (
  start: number | string,
  end: number | string,
  availableIntervals = FOURWINGS_INTERVALS_ORDER
): FourwingsInterval => {
  if (!start || !end) {
    return availableIntervals[0]
  }
  const startMillis = typeof start === 'string' ? DateTime.fromISO(start).toMillis() : start
  const endMillis = typeof end === 'string' ? DateTime.fromISO(end).toMillis() : end

  if (!startMillis && !endMillis) {
    return availableIntervals[0]
  }
  const duration = Duration.fromMillis(endMillis - startMillis)
  const validIntervals = Object.entries(LIMITS_BY_INTERVAL).flatMap(([interval, limits]) => {
    if (!availableIntervals.includes(interval as FourwingsInterval)) return []
    if (!limits) return interval as FourwingsInterval
    return Math.round(duration.as(limits.unit)) <= limits.value
      ? (interval as FourwingsInterval)
      : []
  })
  if (validIntervals.length) {
    return validIntervals[0]
  }
  const sortedIntervals = intersection(
    FOURWINGS_INTERVALS_ORDER,
    availableIntervals
  ) as FourwingsInterval[]
  return sortedIntervals[sortedIntervals.length - 1]
}

export const CONFIG_BY_INTERVAL: Record<
  FourwingsInterval,
  {
    getIntervalTimestamp: (frame: number) => number
    getIntervalFrame: (timestamp: number) => number
  }
> = {
  HOUR: {
    getIntervalTimestamp: (frame: number) => {
      return frame * 1000 * 60 * 60
    },
    getIntervalFrame: (timestamp: number) => {
      return timestamp / (1000 * 60 * 60)
    },
  },
  DAY: {
    getIntervalTimestamp: (frame: number) => {
      return frame * 1000 * 60 * 60 * 24
    },
    getIntervalFrame: (timestamp: number) => {
      return timestamp / (1000 * 60 * 60 * 24)
    },
  },
  MONTH: {
    getIntervalTimestamp: (frame: number) => {
      const year = Math.floor(frame / 12)
      const month = frame % 12
      return Date.UTC(year, month)
    },
    getIntervalFrame: (timestamp: number) => {
      const date = new Date(timestamp)
      return date.getUTCFullYear() * 12 + date.getUTCMonth()
    },
  },
  YEAR: {
    getIntervalTimestamp: (frame: number) => {
      return Date.UTC(frame)
    },
    getIntervalFrame: (timestamp: number) => {
      const date = new Date(timestamp)
      return date.getUTCFullYear()
    },
  },
}

export const getTimeRangeKey = (start: number, end: number) => {
  return `${start}-${end}`
}
