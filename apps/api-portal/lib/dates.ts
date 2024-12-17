import type { DateTimeFormatOptions } from 'luxon';
import { DateTime } from 'luxon'

export enum Locale {
  en = 'en',
  es = 'es',
  fr = 'fr',
}

type formatI18DateParams = {
  format?: DateTimeFormatOptions
  locale?: Locale
  tokensFormat?: string
}

export const formatI18nDate = (
  date: string | number,
  { format = DateTime.DATE_MED, locale, tokensFormat }: formatI18DateParams = {}
) => {
  const dateTimeDate = (
    typeof date === 'number'
      ? DateTime.fromMillis(date, { zone: 'utc' })
      : DateTime.fromISO(date, { zone: 'utc' })
  ).setLocale(locale as any)
  const formattedDate = tokensFormat
    ? dateTimeDate.toFormat(tokensFormat)
    : dateTimeDate.toLocaleString(format)
  return `${formattedDate}${format === DateTime.DATETIME_MED ? ' UTC' : ''}`
}
