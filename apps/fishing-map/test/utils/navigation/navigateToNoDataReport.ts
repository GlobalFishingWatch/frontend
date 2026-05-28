import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToNoDataReport(): NavigationConfig<
  typeof ROUTE_PATHS.WORKSPACE_REPORT_FULL
> {
  return {
    to: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
      datasetId: 'public-eez-areas',
      areaId: '8402',
    },
    search: {
      longitude: -64.8109861,
      latitude: 32.42313903,
      zoom: 5.44564202,
      dataviewInstances: [
        {
          id: 'context-layer-eez',
          config: {
            visible: true,
          },
        },
        {
          id: 'vms',
          deleted: true,
        },
      ],
      activityVisualizationMode: 'heatmap-low-res',
      bivariateDataviews: null,
    },
  }
}
