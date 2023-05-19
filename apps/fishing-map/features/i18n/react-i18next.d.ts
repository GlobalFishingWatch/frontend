/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next'

import type { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels'
import type translations from '../../public/locales/source/translations.json'
import type helpHints from '../../public/locales/source/helpHints.json'

interface I18nNamespaces {
  translations: typeof translations
  helpHints: typeof helpHints
  datasets: typeof datasets
  timebar: typeof timebar
  flags: typeof flags
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translations'
    resources: I18nNamespaces
  }
}
