import { DateTime } from 'luxon'

const DATE_FORMAT = 'yyyy/MM/dd'

export function formatDate(date?: string) {
  if (!date) return ''
  return DateTime.fromISO(date).toFormat(DATE_FORMAT)
}
