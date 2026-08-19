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

/** The article page needs one full item plus a bodyless index; the landing page needs neither. */
export type HelpHubFetchOptions = { slug?: string; index?: boolean }

export type HelpHubArticleData = {
  index: HelpHubItem[]
  item?: HelpHubItem
  error?: string
}

const SECTION_FETCHERS: Record<
  HelpHubSectionId,
  (locale: Locale, options?: HelpHubFetchOptions) => Promise<HelpHubItem[]>
> = {
  toolsAndFeatures: async (locale, options) => {
    const response = await getUserGuideContent({ data: { locale, ...options } })
    return toUserGuideItems(response?.data ?? [])
  },
  useCases: async (locale, options) => {
    const response = await getUseCaseContent({ data: { locale, ...options } })
    return toUseCaseItems(response?.data ?? [])
  },
  platformAndUpdates: async (locale, options) => {
    const response = await getDataUpdateContent({ data: { locale, ...options } })
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
  locale: Locale,
  options?: HelpHubFetchOptions
): Promise<HelpHubSectionData> {
  return SECTION_FETCHERS[sectionId](locale, options)
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

export async function loadHelpHubArticle(
  sectionId: HelpHubSectionId,
  locale: Locale,
  itemSlug?: string
): Promise<HelpHubArticleData> {
  const [index, requested] = await Promise.all([
    loadHelpHubSection(sectionId, locale, { index: true }),
    itemSlug ? loadHelpHubSection(sectionId, locale, { slug: itemSlug }) : undefined,
  ])
  // Section root falls back to the first article, whose slug only exists once the index is in.
  const firstSlug = index.items[0]?.slug
  const article =
    requested ??
    (firstSlug ? await loadHelpHubSection(sectionId, locale, { slug: firstSlug }) : undefined)
  return {
    index: index.items,
    item: article?.items[0],
    error: index.error ?? article?.error,
  }
}
