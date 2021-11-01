// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import type { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels'
import type translations from '../../../public/locales/source/translations.json'
import type helpHints from '../../../public/locales/source/helpHints.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translations: typeof translations
    helpHints: typeof helpHints
    datasets: typeof datasets
    timebar: typeof timebar
    flags: typeof flags
  }
}
