import { DateTime } from 'luxon'
import { DATE_FORMAT } from 'data/config'

export function formatDate(date?: string) {
  if (!date) return ''
  return DateTime.fromISO(date).toFormat(DATE_FORMAT)
}
