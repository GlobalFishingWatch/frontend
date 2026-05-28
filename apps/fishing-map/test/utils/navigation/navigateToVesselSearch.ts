import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import type { NavigationConfig } from './navigation-config'

export function navigateToVesselSearch(
  searchOverrides: Partial<QueryParams> = {}
): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE_SEARCH> {
  return {
    to: ROUTE_PATHS.WORKSPACE_SEARCH,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
    },
    search: {
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      lastTransmissionDate: '',
      firstTransmissionDate: '',
      ...searchOverrides,
    },
  }
}
