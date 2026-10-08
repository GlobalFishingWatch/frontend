import { CMS_MAX_CACHE_AGE_MINUTES } from 'features/help/helpHub.config'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import { toContentLocale } from 'features/i18n/i18n.config'
import type { Locale } from 'types'

export function getHelpHubLocale(): Locale {
  return toContentLocale(getActiveI18nLanguage())
}

export const helpHubRouteCache = {
  staleTime: CMS_MAX_CACHE_AGE_MINUTES * 60 * 1000,
  preloadStaleTime: CMS_MAX_CACHE_AGE_MINUTES * 60 * 1000,
  gcTime: CMS_MAX_CACHE_AGE_MINUTES * 60 * 1000,
  loaderDeps: () => ({ locale: getHelpHubLocale() }),
}
