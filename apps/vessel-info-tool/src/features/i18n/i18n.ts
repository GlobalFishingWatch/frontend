import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

import { Locale } from '@globalfishingwatch/api-types'

export const CROWDIN_IN_CONTEXT_LANG = 'val'

export const LocaleLabels = [
  { id: Locale.en, label: 'English' },
  { id: Locale.es, label: 'Español' },
  { id: Locale.fr, label: 'Français' },
  { id: Locale.id, label: 'Bahasa Indonesia' },
  { id: Locale.pt, label: 'Portuguese' },
]

export const DEFAULT_NAMESPACE = 'translations'
export const FALLBACK_LNG = Locale.en

const SUPPORTED_LANGUAGES = [...Object.values(Locale), CROWDIN_IN_CONTEXT_LANG]

i18n
  // load translation using http -> see /public/locales
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    backend: {
      loadPath: (lng: string) => {
        return `/locales/${lng}.json`
      },
    },
    fallbackLng: FALLBACK_LNG,
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
      escapeValue: false,
    },
  })

// @ts-ignore - avoids loop error
const t = i18n.t.bind(i18n)

export { t }

export default i18n
