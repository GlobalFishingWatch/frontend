// import the original type declarations
import 'i18next'

import type dataTerminology from '../../public/locales/source/data-terminology.json'
import type helphints from '../../public/locales/source/helphints.json'
import type layerLibrary from '../../public/locales/source/layer-library.json'
// import all namespaces (for the default language, only)
/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
// import type { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels'
import type translations from '../../public/locales/source/translations.json'

type Resources = {
  translations: typeof translations
  'help-hints': typeof helphints
  'data-terminology': typeof dataTerminology
  'layer-library': typeof layerLibrary
  datasets: typeof datasets
  timebar: typeof timebar
  flags: typeof flags
}

// export default resources

// import type Resources from './resources'

export declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'translations'
    // custom resources type
    resources: Resources
    allowObjectInHTMLChildren: true
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translations'
    resources: Resources
  }
}
