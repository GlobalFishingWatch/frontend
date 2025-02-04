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
    showUTCLabel = false,
  }: formatI18DateParams = {}
) => {
  const dateTimeDate = getUTCDateTime(date)
  return `${dateTimeDate?.setLocale(locale).toLocaleString(format)}${
    format === DateTime.DATETIME_MED || showUTCLabel ? ` ${UTC_SUFFIX}` : ''
  }`
}

export const useI18nDate = (
  date: SupportedDateType,
  format = DateTime.DATE_MED,
  showUTCLabel = false
) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale, showUTCLabel })
}

const I18nDate = ({ date, format = DateTime.DATE_MED, showUTCLabel = false }: Dates) => {
  const dateFormatted = useI18nDate(date, format, showUTCLabel)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
