import { DateTime } from 'luxon'

type DateInput = string | number | Date | undefined | null

export const getUTCDateTime = (d: DateInput): DateTime => {
  if (!d || (typeof d !== 'string' && typeof d !== 'number' && !(d instanceof Date))) {
    console.warn('Not a valid date', typeof d, d)
    return DateTime.utc()
  }

  if (d instanceof Date) {
    try {
      return DateTime.fromJSDate(d, { zone: 'utc' })
    } catch (error) {
      console.warn('Not a valid date', typeof d, d)
      return DateTime.utc()
    }
  }

  if (typeof d === 'string') {
    return DateTime.fromISO(d, { zone: 'utc' })
  }

  return DateTime.fromMillis(d, { zone: 'utc' })
}

export const getUTCString = (
  d: DateInput,
  format: Intl.DateTimeFormatOptions = DateTime.DATE_SHORT
): string => {
  return getUTCDateTime(d).toLocaleString(format)
}
