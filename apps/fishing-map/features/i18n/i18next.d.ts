// import type LibraryResources from '@globalfishingwatch/i18n-labels/resources'

import 'i18next'

import type { DEFAULT_NAMESPACE, FALLBACK_LNG } from './i18n'
import type AppResources from './i18n.types'

type LibraryResources = {
  datasets: Record<string, string>
  flags: Record<string, string>
  timebar: Record<string, string>
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
