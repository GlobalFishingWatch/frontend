import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import type {
  AssistantContextModule,
  AssistantPageMatch,
} from 'features/assistant/assistant-context'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.config'
import type {
  HelpHubArticleData,
  HelpHubItem,
  HelpHubSectionItems,
} from 'features/help/helpHub.types'

const toLink = ({ slug, title }: HelpHubItem) => ({ slug, title })

/**
 * /help-and-resources and its sections (assistant-context.config): the article open and the ones
 * listed, as slugs the agent links to.
 */
function getHelpPage(
  _deps: unknown,
  match: AssistantPageMatch
): AssistantContextToolOutput<'get_help_page'> {
  const sectionSlug = match.params.sectionSlug as string | undefined
  if (!sectionSlug) {
    const sections = match.loaderData as HelpHubSectionItems | undefined
    return {
      sections: HELP_HUB_SECTIONS.map(({ id, slug }) => ({
        slug,
        articles: sections?.[id]?.items.map(toLink) ?? [],
      })),
    }
  }
  const { item, index = [] } = (match.loaderData ?? {}) as Partial<HelpHubArticleData>
  return {
    section: sectionSlug,
    article: item && { ...toLink(item), description: item.description },
    sectionArticles: index.map(toLink),
  }
}

export const tools: AssistantContextModule['tools'] = { get_help_page: getHelpPage }
