import { DateTime, DurationUnits } from 'luxon'

export const getTimeRangeDuration = (
  { start, end }: { start: string; end: string },
  unit: DurationUnits = 'years'
) => {
  if (start && end) {
    const startDateTime = DateTime.fromISO(start)
    const endDateTime = DateTime.fromISO(end)
    return endDateTime.diff(startDateTime, unit)
  }
}
