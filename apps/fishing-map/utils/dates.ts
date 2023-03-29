import { DateTime, DurationUnits } from 'luxon'
import { Interval } from '@globalfishingwatch/layer-composer'
import { Dataset, VesselGroup } from '@globalfishingwatch/api-types'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'

export const getUTCDateTime = (d: string | number) => {
  if (!d || (typeof d !== 'string' && typeof d !== 'number')) {
    console.warn('Not a valid date', d)
    return
  }
  return typeof d === 'string'
    ? DateTime.fromISO(d, { zone: 'utc' })
    : DateTime.fromMillis(d, { zone: 'utc' })
}

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

export const formatDateForInterval = (date: DateTime, timeChunkInterval: Interval) => {
  let formattedTick = ''
  switch (timeChunkInterval) {
    case 'year':
      formattedTick = date.year.toString()
      break
    case 'month':
      formattedTick = date.toFormat('LLL y')
      break
    case 'hour':
      formattedTick = date.toLocaleString(DateTime.DATETIME_MED)
      break
    default:
      formattedTick = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
  }
  return formattedTick
}

type UserCreatedEntities = Dataset | AppWorkspace | VesselGroup

export const sortByCreationDate = <T>(entities: UserCreatedEntities[]): T[] => {
  if (!entities) return []
  return entities.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) as T[]
}
