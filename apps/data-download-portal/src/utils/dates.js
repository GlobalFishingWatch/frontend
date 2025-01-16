import { DateTime } from 'luxon'

export const getUTCDateTime = (d) => {
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
  if (typeof d === 'string') {
    return DateTime.fromISO(d, { zone: 'utc' })
  }
  return DateTime.fromMillis(d, { zone: 'utc' })
}

export const getUTCString = (d, format = DateTime.DATE_SHORT) => {
  return getUTCDateTime(d).toLocaleString(format)
}
