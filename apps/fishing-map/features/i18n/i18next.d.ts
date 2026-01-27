import type { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels/types'

import 'i18next'

import type { DEFAULT_NAMESPACE, FALLBACK_LNG } from './i18n'
import type AppResources from './i18n.types'

type LibraryResources = {
  datasets: datasets
  flags: flags
  timebar: timebar
}

type Resources = AppResources & LibraryResources

export declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE
    fallbackLng: typeof FALLBACK_LNG
    resources: Resources
    allowObjectInHTMLChildren: true
    // Keeps large translation sets from slowing IDE/tsc (i18next typescript docs)
    enableSelector: 'optimize'
  }
}
