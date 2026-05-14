import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * navigation to a private report.
 */
export const navigateToPrivateWorkspace = setLocation({
  type: 'REPORT',
  payload: {
    reportId: 'report_02-user',
  },
  pathname: '/report/report_02-user',
  to: ROUTE_PATHS.REPORT,
  query: {
    longitude: 0,
    latitude: 0,
    zoom: 0.39767463,
  } as QueryParams,
})
