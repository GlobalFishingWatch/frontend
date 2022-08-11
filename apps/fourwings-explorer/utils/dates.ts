import { DateTime, DateTimeFormatOptions } from 'luxon'

export const UTC_SUFFIX = 'UTC'

type formatI18DateParams = {
  format?: DateTimeFormatOptions
  locale?: string
  showUTCLabel?: boolean
}
export const formatI18nDate = (
  date: string | number,
  { format = DateTime.DATE_MED, locale = 'en', showUTCLabel = false }: formatI18DateParams = {}
) => {
  const dateTimeDate = typeof date === 'number' ? DateTime.fromMillis(date) : DateTime.fromISO(date)
  return `${dateTimeDate.toUTC().setLocale(locale).toLocaleString(format)}${
    format === DateTime.DATETIME_MED || showUTCLabel ? ` ${UTC_SUFFIX}` : ''
  }`
}
