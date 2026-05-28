import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToGlobalReport(): NavigationConfig<typeof ROUTE_PATHS.WORKSPACE_REPORT> {
  return {
    to: ROUTE_PATHS.WORKSPACE_REPORT,
    params: {
      category: 'reports',
      workspaceId: 'default-public',
    },
    search: {
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
    },
  }
}
