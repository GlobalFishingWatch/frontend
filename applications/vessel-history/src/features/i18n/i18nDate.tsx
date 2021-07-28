import React, { Fragment } from 'react'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { useTranslation } from 'react-i18next'
import { Locale } from 'types'
import i18n from './i18n'

type Dates = {
  date: string | number
  format?: DateTimeFormatOptions
}

type formatI18DateParams = { format?: DateTimeFormatOptions; locale?: Locale }

export const formatI18nDate = (
  date: string | number,
  { format = DateTime.DATE_MED, locale = i18n.language as Locale }: formatI18DateParams = {}
) => {
  const dateTimeDate = typeof date === 'number' ? DateTime.fromMillis(date) : DateTime.fromISO(date)
  return `${dateTimeDate.toUTC().setLocale(locale).toLocaleString(format)}${
    format === DateTime.DATETIME_MED ? ' UTC' : ''
  }`
}

export const useI18nDate = (date: string | number, format = DateTime.DATE_MED) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale })
}

const I18nDate = ({ date, format = DateTime.DATE_MED }: Dates) => {
  const dateFormatted = useI18nDate(date, format)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
