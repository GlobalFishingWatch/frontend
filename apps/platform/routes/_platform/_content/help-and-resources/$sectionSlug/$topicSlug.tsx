import { createFileRoute } from '@tanstack/react-router'
import { startCase } from 'es-toolkit'

import HelpHubTopicContent from 'features/help/HelpHubTopicContent'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute(
  '/_platform/_content/help-and-resources/$sectionSlug/$topicSlug'
)({
  component: HelpHubTopicContent,
  // Derived from the slug so each topic URL gets a distinct title without a data fetch, following
  // the same approach as `lowerCase(params.category)` in the workspace route.
  // TODO use the real content title once a route loader fetches the topic.
  head: ({ params }) => getRouteHead({ category: startCase(params.topicSlug) }),
})
