import type { HelpHubSectionId } from 'features/help/helpHub.content'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.content'
import type { HelpHubItem } from 'features/help/helpHub.types'
import { toDataUpdateItems, toUseCaseItems, toUserGuideItems } from 'features/help/helpHub.utils'
import { getActiveI18nLanguage } from 'features/i18n/i18n'
import type { Locale } from 'types'

export type HelpHubSectionItems = Record<HelpHubSectionId, HelpHubItem[]>

const SECTION_FETCHERS: Record<HelpHubSectionId, (locale: Locale) => Promise<HelpHubItem[]>> = {
  toolsAndFeatures: async (locale) => {
    const { getUserGuideContent } = await import('features/cms/loaders/user-guide')
    const response = await getUserGuideContent({ data: { locale } })
    return toUserGuideItems(response?.data ?? [])
  },
  useCases: async (locale) => {
    const { getUseCaseContent } = await import('features/cms/loaders/use-case')
    const response = await getUseCaseContent({ data: { locale } })
    return toUseCaseItems(response?.data ?? [])
  },
  platformAndUpdates: async (locale) => {
    const { getDataUpdateContent } = await import('features/cms/loaders/data-update')
    const response = await getDataUpdateContent({ data: { locale } })
    return toDataUpdateItems(response?.data ?? [])
  },
}

const CACHE_TTL_MS = 5 * 60 * 1000

type CacheEntry = { promise: Promise<HelpHubItem[]>; expiresAt: number }
const cache = new Map<string, CacheEntry>()

function fetchSectionItems(sectionId: HelpHubSectionId, locale: Locale): Promise<HelpHubItem[]> {
  const key = `${sectionId}:${locale}`
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise
  }
  const promise = SECTION_FETCHERS[sectionId](locale).catch((error) => {
    // Don't cache a failure, and don't fail the route: the pages render their own empty state.
    cache.delete(key)
    console.warn(`Help Hub: could not load "${sectionId}" content`, error)
    return [] as HelpHubItem[]
  })
  cache.set(key, { promise, expiresAt: Date.now() + CACHE_TTL_MS })
  return promise
}

export function getHelpHubLocale(): Locale {
  return getActiveI18nLanguage() as Locale
}

export function loadHelpHubSection(
  sectionId: HelpHubSectionId,
  locale: Locale
): Promise<HelpHubItem[]> {
  return fetchSectionItems(sectionId, locale)
}

export async function loadHelpHubSections(locale: Locale): Promise<HelpHubSectionItems> {
  const entries = await Promise.all(
    HELP_HUB_SECTIONS.map(
      async (section) => [section.id, await fetchSectionItems(section.id, locale)] as const
    )
  )
  return Object.fromEntries(entries) as HelpHubSectionItems
}
