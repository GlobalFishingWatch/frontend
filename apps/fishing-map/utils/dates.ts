import type { TFunction } from 'i18next'
import { Duration } from 'luxon'

import type { Dataset, Report, VesselGroup } from '@globalfishingwatch/api-types'

import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'

export { getUTCDateTime, formatDateForInterval } from '@globalfishingwatch/data-transforms'

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
