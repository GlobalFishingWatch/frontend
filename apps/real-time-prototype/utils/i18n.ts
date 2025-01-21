import type { DateTimeFormatOptions } from 'luxon';
import { DateTime } from 'luxon'

import { LOCALE } from 'data/config'

import { getUTCDateTime } from './dates'

export const UTC_SUFFIX = 'UTC'

type formatI18DateParams = {
  format?: DateTimeFormatOptions
  locale?: string
  showUTCLabel?: boolean
}
export const formatI18nDate = (
  date: string | number,
  { format = DateTime.DATE_MED, locale = LOCALE, showUTCLabel = false }: formatI18DateParams = {}
) => {
  const dateTimeDate = getUTCDateTime(date)
  return `${dateTimeDate.setLocale(locale).toLocaleString(format)}${
    format === DateTime.DATETIME_MED || showUTCLabel ? ` ${UTC_SUFFIX}` : ''
  }`
}

type I18Number = string | number
type I18NumberOptions = Intl.NumberFormatOptions & {
  locale?: string
  unit?: string
  unitDisplay?: 'long' | 'short' | 'narrow'
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
}

export const formatI18nNumber = (number: I18Number, options: I18NumberOptions = {}) => {
  const { locale = LOCALE, ...rest } = options
  const parsedNumber = number === 'string' ? parseFloat(number) : (number as number)
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: (number as number) < 10 ? 2 : 0,
      ...rest,
    }).format(parsedNumber)
  } catch (e: any) {
    console.warn(e)
    return number
  }
}
