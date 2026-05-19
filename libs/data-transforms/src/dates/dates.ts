import toNumber from 'lodash/toNumber'
import type { DateTimeOptions } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

type DateTimeParseFunction = { (timestamp: string, opts: DateTimeOptions | undefined): DateTime }

const TIME_FORMATS = [
  ' HH:mm:ss.SSS',
  ' HH:mm:ss',
  ' HH:mm',
  ' H:mm:ss.SSS',
  ' H:mm:ss',
  ' H:mm',
  ' hh:mm:ss a',
  ' hh:mm a',
  ' h:mm:ss a',
  ' h:mm a',
  '',
]

const makeFormatParsers = (dateFormats: string[]): DateTimeParseFunction[] =>
  dateFormats.flatMap((dateFormat) =>
    TIME_FORMATS.map((timeFormat) => {
      const fmt = `${dateFormat}${timeFormat}`
      return (s: string, opts: any) => DateTime.fromFormat(s, fmt, opts)
    })
  )

const SLASH_PARSE_METHODS = makeFormatParsers(['MM/dd/yyyy', 'M/d/yyyy', 'dd/MM/yyyy', 'd/M/yyyy'])

const DASH_PARSE_METHODS = makeFormatParsers(['MM-dd-yyyy', 'M-d-yyyy', 'dd-MM-yyyy', 'd-M-yyyy'])

const THROWING_PARSERS = new Set<DateTimeParseFunction>([
  DateTime.fromISO,
  DateTime.fromSQL,
  DateTime.fromRFC2822,
])

const ISO_SQL_RE = /^\d{4}-\d{2}-\d{2}/
const RFC_RE = /^[a-z]{3},?\s/i
const SLASH_RE = /^\d{1,2}\/\d{1,2}\/\d{4}/
const DASH_RE = /^\d{1,2}-\d{1,2}-\d{4}/

const detectCandidates = (s: string): DateTimeParseFunction[] | null => {
  if (ISO_SQL_RE.test(s)) return [DateTime.fromISO, DateTime.fromSQL]
  if (RFC_RE.test(s)) return [DateTime.fromRFC2822]
  if (SLASH_RE.test(s)) return SLASH_PARSE_METHODS
  if (DASH_RE.test(s)) return DASH_PARSE_METHODS
  return null
}

export const getUTCDate = (timestamp: string | number = Date.now()) => {
  const millis = toNumber(timestamp)
  if (typeof timestamp === 'number' || !isNaN(millis)) {
    return DateTime.fromMillis(millis, { zone: 'UTC' }).toJSDate()
  }
  const candidates = detectCandidates(timestamp)
  if (!candidates) {
    return new Date('Invalid Date')
  }
  for (const parse of candidates) {
    let result: DateTime
    if (THROWING_PARSERS.has(parse)) {
      try {
        result = parse(timestamp, { zone: 'UTC' })
      } catch {
        return new Date('Invalid Date')
      }
    } else {
      result = parse(timestamp, { zone: 'UTC' })
    }
    if (result!.isValid) {
      return result!.toJSDate()
    }
  }
  return new Date('Invalid Date')
}
export type SupportedDateType = string | number | Date
export const getUTCDateTime = (d: SupportedDateType): DateTime => {
  // it could receive a timestamp as a string
  const millis = toNumber(d)
  if (typeof d === 'number' || !isNaN(millis)) {
    return DateTime.fromMillis(millis, { zone: 'UTC' })
  }
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
  const candidates = detectCandidates(d)
  if (!candidates) {
    return DateTime.utc()
  }
  for (const parse of candidates) {
    let result: DateTime
    if (THROWING_PARSERS.has(parse)) {
      try {
        result = parse(d, { zone: 'UTC' })
      } catch {
        console.warn('Not a valid date', typeof d, d)
        return DateTime.utc()
      }
    } else {
      result = parse(d, { zone: 'UTC' })
    }
    if (result!.isValid) {
      return result!
    }
  }
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

export const formatDateForInterval = (
  date: DateTime | SupportedDateType,
  timeChunkInterval: FourwingsInterval
) => {
  const dateTime = DateTime.isDateTime(date) ? date : getUTCDateTime(date)
  let formattedTick
  switch (timeChunkInterval) {
    case 'YEAR':
      formattedTick = dateTime.year.toString()
      break
    case 'MONTH':
      formattedTick = dateTime.toFormat('LLL y')
      break
    case 'HOUR':
      formattedTick = dateTime.toLocaleString(DateTime.DATETIME_MED)
      break
    // case 'WEEKDAY':
    //   formattedTick = dateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)
    //   break
    default:
      formattedTick = dateTime.toLocaleString(DateTime.DATE_MED)
      break
  }
  return formattedTick
}
