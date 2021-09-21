// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import translations from '../../../public/locales/source/translations.json'
import datasets from '../../../../../packages/i18n-labels/src/datasets.json'
import flags from '../../../../../packages/i18n-labels/src/flags.json'
import timebar from '../../../../../packages/i18n-labels/src/timebar.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translations: typeof translations
    datasets: typeof datasets
    timebar: typeof timebar
    flags: typeof flags
  }
}
