import { DateTime, Duration } from 'luxon'
import type { TFunction } from 'i18next'
import type { Dataset, Report, VesselGroup } from '@globalfishingwatch/api-types'
import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'

export type SupportedDateType = string | number
export const getUTCDateTime = (d: SupportedDateType) => {
  if (!d || (typeof d !== 'string' && typeof d !== 'number' && typeof d !== 'object')) {
    console.warn('Not a valid date', typeof d, d)
    return DateTime.utc()
  }
  if (typeof d === 'object') {
    try {
      return DateTime.fromJSDate(d, { zone: 'utc' })
    } catch (error) {
      console.warn('Not a valid date', typeof d, d)
      return DateTime.utc()
    }
  }
  if (typeof d === 'string') {
    return DateTime.fromISO(d, { zone: 'utc' })
  }
  return DateTime.fromMillis(d, { zone: 'utc' })
}

export const formatDateForInterval = (date: DateTime, timeChunkInterval: FourwingsInterval) => {
  let formattedTick = ''
  switch (timeChunkInterval) {
    case 'YEAR':
      formattedTick = date.year.toString()
      break
    case 'MONTH':
      formattedTick = date.toFormat('LLL y')
      break
    case 'HOUR':
      formattedTick = date.toLocaleString(DateTime.DATETIME_MED)
      break
    default:
      formattedTick = date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
      break
  }
  return formattedTick
}

type UserCreatedEntities = Dataset | AppWorkspace | VesselGroup | Report

export const sortByCreationDate = <T>(entities: UserCreatedEntities[]): T[] => {
  if (!entities) return []
  return entities.sort((a, b) =>
    (a?.createdAt as string) < (b?.createdAt as string) ? 1 : -1
  ) as T[]
}

export const getDurationLabel = (seconds: number, t: TFunction) => {
  if (!seconds) return ''

  const duration = Duration.fromMillis(seconds * 1000)
  const days = Math.floor(duration.as('days'))
  const hours = Math.floor(duration.as('hours')) - days * 24
  const minutes = Math.floor(duration.as('minutes') - hours * 60)

  if (days > 0)
    return `${t('event.dayAbbreviated', { count: days })} ${t('event.hourAbbreviated', {
      count: hours,
    })}`
  if (hours === 0)
    return t('event.minuteAbbreviated', {
      count: minutes,
    })
  if (hours <= 2)
    return `${t('event.hourAbbreviated', {
      count: hours,
    })} ${t('event.minuteAbbreviated', {
      count: minutes,
    })}`
  return t('event.hourAbbreviated', {
    count: hours,
  })
}
