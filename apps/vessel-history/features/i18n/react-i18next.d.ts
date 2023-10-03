// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import type { datasets, flags } from '@globalfishingwatch/i18n-labels'
import type translations from '../../public/locales/source/translations.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translations: typeof translations
    datasets: typeof datasets
    flags: typeof flags
  }
}
