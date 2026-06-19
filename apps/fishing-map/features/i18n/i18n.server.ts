import i18next, { type Resource, type ResourceLanguage } from 'i18next'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readCookie } from '@globalfishingwatch/api-client'

import { Locale } from 'types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SUPPORTED_LANGUAGES = [
  Locale.en,
  Locale.es,
  Locale.fr,
  // Locale.id,
  Locale.pt,
  'val',
  ...(import.meta.env.DEV ? (['source'] as const) : []),
]

const DEFAULT_NAMESPACE = 'translations'
export const FALLBACK_LNG = import.meta.env.DEV ? 'source' : Locale.en

const NAMESPACES = ['translations', 'workspaces', 'help-hints', 'layer-library'] as const

const LOCALES_DIR = join(__dirname, '..', '..', 'public', 'locales')

export type I18nServerState = {
  initialI18nStore: Record<string, Record<string, Record<string, unknown>>>
  initialLanguage: string
}

export function detectLanguageFromRequest(request: Request): string {
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookieLng = readCookie({ cookie: cookieHeader, key: 'i18next' })
    if (cookieLng && SUPPORTED_LANGUAGES.includes(cookieLng)) {
      return cookieLng
    }
  }
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase()
    if (preferred && SUPPORTED_LANGUAGES.includes(preferred)) {
      return preferred
    }
  }
  return FALLBACK_LNG
}

const resourceCache = new Map<string, Record<string, unknown>>()

function getLanguageResources(language: string): Record<string, unknown> {
  const cached = resourceCache.get(language)
  if (cached) {
    return cached
  }
  const bundle: Record<string, unknown> = {}
  for (const ns of NAMESPACES) {
    try {
      const file = join(LOCALES_DIR, language, `${ns}.json`)
      bundle[ns] = JSON.parse(readFileSync(file, 'utf-8'))
    } catch {
      // Namespace missing for this language — skip; i18next falls back to FALLBACK_LNG.
    }
  }
  resourceCache.set(language, bundle)
  return bundle
}

export function createI18nForLanguage(language: string): typeof i18next {
  const resources: Resource = {}
  for (const lng of new Set([language, FALLBACK_LNG])) {
    resources[lng] = getLanguageResources(lng) as ResourceLanguage
  }

  const instance = i18next.createInstance()
  instance.init({
    lng: language,
    fallbackLng: FALLBACK_LNG,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: NAMESPACES,
    defaultNS: DEFAULT_NAMESPACE,
    resources,
    initAsync: false, // synchronous init — resources are already in memory
    interpolation: {
      escapeValue: false,
    },
  })
  return instance
}

export function createRequestI18n(request: Request): typeof i18next {
  return createI18nForLanguage(detectLanguageFromRequest(request))
}

export function getI18nServerState(instance: typeof i18next): I18nServerState {
  const initialI18nStore: I18nServerState['initialI18nStore'] = {}
  for (const lng of new Set([instance.language, FALLBACK_LNG])) {
    const data = instance.services.resourceStore.data[lng]
    if (data) {
      initialI18nStore[lng] = data as Record<string, Record<string, unknown>>
    }
  }
  return {
    initialI18nStore,
    initialLanguage: instance.language,
  }
}
