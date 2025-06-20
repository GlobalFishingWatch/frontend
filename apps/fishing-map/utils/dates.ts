import type { TFunction } from 'i18next'
import { DateTime, Duration } from 'luxon'

import type { Dataset, Report, VesselGroup } from '@globalfishingwatch/api-types'

import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'

export { getUTCDateTime } from '@globalfishingwatch/data-transforms'

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

export const getTimeAgo = (date: number | DateTime) => {
  const now = DateTime.local()
  const past = typeof date === 'number' ? DateTime.fromMillis(date) : date
  const diff = now.diff(past, ['days', 'hours', 'minutes'])

  const days = Math.floor(diff.days)
  const hours = Math.floor(diff.hours)
  const minutes = Math.floor(diff.minutes)

  if (days >= 30) {
    const months = Math.floor(days / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }
  if (days >= 7) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (days === 0 && hours === 0 && minutes < 2) return 'now'
  if (hours === 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''} ago`
}

export const getDateLabel = (date: number) => {
  return `${DateTime.fromMillis(date, { zone: 'utc' }).toLocaleString(
    DateTime.DATETIME_FULL
  )} (${getTimeAgo(DateTime.fromMillis(date, { zone: 'utc' }))})`
}
