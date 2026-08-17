import { getDataUpdateContent } from 'features/cms/loaders/data-update'
import { getUseCaseContent } from 'features/cms/loaders/use-case'
import { getUserGuideContent } from 'features/cms/loaders/user-guide'
import { CMS_MAX_CACHE_AGE_MINUTES, HELP_HUB_SECTIONS } from 'features/help/helpHub.config'
import type { HelpHubItem, HelpHubSectionId } from 'features/help/helpHub.types'
import { toDataUpdateItems, toUseCaseItems, toUserGuideItems } from 'features/help/helpHub.utils'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import { toContentLocale } from 'features/i18n/i18n.config'
import type { Locale } from 'types'

export type HelpHubSectionData = {
  items: HelpHubItem[]
  error?: string
}

export type HelpHubSectionItems = Record<HelpHubSectionId, HelpHubSectionData>

const SECTION_FETCHERS: Record<HelpHubSectionId, (locale: Locale) => Promise<HelpHubItem[]>> = {
  toolsAndFeatures: async (locale) => {
    const response = await getUserGuideContent({ data: { locale } })
    return toUserGuideItems(response?.data ?? [])
  },
  useCases: async (locale) => {
    const response = await getUseCaseContent({ data: { locale } })
    return toUseCaseItems(response?.data ?? [])
  },
  platformAndUpdates: async (locale) => {
    const response = await getDataUpdateContent({ data: { locale } })
    return toDataUpdateItems(response?.data ?? [])
  },
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const cause = error.cause
    const causeCode =
      cause && typeof cause === 'object' && 'code' in cause ? String(cause.code) : undefined
    return causeCode ? `${error.message} (${causeCode})` : error.message
  }
  return String(error)
}

export function getHelpHubLocale(): Locale {
  return toContentLocale(getActiveI18nLanguage())
}

export const helpHubRouteCache = {
  staleTime: CMS_MAX_CACHE_AGE_MINUTES * 60 * 1000,
  preloadStaleTime: CMS_MAX_CACHE_AGE_MINUTES * 60 * 1000,
  gcTime: CMS_MAX_CACHE_AGE_MINUTES * 60 * 1000,
  loaderDeps: () => ({ locale: getHelpHubLocale() }),
}

export function loadHelpHubSection(
  sectionId: HelpHubSectionId,
  locale: Locale
): Promise<HelpHubSectionData> {
  return SECTION_FETCHERS[sectionId](locale)
    .then((items): HelpHubSectionData => ({ items }))
    .catch((error: unknown): HelpHubSectionData => {
      const message = toErrorMessage(error)
      console.warn(`Help Hub: could not load "${sectionId}" content: ${message}`)
      return { items: [], error: message }
    })
}

export async function loadHelpHubSections(locale: Locale): Promise<HelpHubSectionItems> {
  const entries = await Promise.all(
    HELP_HUB_SECTIONS.map(
      async (section) => [section.id, await loadHelpHubSection(section.id, locale)] as const
    )
  )
  return Object.fromEntries(entries) as HelpHubSectionItems
}
