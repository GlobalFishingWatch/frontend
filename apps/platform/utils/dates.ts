import type { TFunction } from 'i18next'
import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'

import type { Dataset, Report, VesselGroup } from '@globalfishingwatch/api-types'
import { LIMITS_BY_INTERVAL } from '@globalfishingwatch/deck-loaders/fourwings/helpers'

import { REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES } from 'data/map/config'
import type { AppWorkspace } from 'features/_map/workspaces-list/workspaces-list.slice'

export { getUTCDateTime } from '@globalfishingwatch/data-transforms/dates'

function getFlooredMinute(now: DateTime): number {
  const utcNow = now.toUTC()
  return (
    Math.floor(utcNow.minute / REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES) *
    REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES
  )
}

export function getRealTimeLatestAvailableDataDate(now: DateTime = DateTime.utc()): string {
  const utcNow = now.toUTC()
  return utcNow
    .set({ minute: getFlooredMinute(utcNow), second: 0, millisecond: 0 })
    .toISO() as string
}

export function getMsUntilNextRealTimeUpdate(now: DateTime = DateTime.utc()): number {
  const utcNow = now.toUTC()
  const nextBoundary = utcNow.set({
    minute: getFlooredMinute(utcNow) + REAL_TIME_DATA_UPDATE_INTERVAL_MINUTES,
    second: 0,
    millisecond: 0,
  })
  return nextBoundary.diff(utcNow).milliseconds
}

type UserCreatedEntities = Dataset | AppWorkspace | VesselGroup | Report

export const sortByCreationDate = <T>(entities: UserCreatedEntities[]): T[] => {
  if (!entities) return []
  return entities.sort((a, b) =>
    (a?.createdAt as string) < (b?.createdAt as string) ? 1 : -1
  ) as T[]
}

const TIME_AGO_UNITS = ['years', 'months', 'days', 'hours', 'minutes'] as const

export const getTimeAgo = (date: number | DateTime, t: TFunction) => {
  const now = DateTime.local()
  const past = typeof date === 'number' ? DateTime.fromMillis(date) : date
  const diff = now.diff(past, [...TIME_AGO_UNITS])

  for (const unit of TIME_AGO_UNITS) {
    const count = Math.floor(diff[unit])
    if (count >= 1) {
      return t((t) => t.time.ago, { time: t((t) => t.time[unit], { count }) })
    }
  }
  return t((t) => t.time.now)
}

export const getDateLabel = (date: number, t: TFunction) => {
  return `${DateTime.fromMillis(date, { zone: 'utc' }).toLocaleString(
    DateTime.DATETIME_FULL
  )} (${getTimeAgo(DateTime.fromMillis(date, { zone: 'utc' }), t)})`
}

export const isTimestampNumber = (value: number) => {
  // Consider timestamps from year 2000 (946684800000) to year 3000 (32503680000000)
  return value > 946684800000 && value < 32503680000000
}

export const pickDateFormatByRange = (start: string, end: string): DateTimeFormatOptions => {
  const A_DAY = 1000 * 60 * 60 * 24 * (LIMITS_BY_INTERVAL['HOUR']?.value || 3)
  const timeΔ = start && end ? new Date(end).getTime() - new Date(start).getTime() : 0
  return timeΔ <= A_DAY ? DateTime.DATETIME_MED : DateTime.DATE_MED
}
