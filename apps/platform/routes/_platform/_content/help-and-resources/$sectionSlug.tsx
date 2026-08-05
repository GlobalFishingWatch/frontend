import { createFileRoute, redirect } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { findHelpHubSection } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import HelpHubSectionLayout from 'features/help/HelpHubSectionLayout'
import { getRouteHead } from 'router/router.meta'

export const Route = createFileRoute('/_platform/_content/help-and-resources/$sectionSlug')({
  component: HelpHubSectionLayout,
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
    return getRouteHead({ category: title, description })
  },
})
