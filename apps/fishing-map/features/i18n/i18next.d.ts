import type { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels'

import 'i18next'

import type { DEFAULT_NAMESPACE, FALLBACK_LNG } from './i18n'
import type AppResources from './i18n.types'

type LibraryResources = {
  datasets: typeof datasets
  flags: typeof flags
  timebar: typeof timebar
}

type Resources = AppResources & LibraryResources

export declare module 'i18next' {
  interface CustomTypeOptions {
    resources: Resources
    defaultNS: typeof DEFAULT_NAMESPACE
    fallbackLng: typeof FALLBACK_LNG
    allowObjectInHTMLChildren: true
  }
}
