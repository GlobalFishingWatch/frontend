import { createFileRoute } from '@tanstack/react-router'

import HelpHubSectionOverview from 'features/help/HelpHubSectionOverview'

export const Route = createFileRoute('/_platform/_content/help-and-resources/$sectionSlug/')({
  component: HelpHubSectionOverview,
})
