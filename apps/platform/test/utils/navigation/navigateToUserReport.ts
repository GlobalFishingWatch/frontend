import { ROUTE_PATHS } from 'router/routes.utils'
import { UserTab } from 'types'

import type { NavigationConfig } from './navigation-config'

export function navigateToUserReportsTab(): NavigationConfig<typeof ROUTE_PATHS.USER> {
  return {
    to: ROUTE_PATHS.USER,
    search: (prev: Record<string, unknown>) => ({
      ...prev,
      userTab: UserTab.Reports,
    }),
  }
}

export function navigateToUserReport(
  reportId: string
): NavigationConfig<typeof ROUTE_PATHS.REPORT> {
  return {
    to: ROUTE_PATHS.REPORT,
    params: { reportId },
    search: (prev: Record<string, unknown>) => ({
      ...prev,
      userTab: UserTab.Reports,
    }),
  }
}
