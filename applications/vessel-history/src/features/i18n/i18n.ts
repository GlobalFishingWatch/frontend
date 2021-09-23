import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { Locale } from 'types'
import { WORKSPACE_ENV } from 'data/config'

export const LocaleLabels = [
  { id: Locale.en, label: 'English' },
  // { id: Locale.es, label: 'Español' },
  { id: Locale.fr, label: 'Français' },
]

const PACKAGE_NAMESPACES = ['flags']
const GITHUB_LABELS_BRANCH = WORKSPACE_ENV === 'development' ? 'develop' : 'master'
export const SHARED_LABELS_PATH =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : `https://raw.githubusercontent.com/GlobalFishingWatch/frontend/${GITHUB_LABELS_BRANCH}/packages/i18n-labels`

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
        return `/locales/{{lng}}/{{ns}}.json`
      },
    },
    ns: ['translations', 'flags'],
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

const t = i18n.t.bind(i18n)

export { t }

export default i18n
