import { useTranslation } from 'react-i18next'

import type { Locale } from 'types'

import i18n from './i18n'
import { normalizeI18nLanguage } from './i18n.config'

type I18Number = string | number
type I18NumberOptions =
  | Locale
  | (Intl.NumberFormatOptions & {
      locale?: Locale
      unit?: string
      unitDisplay?: 'long' | 'short' | 'narrow'
      notation?: 'standard' | 'scientific' | 'engineering' | 'compact'
    })

const getFormatLocale = () =>
  normalizeI18nLanguage(i18n.resolvedLanguage || i18n.language) as Locale

export const formatI18nNumber = (
  number: I18Number,
  options: I18NumberOptions = getFormatLocale()
) => {
  const locale = typeof options === 'object' ? options.locale || getFormatLocale() : options
  const parsedNumber = number === 'string' ? parseFloat(number) : (number as number)
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 2,
      ...(typeof options === 'object' && { ...options }),
    }).format(parsedNumber)
  } catch (e: any) {
    console.warn(e)
    return number
  }
}

export const useI18nNumber = (number: I18Number) => {
  const { i18n } = useTranslation()
  return formatI18nNumber(
    number,
    normalizeI18nLanguage(i18n.resolvedLanguage || i18n.language) as Locale
  )
}
