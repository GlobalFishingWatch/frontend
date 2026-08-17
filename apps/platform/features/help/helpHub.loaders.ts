import { HELP_HUB_SECTIONS } from 'features/help/helpHub.config'
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

type CacheEntry = { promise: Promise<HelpHubSectionData>; expiresAt: number }
const cache = new Map<string, CacheEntry>()

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

export function loadHelpHubSection(
  sectionId: HelpHubSectionId,
  locale: Locale
): Promise<HelpHubSectionData> {
  const key = `${sectionId}:${locale}`
  const cached = cache.get(key)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise
  }
  const promise = SECTION_FETCHERS[sectionId](locale)
    .then((items): HelpHubSectionData => ({ items }))
    .catch((error: unknown): HelpHubSectionData => {
      // Don't cache a failure, and don't fail the route: the pages render their own error state.
      cache.delete(key)
      const message = toErrorMessage(error)
      console.warn(`Help Hub: could not load "${sectionId}" content: ${message}`)
      return { items: [], error: message }
    })
  cache.set(key, { promise, expiresAt: Date.now() + CACHE_TTL_MS })
  return promise
}

export async function loadHelpHubSections(locale: Locale): Promise<HelpHubSectionItems> {
  const entries = await Promise.all(
    HELP_HUB_SECTIONS.map(
      async (section) => [section.id, await loadHelpHubSection(section.id, locale)] as const
    )
  )
  return Object.fromEntries(entries) as HelpHubSectionItems
}
