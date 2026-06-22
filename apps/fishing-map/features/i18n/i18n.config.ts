import { Locale } from '@globalfishingwatch/api-types'

import { IS_DEVELOPMENT_ENV } from 'data/config'

export const DEFAULT_NAMESPACE = 'translations'

export const CROWDIN_IN_CONTEXT_LANG = 'val' as const
export const CROWDIN_SOURCE_LANG = 'source' as const

export const FALLBACK_LNG = Locale.en

export const IS_TEST_ENV = Boolean(import.meta.env.VITEST) && import.meta.env.DEV

export const SERVER_NAMESPACES = [
  'translations',
  'workspaces',
  'help-hints',
  'layer-library',
] as const

/** Fetched from CDN on the client */
export const PACKAGE_NAMESPACES = ['flags', 'timebar'] as const

export const CLIENT_NAMESPACES = [...SERVER_NAMESPACES, ...PACKAGE_NAMESPACES] as const

export type i18nSupportedLocale =
  | Locale
  | typeof CROWDIN_IN_CONTEXT_LANG
  | typeof CROWDIN_SOURCE_LANG

export const SUPPORTED_LANGUAGES = [
  ...Object.values(Locale),
  ...(IS_DEVELOPMENT_ENV && !IS_TEST_ENV ? [CROWDIN_SOURCE_LANG, CROWDIN_IN_CONTEXT_LANG] : []),
] satisfies i18nSupportedLocale[]

export const I18N_LOCALE_CACHE_KEY = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'

export function parseSupportedLanguage(
  language: string | undefined
): i18nSupportedLocale | undefined {
  if (!language?.trim()) {
    return undefined
  }

  const tag = language.trim().split(',')[0]?.trim()
  if (!tag) {
    return undefined
  }

  if (SUPPORTED_LANGUAGES.includes(tag as i18nSupportedLocale)) {
    return tag as i18nSupportedLocale
  }

  const languageOnly = tag.split('-')[0]?.toLowerCase()
  if (languageOnly && SUPPORTED_LANGUAGES.includes(languageOnly as i18nSupportedLocale)) {
    return languageOnly as i18nSupportedLocale
  }

  return undefined
}

export function normalizeI18nLanguage(language: string | undefined): i18nSupportedLocale {
  return parseSupportedLanguage(language) ?? FALLBACK_LNG
}

/**
 * Shared language resolution order used on the server and mirrored by the client detector.
 * cookie → Accept-Language / navigator → fallback
 */
export function resolveLanguageFromSources(sources: {
  cookie?: string | undefined
  acceptLanguage?: string | undefined
}): i18nSupportedLocale {
  const fromCookie = parseSupportedLanguage(sources.cookie)
  if (fromCookie) {
    return fromCookie
  }

  const fromAcceptLanguage = parseSupportedLanguage(sources.acceptLanguage)
  if (fromAcceptLanguage) {
    return fromAcceptLanguage
  }

  return FALLBACK_LNG
}

/**
 * Client LanguageDetector config — mirrors {@link resolveLanguageFromSources}:
 * cookie, then navigator (≈ Accept-Language), then `<html lang>`.
 * localStorage is only used as a write cache after the user changes language.
 */
export const CLIENT_LANGUAGE_DETECTION = {
  order: ['cookie', 'navigator', 'htmlTag'],
  caches: ['cookie', 'localStorage'],
  cookieOptions: { path: '/', sameSite: 'lax' as const },
}

/** Valid BCP47 value for `<html lang>` — dev-only i18n codes map to English. */
export function toDocumentLang(language: string | undefined): string {
  const normalized = normalizeI18nLanguage(language)
  if (normalized === CROWDIN_SOURCE_LANG || normalized === CROWDIN_IN_CONTEXT_LANG) {
    return FALLBACK_LNG
  }
  return normalized
}
