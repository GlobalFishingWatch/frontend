import { useTranslation } from 'react-i18next'
import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'

import type { SupportedDateType } from '@globalfishingwatch/data-transforms'

import type { Locale } from 'types'
import { getUTCDateTime } from 'utils/dates'

import i18n from './i18n'
import { toContentLocale } from './i18n.config'

type formatI18DateParams = {
  format?: DateTimeFormatOptions | object
  locale?: Locale
  showUTCLabel?: boolean
}

const UTC_SUFFIX = 'UTC'

export const formatI18nDate = (
  date: SupportedDateType,
  {
    format = DateTime.DATE_MED,
    locale = i18n.language as Locale,
    showUTCLabel,
  }: formatI18DateParams = {}
) => {
  const dateTimeDate = getUTCDateTime(date)
  let utcSuffix = ''
  const isDateTimeFormat =
    format === DateTime.DATETIME_MED || format === DateTime.DATETIME_MED_WITH_SECONDS
  if ((isDateTimeFormat && showUTCLabel === undefined) || showUTCLabel) {
    utcSuffix = ` ${UTC_SUFFIX}`
  }
  // toContentLocale: dev-only codes (source, val) are not Intl locales, so server and browser
  // would each fall back to their own default locale and break hydration
  return `${dateTimeDate?.setLocale(toContentLocale(locale)).toLocaleString(format)}${utcSuffix}`
}

export const useI18nDate = (
  date: SupportedDateType,
  format = DateTime.DATE_MED,
  showUTCLabel?: boolean
) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale, showUTCLabel })
}
