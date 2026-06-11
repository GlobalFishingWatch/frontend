import type { RootState } from 'store'
import { Locale } from 'types'

import i18n from './i18n'

export const selectI18nLocale = (state: RootState): Locale => {
  void state
  return i18n.isInitialized ? (i18n.language as Locale) : Locale.en
}
