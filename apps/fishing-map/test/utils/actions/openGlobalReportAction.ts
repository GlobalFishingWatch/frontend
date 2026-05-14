import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * navigation to the global reports workspace.
 */
export const openGlobalReportAction = setLocation({
  type: 'WORKSPACE_REPORT',
  payload: {
    category: 'reports',
    workspaceId: 'default-public',
  },
  pathname: '/reports/default-public/report',
  to: ROUTE_PATHS.WORKSPACE_REPORT,
  query: {
    longitude: 0,
    latitude: 0,
    zoom: 0,
    dataviewInstances: [
      { id: 'ais', origin: 'report', config: { visible: true } },
      { id: 'vms', origin: 'report', config: { visible: true } },
      { id: 'presence', origin: 'report', config: { visible: true } },
      { id: 'sar', origin: 'report', config: { visible: true } },
      { id: 'sentinel2', origin: 'report', config: { visible: true } },
      { id: 'viirs', origin: 'report', config: { visible: true } },
      { id: 'encounters', origin: 'report', config: { visible: true } },
      { id: 'loitering', origin: 'report', config: { visible: true } },
      { id: 'port-visits', origin: 'report', config: { visible: true } },
    ],
    reportCategory: 'events',
    reportLoadVessels: false,
    timebarVisualisation: 'events',
  } as unknown as QueryParams,
})
