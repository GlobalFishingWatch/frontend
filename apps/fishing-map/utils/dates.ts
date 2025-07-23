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

export const getTimeAgo = (date: number | DateTime, t: TFunction) => {
  const now = DateTime.local()
  const past = typeof date === 'number' ? DateTime.fromMillis(date) : date
  const diff = now.diff(past, ['days', 'hours', 'minutes'])

  const days = Math.floor(diff.days)
  const hours = Math.floor(diff.hours)
  const minutes = Math.floor(diff.minutes)

  const translateWithPlural = (keyBase: string, count: number) =>
    t(`time.${keyBase}${count !== 1 ? '_plural' : ''}` as any, { count })

  if (days >= 30) {
    const months = Math.floor(days / 30)
    return t('time.ago', { time: translateWithPlural('months', months) })
  }
  if (days >= 7) {
    const weeks = Math.floor(days / 7)
    return t('time.ago', { time: translateWithPlural('weeks', weeks) })
  }
  if (days > 0) {
    return t('time.ago', { time: translateWithPlural('days', days) })
  }
  if (days === 0 && hours === 0 && minutes < 2) {
    return t('time.now')
  }
  if (hours === 0) {
    return t('time.ago', { time: translateWithPlural('minutes', minutes) })
  }
  if (minutes === 0) {
    return t('time.ago', { time: translateWithPlural('hours', hours) })
  }

  const timeStr = `${translateWithPlural('hours', hours)} ${translateWithPlural('minutes', minutes)}`
  return t('time.ago', { time: timeStr })
}

export const getDateLabel = (date: number, t: TFunction) => {
  return `${DateTime.fromMillis(date, { zone: 'utc' }).toLocaleString(
    DateTime.DATETIME_FULL
  )} (${getTimeAgo(DateTime.fromMillis(date, { zone: 'utc' }), t)})`
}
