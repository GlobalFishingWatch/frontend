import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { i18nSupportedLocale } from 'features/i18n/i18n.config'
import {
  FALLBACK_LNG,
  normalizeI18nLanguage,
  SUPPORTED_LANGUAGES,
} from 'features/i18n/i18n.config'
import { readRequestCookieString } from 'utils/cookies'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const NAMESPACES = ['translations', 'workspaces'] as const

const LOCALES_DIR = join(__dirname, '..', '..', 'public', 'locales')

// Translations are static per deploy — parse each language/namespace file once per process
// instead of re-reading from disk on every SSR request.
const resourceCache = new Map<string, Promise<Record<string, unknown> | undefined>>()

function loadNamespace(lng: string, ns: string): Promise<Record<string, unknown> | undefined> {
  const cacheKey = `${lng}/${ns}`
  let cached = resourceCache.get(cacheKey)
  if (!cached) {
    cached = readFile(join(LOCALES_DIR, lng, `${ns}.json`), 'utf-8')
      .then((raw) => JSON.parse(raw) as Record<string, unknown>)
      .catch(() => {
        // Don't cache failures permanently — allow retry on next request
        resourceCache.delete(cacheKey)
        return undefined
      })
    resourceCache.set(cacheKey, cached)
  }
  return cached
}

/** Parses the Accept-Language header honoring q-values, returns languages in preference order */
function parseAcceptLanguage(header: string): i18nSupportedLocale[] {
  return header
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1
      return { language: tag?.split('-')[0]?.toLowerCase() ?? '', q: Number.isNaN(q) ? 0 : q }
    })
    .filter(({ language }) => language)
    .sort((a, b) => b.q - a.q)
    .map(({ language }) => language as i18nSupportedLocale)
}

function detectLanguageFromRequest(request: Request): string {
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const cookieLng = readRequestCookieString(cookieHeader, 'i18next')
    if (cookieLng) {
      return normalizeI18nLanguage(cookieLng)
    }
  }
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferred = parseAcceptLanguage(acceptLanguage).find((lng) =>
      SUPPORTED_LANGUAGES.includes(lng)
    )
    if (preferred) {
      return preferred
    }
  }
  return FALLBACK_LNG
}

// TanStack Router beforeLoad context must be JSON-serializable — avoid `unknown` here.
export type I18nTranslationStore = Record<string, Record<string, Record<string, object>>>

export type I18nServerState = {
  initialI18nStore: I18nTranslationStore
  initialLanguage: string
}

/**
 * Builds the i18n state embedded in the SSR payload: only the detected language's namespaces.
 * The client lazy-fetches the fallback language (and other namespaces) over HTTP when needed,
 * where they're cached by the browser across reloads.
 */
export async function getI18nServerState(request: Request): Promise<I18nServerState> {
  const language = detectLanguageFromRequest(request)

  const resources = await Promise.all(NAMESPACES.map((ns) => loadNamespace(language, ns)))

  const namespaces: Record<string, Record<string, object>> = {}
  NAMESPACES.forEach((ns, index) => {
    if (resources[index]) {
      namespaces[ns] = resources[index] as Record<string, object>
    }
  })

  return {
    initialI18nStore: { [language]: namespaces },
    initialLanguage: language,
  }
}
