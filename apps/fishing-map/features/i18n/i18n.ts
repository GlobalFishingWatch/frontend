import { initReactI18next } from 'react-i18next'
import i18n, { type Resource } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

import { PATH_BASENAME } from 'data/config'
import {
  CLIENT_LANGUAGE_DETECTION,
  CLIENT_NAMESPACES,
  DEFAULT_NAMESPACE,
  FALLBACK_LNG,
  getPackageNamespaceUrl,
  I18N_LOCALE_CACHE_KEY,
  PACKAGE_NAMESPACES,
  SUPPORTED_LANGUAGES,
} from 'features/i18n/i18n.config'
import { getDehydratedRootI18nState } from 'features/i18n/i18n.dehydrated-state'
import { type I18nServerState, serializeI18nState } from 'features/i18n/i18n-state.utils'

export type { I18nServerState } from 'features/i18n/i18n-state.utils'

if (!import.meta.env.SSR) {
  // Read at init time so TanStack Router's bootstrap payload is available.
  const ssrState: I18nServerState | undefined = getDehydratedRootI18nState()

  i18n
    // load translation using http -> see /public/locales
    // learn more: https://github.com/i18next/i18next-http-backend
    .use(Backend)
    // detect user language — same order as server (see CLIENT_LANGUAGE_DETECTION)
    // learn more: https://github.com/i18next/i18next-browser-languagedetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      ...(ssrState && {
        resources: ssrState.initialI18nStore as Resource,
        lng: ssrState.initialLanguage,
        // Resources only contain the SSR language — let the backend load others on demand
        partialBundledLanguages: true,
      }),
      backend: {
        loadPath: (lngs: string[], namespaces: string[]) => {
          if (
            namespaces.some((namespace: string) =>
              (PACKAGE_NAMESPACES as readonly string[]).includes(namespace)
            )
          ) {
            return getPackageNamespaceUrl('{{lng}}', '{{ns}}')
          }
          return `${PATH_BASENAME}/locales/{{lng}}/{{ns}}.json?v=${I18N_LOCALE_CACHE_KEY}`
        },
      },
      detection: CLIENT_LANGUAGE_DETECTION,
      ns: CLIENT_NAMESPACES,
      defaultNS: DEFAULT_NAMESPACE,
      fallbackLng: ssrState?.initialLanguage ?? FALLBACK_LNG,
      supportedLngs: SUPPORTED_LANGUAGES,
      debug: import.meta.env.VITE_I18N_DEBUG === 'true',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default,
      },
      react: {
        useSuspense: false,
        bindI18n: 'languageChanged loaded',
      },
    })
}

let serverI18nAccessor: (() => typeof i18n) | null = null
export function __setServerI18nAccessor(accessor: () => typeof i18n): void {
  serverI18nAccessor = accessor
}

function getActiveI18n(): typeof i18n {
  return serverI18nAccessor?.() ?? i18n
}

export function getActiveI18nState(): I18nServerState | undefined {
  const instance = getActiveI18n()
  if (!instance.isInitialized) {
    return undefined
  }

  const state = serializeI18nState(instance)
  if (!state.initialLanguage || !state.initialI18nStore[state.initialLanguage]) {
    return undefined
  }

  return state
}

export function getActiveI18nLanguage(): string {
  const instance = getActiveI18n()
  return instance.resolvedLanguage ?? instance.language ?? FALLBACK_LNG
}

const t: typeof i18n.t = import.meta.env.SSR
  ? (((...args: Parameters<typeof i18n.t>) => getActiveI18n().t(...args)) as typeof i18n.t)
  : i18n.t.bind(i18n)

export { t }

const i18nExport: typeof i18n = import.meta.env.SSR
  ? new Proxy(i18n, {
      get(_target, prop) {
        const instance = getActiveI18n()
        const value = Reflect.get(instance, prop, instance)
        return typeof value === 'function' ? value.bind(instance) : value
      },
    })
  : i18n

export default i18nExport
