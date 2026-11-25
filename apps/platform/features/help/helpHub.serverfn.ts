import { createServerFn } from '@tanstack/react-start'

import { loadHelpHubArticle, loadHelpHubSections } from 'features/help/helpHub.content'
import type {
  HelpHubArticleData,
  HelpHubSectionId,
  HelpHubSectionItems,
} from 'features/help/helpHub.types'
import type { Locale } from 'types'

export const getHelpHubSectionsContent = createServerFn({ method: 'GET' })
  .validator((params: { locale: Locale }) => params)
  .handler(({ data: { locale } }): Promise<HelpHubSectionItems> => loadHelpHubSections(locale))

export const getHelpHubArticleContent = createServerFn({ method: 'GET' })
  .validator((params: { sectionId: HelpHubSectionId; locale: Locale; itemSlug?: string }) => params)
  .handler(({ data: { sectionId, locale, itemSlug } }): Promise<HelpHubArticleData> =>
    loadHelpHubArticle(sectionId, locale, itemSlug)
  )
