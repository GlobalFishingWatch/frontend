import dayjs from 'dayjs'
import { DEFAULT_DATE_FORMAT, DEFAULT_FULL_DATE_FORMAT } from '../constants'

export const getTime = (dateISO) => new Date(dateISO).getTime()

export const clampToAbsoluteBoundaries = (
  start,
  end,
  desiredDeltaMs,
  absoluteStart,
  absoluteEnd
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
    newEndClamped = new Date(absoluteStartMs + desiredDeltaMs).toISOString()
    clamped = 'start'
    // newEnd is after absolute end: use abs end as new end and keep the existing duration to get back to new start
  } else if (endMs > absoluteEndMs) {
    newEndClamped = absoluteEnd
    newStartClamped = new Date(absoluteEndMs - desiredDeltaMs).toISOString()
    clamped = 'end'
  }
  return { newStartClamped, newEndClamped, clamped }
}

export const getDeltaMs = (start, end) => getTime(end) - getTime(start)
export const getDeltaDays = (start, end) => getDeltaMs(start, end) / 1000 / 60 / 60 / 24
export const isMoreThanADay = (start, end) => getDeltaDays(start, end) > 1
export const getDefaultFormat = (start, end) =>
  isMoreThanADay(start, end) ? DEFAULT_DATE_FORMAT : DEFAULT_FULL_DATE_FORMAT

export const stickToClosestUnit = (date, unit) => {
  const mDate = dayjs(date).utc()
  const mStartOf = mDate.startOf(unit)
  const mEndOf = mDate.endOf(unit)
  const startDeltaMs = getTime(date) - mStartOf.valueOf()
  const endDeltaMs = mEndOf.valueOf() - getTime(date)
  const mClosest = startDeltaMs > endDeltaMs ? mEndOf : mStartOf
  return mClosest.toISOString()
}
