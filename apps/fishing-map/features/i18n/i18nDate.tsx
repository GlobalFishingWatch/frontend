import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateTimeFormatOptions } from 'luxon'
import { DateTime } from 'luxon'

import type { SupportedDateType } from '@globalfishingwatch/data-transforms'

import type { Locale } from 'types'
import { getUTCDateTime } from 'utils/dates'

import i18n from './i18n'

type Dates = {
  date: string | number
  format?: DateTimeFormatOptions
  showUTCLabel?: boolean
}

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
  if ((format === DateTime.DATETIME_MED && showUTCLabel === undefined) || showUTCLabel) {
    utcSuffix = ` ${UTC_SUFFIX}`
  }
  return `${dateTimeDate?.setLocale(locale).toLocaleString(format)}${utcSuffix}`
}

export const useI18nDate = (
  date: SupportedDateType,
  format = DateTime.DATE_MED,
  showUTCLabel?: boolean
) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale, showUTCLabel })
}

const I18nDate = ({ date, format = DateTime.DATE_MED, showUTCLabel }: Dates) => {
  const dateFormatted = useI18nDate(date, format, showUTCLabel)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
