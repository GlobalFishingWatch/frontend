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
