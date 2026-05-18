import toNumber from 'lodash/toNumber'
import type { DateTimeOptions } from 'luxon'
import { DateTime } from 'luxon'

import type { FourwingsInterval } from '@globalfishingwatch/deck-loaders'

type DateTimeParseFunction = { (timestamp: string, opts: DateTimeOptions | undefined): DateTime }

// Day first (Rest of world)
const DMY_DATE_FORMATS = [
  'dd/MM/yyyy',
  'd/M/yyyy',
  'dd-MM-yyyy',
  'd-M-yyyy',
  'dd/MM/yy',
  'd/M/yy',
  'dd-MM-yy',
  'd-M-yy',
]

// Month first (American)
const MDY_DATE_FORMATS = [
  'MM/dd/yyyy',
  'M/d/yyyy',
  'MM-dd-yyyy',
  'M-d-yyyy',
  'MM/dd/yy',
  'M/d/yy',
  'MM-dd-yy',
  'M-d-yy',
]

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

export type DateFormatPreference = 'MDY' | 'DMY'

const buildFormatParsers = (dateFormats: string[]): DateTimeParseFunction[] =>
  dateFormats.flatMap((dateFormat) =>
    TIME_FORMATS.map((timeFormat) => {
      const formatString = `${dateFormat}${timeFormat}`
      return (s: string, opts: any) => DateTime.fromFormat(s, formatString, opts)
    })
  )

const ISO_PARSE_METHODS: DateTimeParseFunction[] = [
  DateTime.fromISO,
  DateTime.fromSQL,
  DateTime.fromRFC2822,
]

const DMY_PARSE_METHODS = buildFormatParsers(DMY_DATE_FORMATS)
const MDY_PARSE_METHODS = buildFormatParsers(MDY_DATE_FORMATS)

const getDateParseMethods = (preference?: DateFormatPreference): DateTimeParseFunction[] => {
  if (preference === 'MDY') {
    return [...ISO_PARSE_METHODS, ...MDY_PARSE_METHODS, ...DMY_PARSE_METHODS]
  }
  return [...ISO_PARSE_METHODS, ...DMY_PARSE_METHODS, ...MDY_PARSE_METHODS]
}

const DATE_PARSE_METHODS: DateTimeParseFunction[] = getDateParseMethods()

export const getUTCDate = (timestamp: string | number = Date.now()) => {
  // it could receive a timestamp as a string
  const millis = toNumber(timestamp)
  if (typeof timestamp === 'number' || !isNaN(millis)) {
    return DateTime.fromMillis(millis, { zone: 'UTC' }).toJSDate()
  }
  let result
  for (let index = 0; index < DATE_PARSE_METHODS.length; index++) {
    const parse = DATE_PARSE_METHODS[index]
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

/* caches the successful parse method index.
 * to avoid re-trying all date parse methods for every value. */
export const createCachedDateParser = (options?: { dateFormat?: DateFormatPreference }) => {
  const parseMethods = getDateParseMethods(options?.dateFormat)
  let cachedParseIndex: number | null = null
  return (timestamp: string | number = Date.now()): Date => {
    const millis = toNumber(timestamp)
    if (typeof timestamp === 'number' || !isNaN(millis)) {
      return DateTime.fromMillis(millis, { zone: 'UTC' }).toJSDate()
    }
    if (cachedParseIndex !== null) {
      try {
        const result = parseMethods[cachedParseIndex](timestamp, { zone: 'UTC' })
        if (result.isValid) return result.toJSDate()
      } catch {
        // cached format no longer works, fall through to full search
      }
      cachedParseIndex = null
    }
    for (let index = 0; index < parseMethods.length; index++) {
      const parse = parseMethods[index]
      try {
        const result = parse(timestamp, { zone: 'UTC' })
        if (result.isValid) {
          cachedParseIndex = index
          return result.toJSDate()
        }
      } catch (e) {
        // ignore and try next parse method
      }
    }

    return new Date('Invalid Date')
  }
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
  let result
  for (let index = 0; index < DATE_PARSE_METHODS.length; index++) {
    const parse = DATE_PARSE_METHODS[index]
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
