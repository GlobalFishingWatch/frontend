import toNumber from 'lodash/toNumber'
import type { DateTimeOptions } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

type DateTimeParseFunction = { (timestamp: string, opts: DateTimeOptions | undefined): DateTime }

export const getUTCDate = (timestamp: string | number = Date.now()) => {
  // it could receive a timestamp as a string
  const millis = toNumber(timestamp)
  if (typeof timestamp === 'number' || !isNaN(millis))
    return DateTime.fromMillis(millis, { zone: 'UTC' }).toJSDate()

  const tryParseMethods: DateTimeParseFunction[] = [
    DateTime.fromISO,
    DateTime.fromSQL,
    DateTime.fromRFC2822,
  ]
  let result
  for (let index = 0; index < tryParseMethods.length; index++) {
    const parse = tryParseMethods[index]
    try {
      result = parse(timestamp, { zone: 'UTC' })
      if (result.isValid) {
        return result.toJSDate()
      }
    } catch (e) {
      return new Date('Invalid Date')
    }
  }
  return new Date('Invalid Date')
}

export type SupportedDateType = string | number | Date
export const getUTCDateTime = (d: SupportedDateType): DateTime => {
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
  if (typeof d === 'number') {
    const millis = toNumber(d)
    if (isNaN(millis)) {
      console.warn('Not a valid date', typeof d, d)
      return DateTime.utc()
    }
    return DateTime.fromMillis(millis, { zone: 'UTC' })
  }
  const tryParseMethods: DateTimeParseFunction[] = [
    DateTime.fromISO,
    DateTime.fromSQL,
    DateTime.fromRFC2822,
  ]
  let result
  for (let index = 0; index < tryParseMethods.length; index++) {
    const parse = tryParseMethods[index]
    try {
      result = parse(d, { zone: 'UTC' })
      if (result.isValid) {
        return result
      }
    } catch (e) {
      console.warn('Not a valid date', typeof d, d)
      return DateTime.utc()
    }
  }
  console.warn('Not a valid date', typeof d, d)
  return DateTime.utc()
}

export const getISODateByInterval = (
  date: SupportedDateType,
  timeChunkInterval: FourwingsInterval
) => {
  if (!date) {
    return ''
  }
  const dateTime = getUTCDateTime(date)
  switch (timeChunkInterval) {
    case 'YEAR':
      return dateTime.toFormat('yyyy') as string
    case 'MONTH':
      return dateTime.toFormat('yyyy-MM') as string
    case 'DAY':
      return dateTime.toFormat('yyyy-MM-dd') as string
    case 'HOUR':
      return dateTime.toFormat("yyyy-MM-dd'T'HH:00:00") as string
    default:
      return dateTime.toISO() as string
  }
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
