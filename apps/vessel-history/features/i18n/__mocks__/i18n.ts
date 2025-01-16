import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

i18n.use(initReactI18next).init({
  react: { useSuspense: false },
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations', 'flags', 'datasets'],
  defaultNS: 'translations',

  debug: process.env.i18n_DEBUG === 'true',

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: { en: { translations: {} } },
})

export default i18n
