import type { DateTimeUnit } from 'luxon'
import { DateTime } from 'luxon'

import { getUTCDate } from '@globalfishingwatch/data-transforms'

import { getDefaultFormat } from './internal-utils'

export const getHumanizedDates = (start: string, end: string, locale: string) => {
  const format = getDefaultFormat(start, end)
  const mStart = DateTime.fromISO(start, { zone: 'utc' }).setLocale(locale)
  const mEnd = DateTime.fromISO(end, { zone: 'utc' }).setLocale(locale)
  const humanizedStart = mStart.toFormat(format)
  const humanizedEnd = mEnd.toFormat(format)
  const interval = mEnd.diff(mStart, 'day').days
  return { humanizedStart, humanizedEnd, interval }
}

export const getLastX = (num: number, unit: DateTimeUnit, latestAvailableDataDate?: string) => {
  const latestAvailableDataDateUTC = DateTime.fromISO(
    latestAvailableDataDate ? latestAvailableDataDate : getUTCDate().toISOString(),
    { zone: 'utc' }
  )
  return {
    start: latestAvailableDataDateUTC.minus({ [unit]: num }).toISO(),
    end: latestAvailableDataDateUTC.toISO(),
  }
}

export const getLast30Days = (latestAvailableDataDate: string) => {
  return getLastX(30, 'day', latestAvailableDataDate)
}
