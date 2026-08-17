import type { HelpHubSectionSlug } from 'features/help/helpHub.types'
import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

type HelpHubSectionParams = {
  sectionSlug?: HelpHubSectionSlug
  /** Omit to land on the section without a deep link, which makes the first item the active one. */
  itemSlug?: string
}

export function navigateToHelpHubSection(
  params: HelpHubSectionParams = {}
): NavigationConfig<typeof ROUTE_PATHS.HELP_HUB_SECTION> {
  const { sectionSlug = 'tools-and-features', itemSlug } = params

  return {
    to: ROUTE_PATHS.HELP_HUB_SECTION,
    params: { sectionSlug, itemSlug },
  }
}
