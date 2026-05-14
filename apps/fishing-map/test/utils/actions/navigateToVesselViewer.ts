import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * navigation to a workspace vessel viewer.
 */
export const navigateToVesselViewerAction = setLocation({
  type: 'WORKSPACE_VESSEL',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
    vesselId: '9827ea1ea-a120-f374-0cc6-138b38bd8130',
  },
  pathname: '/fishing-activity/default-public/vessel/9827ea1ea-a120-f374-0cc6-138b38bd8130',
  to: ROUTE_PATHS.WORKSPACE_VESSEL,
  query: {
    longitude: 28.5658211188976,
    latitude: 17.122983665325915,
    zoom: 1.388758970309439,
    vesselDatasetId: 'public-global-vessel-identity:v4.0',
    vesselIdentitySource: 'registryInfo',
    vesselRegistryId: '0821b07e716fbf183233ec819e3e626e',
    visibleEvents: ['loitering', 'encounter', 'port_visit', 'gaps'],
  } as QueryParams,
})
