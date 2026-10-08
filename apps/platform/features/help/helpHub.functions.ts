import { createServerFn } from '@tanstack/react-start'

import { getDataUpdateContent } from 'features/cms/data-update.functions'
import { getUseCaseContent } from 'features/cms/use-case.functions'
import { getUserGuideContent } from 'features/cms/user-guide.functions'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.config'
import type {
  HelpHubArticleData,
  HelpHubFetchOptions,
  HelpHubItem,
  HelpHubSectionData,
  HelpHubSectionId,
  HelpHubSectionItems,
} from 'features/help/helpHub.types'
import { toDataUpdateItems, toUseCaseItems, toUserGuideItems } from 'features/help/helpHub.utils'
import type { Locale } from 'types'

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

function loadHelpHubSection(
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

async function loadHelpHubSections(locale: Locale): Promise<HelpHubSectionItems> {
  const entries = await Promise.all(
    HELP_HUB_SECTIONS.map(
      async (section) =>
        [section.id, await loadHelpHubSection(section.id, locale, { variant: 'card' })] as const
    )
  )
  return Object.fromEntries(entries) as HelpHubSectionItems
}

async function loadHelpHubArticle(
  sectionId: HelpHubSectionId,
  locale: Locale,
  itemSlug?: string
): Promise<HelpHubArticleData> {
  const [index, article] = await Promise.all([
    loadHelpHubSection(sectionId, locale, { variant: 'index' }),
    loadHelpHubSection(sectionId, locale, itemSlug ? { slug: itemSlug } : { first: true }),
  ])
  return {
    index: index.items,
    item: article.items[0],
    error: index.error ?? article.error,
  }
}

export const getHelpHubSectionsContent = createServerFn({ method: 'GET' })
  .validator((params: { locale: Locale }) => params)
  .handler(({ data: { locale } }): Promise<HelpHubSectionItems> => loadHelpHubSections(locale))

export const getHelpHubArticleContent = createServerFn({ method: 'GET' })
  .validator((params: { sectionId: HelpHubSectionId; locale: Locale; itemSlug?: string }) => params)
  .handler(({ data: { sectionId, locale, itemSlug } }): Promise<HelpHubArticleData> =>
    loadHelpHubArticle(sectionId, locale, itemSlug)
  )
