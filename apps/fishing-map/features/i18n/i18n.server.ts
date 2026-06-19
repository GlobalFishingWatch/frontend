import { initReactI18next } from 'react-i18next'
import i18next, { type Resource, type ResourceLanguage } from 'i18next'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readCookie } from '@globalfishingwatch/api-client'

import {
  DEFAULT_NAMESPACE,
  FALLBACK_LNG,
  type i18nSupportedLocale,
  normalizeI18nLanguage,
  resolveLanguageFromSources,
  SERVER_NAMESPACES,
  SUPPORTED_LANGUAGES,
} from './i18n.config'
import { type I18nServerState, serializeI18nState } from './i18n-state.utils'

export type { I18nServerState } from './i18n-state.utils'
export { normalizeI18nServerState, serializeI18nState } from './i18n-state.utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export { FALLBACK_LNG, normalizeI18nLanguage, parseSupportedLanguage } from './i18n.config'

const LOCALES_DIR = join(__dirname, '..', '..', 'public', 'locales')

export function detectLanguageFromRequest(request: Request): i18nSupportedLocale {
  const cookieHeader = request.headers.get('cookie')
  const cookieLng = cookieHeader ? readCookie({ cookie: cookieHeader, key: 'i18next' }) : undefined

  return resolveLanguageFromSources({
    cookie: cookieLng ?? undefined,
    acceptLanguage: request.headers.get('accept-language') ?? undefined,
  })
}

// Only cache in production: locale files are static there, but under dev HMR an edited
// translation must refresh, so skip the cache when not in production.
const CACHE_RESOURCES = process.env.NODE_ENV === 'production'
const resourceCache = new Map<string, Record<string, unknown>>()

function getLanguageResources(language: string): Record<string, unknown> {
  if (CACHE_RESOURCES) {
    const cached = resourceCache.get(language)
    if (cached) {
      return cached
    }
  }
  const bundle: Record<string, unknown> = {}
  for (const ns of SERVER_NAMESPACES) {
    try {
      const file = join(LOCALES_DIR, language, `${ns}.json`)
      bundle[ns] = JSON.parse(readFileSync(file, 'utf-8'))
    } catch {
      // Namespace missing for this language — skip; i18next falls back to FALLBACK_LNG.
    }
  }
  if (CACHE_RESOURCES) {
    resourceCache.set(language, bundle)
  }
  return bundle
}

export function createI18nForLanguage(language: string): typeof i18next {
  const lng = normalizeI18nLanguage(language)
  const resources: Resource = {}
  for (const resourceLng of new Set([lng, FALLBACK_LNG])) {
    resources[resourceLng] = getLanguageResources(resourceLng) as ResourceLanguage
  }

  const instance = i18next.createInstance()
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: FALLBACK_LNG,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: SERVER_NAMESPACES,
    defaultNS: DEFAULT_NAMESPACE,
    resources,
    initAsync: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })
  return instance
}

export function createRequestI18n(request: Request): typeof i18next {
  return createI18nForLanguage(detectLanguageFromRequest(request))
}

export function getI18nServerState(instance: typeof i18next): I18nServerState {
  return serializeI18nState(instance)
}
