import { initReactI18next } from 'react-i18next'
import i18next, { type Resource, type ResourceLanguage } from 'i18next'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { readCookie } from '@globalfishingwatch/api-client'

import {
  DEFAULT_NAMESPACE,
  getPackageNamespaceUrl,
  type i18nSupportedLocale,
  normalizeI18nLanguage,
  resolveLanguageFromSources,
  SERVER_NAMESPACES,
  SUPPORTED_LANGUAGES,
} from './i18n.config'

export type { I18nServerState } from './i18n-state.utils'
export { serializeI18nState } from './i18n-state.utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export { normalizeI18nLanguage, parseSupportedLanguage } from './i18n.config'

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

// Package namespaces (CDN-only on the client) that we also want available server-side so SSR
// renders their values (e.g. flag country names) instead of fallback codes. Keep this tight:
// each one is fetched over the network per language and shipped in the dehydrated i18n state.
const SERVER_PACKAGE_NAMESPACES = ['flags'] as const

// TTL cache for the fetched package namespaces. i18n-labels ships under the mutable npm tags
// (@stable / @latest), so it can change without an app deploy — the TTL lets the server pick up
// new translations, and invalidateServerPackageNamespaceCache() forces an immediate refresh.
// Dev: TTL 0 = always refetch (translators iterate). Prod: refresh hourly.
const PACKAGE_NS_TTL_MS = process.env.NODE_ENV === 'production' ? 60 * 60 * 1000 : 0
type PackageNsCacheEntry = { data: Record<string, unknown>; fetchedAt: number }
const packageNsCache = new Map<string, PackageNsCacheEntry>()

async function fetchServerPackageNamespace(
  language: string,
  ns: string
): Promise<Record<string, unknown>> {
  const key = `${language}:${ns}`
  const cached = packageNsCache.get(key)
  const isFresh = cached && PACKAGE_NS_TTL_MS > 0 && Date.now() - cached.fetchedAt < PACKAGE_NS_TTL_MS
  if (isFresh) {
    return cached!.data
  }
  try {
    const res = await fetch(getPackageNamespaceUrl(language, ns))
    if (!res.ok) {
      throw new Error(`Failed to fetch i18n package namespace ${key}: ${res.status}`)
    }
    const data = (await res.json()) as Record<string, unknown>
    packageNsCache.set(key, { data, fetchedAt: Date.now() })
    return data
  } catch {
    // Network/CDN failure — keep serving stale data if we have it, otherwise fall back to the
    // namespace keys (i18next defaultValue), i.e. the previous code-only render. Never throw.
    return cached?.data ?? {}
  }
}

/**
 * Fetch the server-side package namespaces for a language and add them to the instance, so SSR
 * can translate values that normally come from the CDN-only client namespaces. Best-effort:
 * a failed fetch leaves the namespace empty and rendering degrades to fallback codes.
 */
export async function loadServerPackageNamespaces(
  instance: typeof i18next,
  language: string
): Promise<void> {
  const lng = normalizeI18nLanguage(language)
  await Promise.all(
    SERVER_PACKAGE_NAMESPACES.map(async (ns) => {
      const data = await fetchServerPackageNamespace(lng, ns)
      if (data && Object.keys(data).length) {
        instance.addResourceBundle(lng, ns, data, true, true)
      }
    })
  )
}

/**
 * Drop cached package namespaces so the next request refetches them. Call after new i18n-labels
 * are published to refresh translations without a redeploy. No args clears everything; pass a
 * language (and optionally a namespace) to scope the invalidation.
 */
export function invalidateServerPackageNamespaceCache(language?: string, ns?: string): void {
  if (!language) {
    packageNsCache.clear()
    return
  }
  const lng = normalizeI18nLanguage(language)
  if (ns) {
    packageNsCache.delete(`${lng}:${ns}`)
    return
  }
  for (const key of packageNsCache.keys()) {
    if (key.startsWith(`${lng}:`)) {
      packageNsCache.delete(key)
    }
  }
}

export function createI18nForLanguage(language: string): typeof i18next {
  const lng = normalizeI18nLanguage(language)
  const resources: Resource = {}
  resources[lng] = getLanguageResources(lng) as ResourceLanguage

  const instance = i18next.createInstance()
  instance.use(initReactI18next).init({
    lng,
    fallbackLng: lng,
    supportedLngs: SUPPORTED_LANGUAGES,
    ns: [...SERVER_NAMESPACES, ...SERVER_PACKAGE_NAMESPACES],
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
