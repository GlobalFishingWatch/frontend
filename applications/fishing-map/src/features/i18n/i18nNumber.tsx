import React, { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { LocaleOptions } from 'types'

type I18Number = string | number

export const formatI18nNumber = (num: I18Number, locale: LocaleOptions) => {
  const number = num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(locale, {
    maximumFractionDigits: number < 10 ? 2 : 0,
  })
}

export const useI18nNumber = (number: I18Number) => {
  const { i18n } = useTranslation()
  return formatI18nNumber(number, i18n.language as LocaleOptions)
}

const I18nNumber = ({ number }: { number: I18Number }) => {
  const numberFormatted = useI18nNumber(number)
  return <Fragment>{numberFormatted}</Fragment>
}

export default I18nNumber
