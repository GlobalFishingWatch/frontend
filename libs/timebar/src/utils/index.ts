import { DateTime, DateTimeUnit } from 'luxon'
import { getDefaultFormat } from './internal-utils'

export const getHumanizedDates = (start: string, end: string) => {
  const format = getDefaultFormat(start, end)
  const mStart = DateTime.fromISO(start, { zone: 'utc' })
  const mEnd = DateTime.fromISO(end, { zone: 'utc' })
  const humanizedStart = mStart.toFormat(format)
  const humanizedEnd = mEnd.toFormat(format)
  const interval = mEnd.diff(mStart, 'day').days
  return { humanizedStart, humanizedEnd, interval }
}

export const getLastX = (num: number, unit: DateTimeUnit, latestAvailableDataDate?: string) => {
  const latestAvailableDataDateUTC = DateTime.fromISO(
    latestAvailableDataDate ? latestAvailableDataDate : new Date().toISOString(),
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
