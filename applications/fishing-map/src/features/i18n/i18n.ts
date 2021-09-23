import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { Locale } from 'types'
import { PATH_BASENAME } from 'routes/routes'

export const LocaleLabels = [
  { id: Locale.en, label: 'English' },
  { id: Locale.es, label: 'Español' },
  { id: Locale.fr, label: 'Français' },
  { id: Locale.id, label: 'Bahasa Indonesia' },
]

// TODO find beter var names
const COMMON_JSON_BRANCH =
  process.env.REACT_APP_WORKSPACE_ENV === 'development' ? 'i18n-labels' : 'master'
export const COMMON_JSON_PATH = process.env.i18n_USE_LOCAL_SHARED
  ? 'http://localhost:8000'
  : `https://raw.githubusercontent.com/GlobalFishingWatch/frontend/${COMMON_JSON_BRANCH}/packages/i18-labels/src`
export const COMMON_NAMESPACES = ['flags', 'datasets', 'timebar']

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
      loadPath: (lngs: any, namespaces: any) => {
        console.log(namespaces)
        console.log(lngs)
        if (namespaces.some((namespace: string) => COMMON_NAMESPACES.includes(namespace))) {
          return `${COMMON_JSON_PATH}/{{lng}}/{{ns}}.json`
        }
        return `${PATH_BASENAME}/locales/{{lng}}/{{ns}}.json`
      },
    },
    ns: ['translations', 'flags', 'datasets', 'timebar'],
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
  document.documentElement.setAttribute('lang', lng)
})

const t = i18n.t.bind(i18n)

export { t }

export default i18n
