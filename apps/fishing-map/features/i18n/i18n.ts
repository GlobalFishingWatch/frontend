import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

import { IS_DEVELOPMENT_ENV, PATH_BASENAME } from 'data/config'
import { WORKSPACE_ENV } from 'data/workspaces'
import { Locale } from 'types'

export const CROWDIN_IN_CONTEXT_LANG = 'val'

export const LocaleLabels = [
  { id: Locale.en, label: 'English' },
  { id: Locale.es, label: 'Español' },
  { id: Locale.fr, label: 'Français' },
  { id: Locale.id, label: 'Bahasa Indonesia' },
  { id: Locale.pt, label: 'Portuguese' },
]

const NPM_SCOPE = WORKSPACE_ENV === 'production' ? 'stable' : 'latest'
const SHARED_LABELS_PATH = IS_DEVELOPMENT_ENV
  ? 'http://localhost:8000'
  : `https://cdn.jsdelivr.net/npm/@globalfishingwatch/i18n-labels@${NPM_SCOPE}`

const PACKAGE_NAMESPACES = ['flags', 'datasets', 'timebar']

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
    ns: ['translations', 'flags', 'datasets', 'timebar'],
    defaultNS: 'translations',
    fallbackLng: Locale.en,
    supportedLngs: [...Object.values(Locale), CROWDIN_IN_CONTEXT_LANG],
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
    react: {
      // wait: true,
      useSuspense: false,
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
