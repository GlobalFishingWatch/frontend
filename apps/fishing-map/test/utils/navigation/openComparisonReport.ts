import { ROUTE_PATHS } from 'router/routes.utils'

import type { NavigationConfig } from './navigation-config'

export function navigateToComparisonReport(): NavigationConfig {
  return {
    to: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
    params: {
      category: 'fishing-activity',
      workspaceId: 'default-public',
      datasetId: 'public-eez-areas',
      areaId: '8361',
    },
    search: {
      longitude: -28.09249823,
      latitude: 38.48103761,
      zoom: 4.98397046,
      dataviewInstances: [{ id: 'context-layer-eez', config: { visible: true } }],
      bivariateDataviews: null,
      start: '2025-12-16T00:00:00.000Z',
      end: '2026-03-16T00:00:00.000Z',
      reportComparisonDataviewIds: {
        main: 'ais',
        compare: 'sentinel2__dataset-comparison',
      },
      reportActivityGraph: 'datasetComparison',
      reportCategory: 'activity',
    },
  }
}
