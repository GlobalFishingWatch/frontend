import { Locale } from '@globalfishingwatch/api-types'

// Isomorphic i18n constants shared by the client (i18n.ts) and server (i18n.server.ts)
// setups — keep this module free of i18next imports and side effects.

export const CROWDIN_SOURCE_LANG = 'source'
export const CROWDIN_IN_CONTEXT_LANG = 'val'

export const DEFAULT_NAMESPACE = 'translations'

export const IS_I18N_TEST_ENV = Boolean(import.meta.env.VITEST)
export const IS_I18N_DEV_ENV = import.meta.env.DEV && !IS_I18N_TEST_ENV

export const FALLBACK_LNG = IS_I18N_DEV_ENV ? 'source' : Locale.en

export type i18nSupportedLocale =
  | Locale
  | typeof CROWDIN_IN_CONTEXT_LANG
  | typeof CROWDIN_SOURCE_LANG

export const SUPPORTED_LANGUAGES: i18nSupportedLocale[] = [
  ...Object.values(Locale),
  CROWDIN_IN_CONTEXT_LANG,
  ...(IS_I18N_DEV_ENV ? ['source' as const] : []),
]

/** Map browser locales (e.g. en-IN) to a supported language code (e.g. en). */
export function normalizeI18nLanguage(language: string | undefined): i18nSupportedLocale {
  if (!language) {
    return FALLBACK_LNG
  }

  if (SUPPORTED_LANGUAGES.includes(language as i18nSupportedLocale)) {
    return language as i18nSupportedLocale
  }

  const languageOnly = language.split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(languageOnly as i18nSupportedLocale)) {
    return languageOnly as i18nSupportedLocale
  }

  return FALLBACK_LNG
}
