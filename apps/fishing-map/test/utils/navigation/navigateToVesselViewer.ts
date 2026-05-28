import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

import type { NavigationConfig } from './navigation-config'

const VESSEL_VIEWER_SEARCH = {
  longitude: 28.5658211188976,
  latitude: 17.122983665325915,
  zoom: 1.388758970309439,
  vesselDatasetId: 'public-global-vessel-identity:v4.0',
  vesselIdentitySource: 'registryInfo',
  vesselRegistryId: '0821b07e716fbf183233ec819e3e626e',
  visibleEvents: ['loitering', 'encounter', 'port_visit', 'gaps'],
} as QueryParams

export function navigateToVesselViewer(): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE_VESSEL> {
  return {
    to: ROUTE_PATHS.WORKSPACE_VESSEL,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
      vesselId: '9827ea1ea-a120-f374-0cc6-138b38bd8130',
    },
    search: VESSEL_VIEWER_SEARCH,
  }
}
