import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

import { WORKSPACE_ENV } from 'data/config'
import { PATH_BASENAME } from 'routes/routes'
import { Locale } from 'types'

export const LocaleLabels = [
  { id: Locale.en, label: 'English' },
  // { id: Locale.es, label: 'Español' },
  { id: Locale.fr, label: 'Français' },
]

const NPM_SCOPE = WORKSPACE_ENV === 'production' ? 'stable' : 'latest'
export const SHARED_LABELS_PATH =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : `https://cdn.jsdelivr.net/npm/@globalfishingwatch/i18n-labels@${NPM_SCOPE}`

export const PACKAGE_NAMESPACES = ['flags', 'datasets']

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
      loadPath: (lngs: string[], namespaces: string[]) => {
        if (namespaces.some((namespace: string) => PACKAGE_NAMESPACES.includes(namespace))) {
          return `${SHARED_LABELS_PATH}/{{lng}}/{{ns}}.json`
        }
        return `${PATH_BASENAME}/locales/{{lng}}/{{ns}}.json`
      },
    },
    ns: ['translations', 'flags', 'datasets'],
    defaultNS: 'translations',
    fallbackLng: Locale.en,
    supportedLngs: Object.values(Locale),
    debug: process.env.i18n_DEBUG === 'true',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default,
      // format: (value, format, lng) => {
      //   if (format === 'intlDate') {
      //     return new Intl.DateTimeFormat(lng).format(value)
      //   }
      //   return value
      // },
    },
  })

i18n.on('languageChanged', (lng) => {
  if (process.browser) {
    document.documentElement.setAttribute('lang', lng)
  }
})

const t = i18n.t.bind(i18n)

export { t }

export default i18n
