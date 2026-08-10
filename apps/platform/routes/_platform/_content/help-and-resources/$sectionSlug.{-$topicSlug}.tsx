import { createFileRoute, redirect } from '@tanstack/react-router'
import { startCase } from 'es-toolkit'

import { ROUTE_PATHS } from '@platform/config/routes'

import { findHelpHubSection } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import HelpHubSectionPage from 'features/help/HelpHubSectionPage'
import { buildCanonicalUrl, getRouteHead } from 'router/router.meta'

/**
 * One route serves both `/help-and-resources/$sectionSlug` and `.../$topicSlug`. The optional param
 * keeps it a single match, so scroll-driven URL changes swap params on a mounted component instead
 * of remounting it and throwing away the reader's scroll position.
 */
export const Route = createFileRoute(
  '/_platform/_content/help-and-resources/$sectionSlug/{-$topicSlug}'
)({
  component: HelpHubSectionPage,
  beforeLoad: ({ params }) => {
    if (!findHelpHubSection(params.sectionSlug)) {
      throw redirect({ to: ROUTE_PATHS.HELP_HUB, replace: true, statusCode: 308 })
    }
  },
  head: ({ params }) => {
    const section = findHelpHubSection(params.sectionSlug)
    if (!section) {
      return getRouteHead()
    }
    const { title, description } = getHelpHubSectionCopy(section.id)
    return {
      // TODO use the real content title once a loader fetches the topic.
      ...getRouteHead({
        category: params.topicSlug ? startCase(params.topicSlug) : title,
        description,
      }),
      links: [
        {
          rel: 'canonical',
          href: buildCanonicalUrl(`/help-and-resources/${section.slug}`),
        },
      ],
    }
  },
})
