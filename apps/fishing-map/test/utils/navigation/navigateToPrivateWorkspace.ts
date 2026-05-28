import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToPrivateWorkspace(): NavigationConfig<typeof ROUTE_PATHS.REPORT> {
  return {
    to: ROUTE_PATHS.REPORT,
    params: {
      reportId: 'report_02-user',
    },
    search: {
      longitude: 0,
      latitude: 0,
      zoom: 0.39767463,
    },
  }
}
