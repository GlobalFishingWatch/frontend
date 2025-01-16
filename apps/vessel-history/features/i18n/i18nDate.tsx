import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import type { DateTimeFormatOptions} from 'luxon';
import { DateTime, Zone } from 'luxon'
import type { Locale } from 'types'

import { getUTCDateTime } from 'utils/dates'

import i18n from './i18n'

type Dates = {
  date: string | number
  format?: DateTimeFormatOptions
}

type TMTDate = {
  date: string | number
  format?: DateTimeFormatOptions
  forcedTokensFormat?: string
}

type formatI18DateParams = {
  format?: DateTimeFormatOptions
  locale?: Locale
  tokensFormat?: string
}

export const formatI18nDate = (
  date: string | number,
  {
    format = DateTime.DATE_MED,
    locale = i18n.language as Locale,
    tokensFormat,
  }: formatI18DateParams = {}
) => {
  const dateTimeDate = getUTCDateTime(date).setLocale(locale)
  // console.log(
  //   (() => {
  //     const a = DateTime.fromISO('20200101').setZone('utc', { keepLocalTime: true })
  //     const b = DateTime.fromISO('2020-01-01T00:00:00', { zone: 'utc' })
  //     const c = DateTime.fromISO('2020-01-01T00:00:00')
  //     return {
  //       a: a.toISO(),
  //       b: b.toISO(),
  //       c: c.toUTC().toISO(),
  //     }
  //   })()
  // )
  // console.log(new Date().getTime() - DateTime.now().toUTC().toMillis())
  const formattedDate = tokensFormat
    ? dateTimeDate.toFormat(tokensFormat)
    : dateTimeDate.toLocaleString(format)
  return `${formattedDate}${format === DateTime.DATETIME_MED ? ' UTC' : ''}`
}

export const useI18nDate = (
  date: string | number,
  format = DateTime.DATE_MED,
  tokensFormat?: string
) => {
  const { i18n } = useTranslation()
  return formatI18nDate(date, { format, locale: i18n.language as Locale, tokensFormat })
}

const I18nDate = ({ date, format = DateTime.DATE_MED }: Dates) => {
  const dateFormatted = useI18nDate(date, format)
  return <Fragment>{dateFormatted}</Fragment>
}

export const formatI18nSpecialDate = ({ date, format = DateTime.DATE_MED }: TMTDate) => {
  let parsedDate, tokensFormat
  if (date.toString().match(/^\d{4}(00|99){1,2}$/)) {
    parsedDate = date.toString().replace(/(\d{4})(00|99){1,2}$/, '$1-01-01')
    tokensFormat = 'yyyy'
  } else if (date.toString().match(/^\d{6}(00|99)$/)) {
    parsedDate = date.toString().replace(/(\d{4})(\d{2})(00|99)$/, '$1-$2-01')
    tokensFormat = 'LLL, yyyy'
  } else if (date.toString().match(/^\d{4}-\d{2}-9{2}$/)) {
    // Converts 2016-02-99 dates to 2016-02-01 and formats it as Feb, 2016
    // TODO: Confirm with the source if this interpretation is correct
    parsedDate = date.toString().replace(/(\d{4})-(\d{2})-(9{2})$/, '$1-$2-01')
    tokensFormat = 'LLL, yyyy'
  } else if (date.toString().match(/^\d{8}$/)) {
    parsedDate = date.toString().replace(/(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
  }
  return formatI18nDate(parsedDate ?? date, {
    format,
    locale: i18n.language as Locale,
    tokensFormat: tokensFormat,
  })
}

export const I18nSpecialDate = ({ date, format = DateTime.DATE_MED }: TMTDate) => {
  const dateFormatted = formatI18nSpecialDate({ date, format })
  return <Fragment>{dateFormatted}</Fragment>
}

export default I18nDate
