import type { AssistantContextDeps, AssistantPageMatch } from 'features/assistant/assistant-context'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.config'
import type {
  HelpHubArticleData,
  HelpHubItem,
  HelpHubSectionItems,
} from 'features/help/helpHub.types'

const toLink = ({ slug, title }: HelpHubItem) => ({ slug, title })

/**
 * Assistant context for /help-and-resources and its sections (assistant-context.config): the
 * article open and the ones listed, as slugs the agent links to.
 */
export async function getContext(_deps: AssistantContextDeps, match: AssistantPageMatch) {
  const sectionSlug = match.params.sectionSlug as string | undefined
  if (!sectionSlug) {
    const sections = match.loaderData as HelpHubSectionItems | undefined
    return {
      page: {
        type: 'help-and-resources' as const,
        sections: HELP_HUB_SECTIONS.map(({ id, slug }) => ({
          slug,
          articles: sections?.[id]?.items.map(toLink) ?? [],
        })),
      },
    }
  }
  const { item, index = [] } = (match.loaderData ?? {}) as Partial<HelpHubArticleData>
  return {
    page: {
      type: 'help-and-resources' as const,
      section: sectionSlug,
      article: item && { ...toLink(item), description: item.description },
      sectionArticles: index.map(toLink),
    },
  }
}

export type HelpAssistantContext = Awaited<ReturnType<typeof getContext>>
