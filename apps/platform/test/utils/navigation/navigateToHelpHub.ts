import { ROUTE_PATHS } from '@platform/config/routes'

import type { NavigationConfig } from './navigation-config'

export function navigateToHelpHub(): NavigationConfig<typeof ROUTE_PATHS.HELP_HUB> {
  return {
    to: ROUTE_PATHS.HELP_HUB,
  }
}
