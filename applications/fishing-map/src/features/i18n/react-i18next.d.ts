// import the original type declarations
import 'react-i18next'
// import all namespaces (for the default language, only)
import type datasets from '@globalfishingwatch/i18n-labels/source/datasets.json'
import type githubDatasets from '@globalfishingwatch/frontend/packages/i18n-labels/source/datasets.json'
import type flags from '@globalfishingwatch/i18n-labels/source/flags.json'
import type githubFlags from '@globalfishingwatch/frontend/packages/i18n-labels/source/flags.json'
import type timebar from '@globalfishingwatch/i18n-labels/source/timebar.json'
import type githubTimebar from '@globalfishingwatch/frontend/packages/i18n-labels/source/timebar.json'
import type translations from '../../../public/locales/source/translations.json'

declare module 'react-i18next' {
  // and extend them!
  interface Resources {
    translations: typeof translations
    datasets: typeof datasets | typeof githubDatasets
    timebar: typeof timebar | typeof githubTimebar
    flags: typeof flags | typeof githubFlags
  }
}
