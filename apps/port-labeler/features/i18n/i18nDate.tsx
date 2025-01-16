import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateTimeFormatOptions } from 'luxon';
import { DateTime } from 'luxon'
import type { Locale } from 'types'

import { getUTCDateTime } from 'utils/dates'

import i18n from './i18n'

type Dates = {
  date: string
  format?: DateTimeFormatOptions
}

type formatI18DateParams = { format?: DateTimeFormatOptions; locale?: Locale }

export const formatI18nDate = (
  date: string | number,
  { format = DateTime.DATE_MED, locale = i18n.language as Locale }: formatI18DateParams = {}
) => {
  const dateTimeDate = getUTCDateTime(date)
  return `${dateTimeDate.setLocale(locale).toLocaleString(format)}${
    format === DateTime.DATETIME_MED ? ' UTC' : ''
  }`
}

export const useI18nDate = (date: string, format = DateTime.DATE_MED) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale })
}

const I18nDate = ({ date, format = DateTime.DATE_MED }: Dates) => {
  const dateFormatted = useI18nDate(date, format)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
