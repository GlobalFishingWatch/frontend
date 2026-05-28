import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToUserReportsTab(): NavigationConfig {
  return {
    to: ROUTE_PATHS.USER,
    search: (prev) => ({
      ...prev,
      userTab: 'reports',
    }),
  }
}

export function navigateToUserReport(reportId: string): NavigationConfig {
  return {
    to: ROUTE_PATHS.REPORT,
    params: { reportId },
    search: (prev) => ({
      ...prev,
      userTab: 'reports',
    }),
  }
}
