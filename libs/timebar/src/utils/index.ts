import { scaleLinear } from 'd3-scale'
import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import { getUTCDate, getUTCDateTime } from '@globalfishingwatch/data-transforms'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { getFourwingsInterval } from '@globalfishingwatch/deck-loaders'

import { clampToAbsoluteBoundaries, getDefaultFormat } from './internal-utils'

export const getHumanizedDates = (start: string, end: string, locale: string) => {
  const format = getDefaultFormat(start, end)
  const mStart = DateTime.fromISO(start, { zone: 'utc' }).setLocale(locale)
  const mEnd = DateTime.fromISO(end, { zone: 'utc' }).setLocale(locale)
  const humanizedStart = mStart.toFormat(format)
  const humanizedEnd = mEnd.toFormat(format)
  const interval = mEnd.diff(mStart, 'day').days
  return { humanizedStart, humanizedEnd, interval }
}

export const getLastX = (num: number, unit: DateTimeUnit, latestAvailableDataDate?: string) => {
  const latestAvailableDataDateUTC = DateTime.fromISO(
    latestAvailableDataDate ? latestAvailableDataDate : getUTCDate().toISOString(),
    { zone: 'utc' }
  )
  return {
    start: latestAvailableDataDateUTC.minus({ [unit]: num }).toISO(),
    end: latestAvailableDataDateUTC.toISO(),
  }
}

export const getLast30Days = (latestAvailableDataDate: string) => {
  return getLastX(30, 'day', latestAvailableDataDate)
}

const BASE_STEP = 0.001
export const MS_IN_INTERVAL = {
  HOUR: 1000 * 60 * 60,
  DAY: 1000 * 60 * 60 * 24,
  YEAR: 1000 * 60 * 60 * 24 * 365,
}

type GetStepProps = {
  start: string
  end: string
  absoluteStart: string
  deltaMultiplicator: number
  intervals?: FourwingsInterval[]
  getCurrentInterval?: typeof getFourwingsInterval
  byIntervals?: boolean
  speedStep?: number
}

export const getStep = (start: string, end: string, speedStep = 0) => {
  const baseStepWithSpeed = BASE_STEP * speedStep
  const startMs = getUTCDate(start).getTime()
  const endMs = getUTCDate(end).getTime()

  const scale = scaleLinear().range([0, 1]).domain([startMs, endMs])
  const step = scale.invert(baseStepWithSpeed) - startMs
  return step
}

export const getTimebarStepByDelta = ({
  start,
  end,
  absoluteStart,
  intervals,
  getCurrentInterval = getFourwingsInterval,
  deltaMultiplicator,
  byIntervals = true,
  speedStep = 0,
}: GetStepProps) => {
  if (!start || !end) {
    return {
      newStart: start,
      newEnd: end,
      clamped: 'none',
    }
  }

  let newStartMs
  let newEndMs
  const interval = getCurrentInterval(start, end, intervals)
  if (byIntervals) {
    const intervalStartMs =
      interval === 'MONTH'
        ? DateTime.fromISO(start, { zone: 'utc' }).daysInMonth! * MS_IN_INTERVAL.DAY
        : MS_IN_INTERVAL[interval]
    const intervalEndMs =
      interval === 'MONTH'
        ? DateTime.fromISO(end, { zone: 'utc' }).daysInMonth! * MS_IN_INTERVAL.DAY
        : MS_IN_INTERVAL[interval]
    newStartMs = getUTCDate(start).getTime() + intervalStartMs * deltaMultiplicator
    newEndMs = getUTCDate(end).getTime() + intervalEndMs * deltaMultiplicator
  } else {
    const deltaMs = getStep(start, end, speedStep) * deltaMultiplicator
    newStartMs = getUTCDate(start).getTime() + deltaMs
    newEndMs = getUTCDate(end).getTime() + deltaMs
  }
  const currentStartEndDeltaMs = newEndMs - newStartMs
  const playbackAbsoluteEnd = getUTCDateTime(Date.now())
    .endOf(interval.toLowerCase() as DateTimeUnit)
    .toISO()
  const { newStartClamped, newEndClamped, clamped } = clampToAbsoluteBoundaries(
    getUTCDate(newStartMs).toISOString(),
    getUTCDate(newEndMs).toISOString(),
    currentStartEndDeltaMs,
    absoluteStart,
    playbackAbsoluteEnd!
  )

  return {
    start: newStartClamped,
    end: newEndClamped,
    clamped,
  }
}

export const getPreviousStep = (params: GetStepProps) => {
  return getTimebarStepByDelta({
    ...params,
    deltaMultiplicator: -1,
  })
}

export const getNextStep = (params: GetStepProps) => {
  return getTimebarStepByDelta({
    ...params,
    deltaMultiplicator: 1,
  })
}
