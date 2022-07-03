import { DateTime, DurationUnits } from 'luxon'

export const getTimeRangeDuration = (
  timeRange: { start: string; end: string },
  unit: DurationUnits = 'years'
) => {
  if (timeRange && timeRange.start && timeRange.start) {
    const startDateTime = DateTime.fromISO(timeRange.start)
    const endDateTime = DateTime.fromISO(timeRange.end)
    return endDateTime.diff(startDateTime, unit)
  }
}
