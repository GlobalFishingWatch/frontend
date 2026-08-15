import { ROUTE_PATHS } from 'router/routes.utils'

import type { HelpHubSectionSlug } from 'features/help/helpHub.content'

import type { NavigationConfig } from './navigation-config'

type HelpHubSectionParams = {
  sectionSlug?: HelpHubSectionSlug
  /** Omit to land on the section without a deep link, which makes the first topic the active one. */
  topicSlug?: string
}

export function navigateToHelpHubSection(
  params: HelpHubSectionParams = {}
): NavigationConfig<typeof ROUTE_PATHS.HELP_HUB_SECTION> {
  const { sectionSlug = 'tools-and-features', topicSlug } = params

  return {
    to: ROUTE_PATHS.HELP_HUB_SECTION,
    params: { sectionSlug, topicSlug },
  }
}
