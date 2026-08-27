import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToHelpHub(): NavigationConfig<typeof ROUTE_PATHS.HELP_HUB> {
  return {
    to: ROUTE_PATHS.HELP_HUB,
  }
}
