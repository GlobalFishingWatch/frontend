import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * navigation to the workspace vessel-search route.
 */
export const navigateToVesselSearchAction = setLocation({
  type: 'WORKSPACE_SEARCH',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
  },
  pathname: '/fishing-activity/default-public/vessel-search',
  to: ROUTE_PATHS.WORKSPACE_SEARCH,
  query: {
    longitude: 26,
    latitude: 19,
    zoom: 1.49,
    lastTransmissionDate: '',
    firstTransmissionDate: '',
  } as QueryParams,
})
