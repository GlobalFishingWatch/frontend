import dayjs, { ManipulateType } from 'dayjs'
import { getDefaultFormat } from './internal-utils'

export const getHumanizedDates = (start: string, end: string) => {
  const format = getDefaultFormat(start, end)
  const mStart = dayjs(start).utc()
  const mEnd = dayjs(end).utc()
  const humanizedStart = mStart.format(format)
  const humanizedEnd = mEnd.format(format)
  const interval = mEnd.diff(mStart, 'day')
  return { humanizedStart, humanizedEnd, interval }
}

export const getLastX = (num: number, unit: ManipulateType, latestAvailableDataDate?: string) => {
  const latestAvailableDataDateUTC = dayjs(
    latestAvailableDataDate ? new Date(latestAvailableDataDate) : new Date()
  ).utc()
  return {
    start: latestAvailableDataDateUTC.subtract(num, unit).toISOString(),
    end: latestAvailableDataDateUTC.toISOString(),
  }
}

export const getLast30Days = (latestAvailableDataDate: string) => {
  return getLastX(30, 'day', latestAvailableDataDate)
}
