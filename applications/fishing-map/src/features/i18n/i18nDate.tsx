import React, { Fragment } from 'react'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { useTranslation } from 'react-i18next'

type Dates = {
  date: string
  format?: DateTimeFormatOptions
}

export const formatI18nDate = (date: string, locale: string, format = DateTime.DATE_MED) => {
  return `${DateTime.fromISO(date).toUTC().setLocale(locale).toLocaleString(format)}${
    format === DateTime.DATETIME_MED ? ' UTC' : ''
  }`
}

export const useI18nDate = (date: string, format = DateTime.DATE_MED) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, i18n.language, format)
}

const I18nDate = ({ date, format = DateTime.DATE_MED }: Dates) => {
  const dateFormatted = useI18nDate(date, format)
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
