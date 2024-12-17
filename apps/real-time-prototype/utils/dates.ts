import type { DurationUnits } from 'luxon';
import { DateTime } from 'luxon'

export const getUTCDateTime = (d: string | number) =>
  typeof d === 'string'
    ? DateTime.fromISO(d, { zone: 'utc' })
    : DateTime.fromMillis(d, { zone: 'utc' })

export const getTimeRangeDuration = (
  timeRange: { start: string; end: string },
  unit: DurationUnits = 'years'
) => {
  if (timeRange && timeRange.start && timeRange.start) {
    const startDateTime = getUTCDateTime(timeRange.start)
    const endDateTime = getUTCDateTime(timeRange.end)
    return endDateTime.diff(startDateTime, unit)
  }
}

export const getTimeAgo = (date: number | DateTime) => {
  const now = DateTime.local()
  const past = typeof date === 'number' ? DateTime.fromMillis(date) : date
  const diff = now.diff(past, ['days', 'hours', 'minutes'])

  if (Math.floor(diff.days) > 0) return `${Math.floor(diff.days)}d ${Math.floor(diff.hours)}h ago`
  if (Math.floor(diff.hours) === 0) return `${Math.floor(diff.minutes)}m ago`
  if (Math.floor(diff.minutes) === 0) return `${Math.floor(diff.hours)}h ago`
  return `${Math.floor(diff.hours)}h ${Math.floor(diff.minutes)}m ago`
}

export const getDateLabel = (date: number) => {
  return `${DateTime.fromMillis(date, { zone: 'utc' }).toLocaleString(
    DateTime.DATETIME_FULL
  )} (${getTimeAgo(DateTime.fromMillis(date, { zone: 'utc' }))})`
}
