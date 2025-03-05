import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

import { DEFAULT_DATE_FORMAT, DEFAULT_FULL_DATE_FORMAT } from '../constants'

export const getTime = (dateISO: string) => getUTCDate(dateISO).getTime()

export const clampToAbsoluteBoundaries = (
  start: string,
  end: string,
  desiredDeltaMs: number,
  absoluteStart: string,
  absoluteEnd: string
) => {
  const startMs = getTime(start)
  const endMs = getTime(end)
  const absoluteStartMs = getTime(absoluteStart)
  const absoluteEndMs = getTime(absoluteEnd)
  let newStartClamped = start
  let newEndClamped = end
  let clamped

  // newStart is before absolute start: use abs start as new start and keep the existing duration to get to new end
  if (startMs < absoluteStartMs) {
    newStartClamped = absoluteStart
    newEndClamped = getUTCDate(absoluteStartMs + desiredDeltaMs).toISOString()
    clamped = 'start'
    // newEnd is after absolute end: use abs end as new end and keep the existing duration to get back to new start
  } else if (endMs > absoluteEndMs) {
    newEndClamped = absoluteEnd
    newStartClamped = getUTCDate(absoluteEndMs - desiredDeltaMs).toISOString()
    clamped = 'end'
  }
  return { newStartClamped, newEndClamped, clamped }
}

export const getDeltaMs = (start: string, end: string) => getTime(end) - getTime(start)
export const getDeltaDays = (start: string, end: string) =>
  getDeltaMs(start, end) / 1000 / 60 / 60 / 24
export const isMoreThanADay = (start: string, end: string) => getDeltaDays(start, end) > 1
export const getDefaultFormat = (start: string, end: string) =>
  isMoreThanADay(start, end) ? DEFAULT_DATE_FORMAT : DEFAULT_FULL_DATE_FORMAT

export const stickToClosestUnit = (date: string, unit: DateTimeUnit) => {
  const mDate = DateTime.fromISO(date, { zone: 'utc' })
  const mStartOf = mDate.startOf(unit)
  const mEndOf = mDate.endOf(unit).plus({ millisecond: 1 })
  const startDeltaMs = getTime(date) - mStartOf.valueOf()
  const endDeltaMs = mEndOf.valueOf() - getTime(date)
  const mClosest = startDeltaMs > endDeltaMs ? mEndOf : mStartOf
  return mClosest.toISO()
}
