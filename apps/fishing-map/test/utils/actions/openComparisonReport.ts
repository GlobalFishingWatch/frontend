import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match a
 * comparison report workspace at the public Azores EEZ area.
 */
export const openComparisonReport = setLocation({
  type: 'WORKSPACE_REPORT',
  payload: {
    category: 'fishing-activity',
    workspaceId: 'default-public',
    datasetId: 'public-eez-areas',
    areaId: '8361',
  },
  pathname: '/fishing-activity/default-public/report/public-eez-areas/8361',
  to: ROUTE_PATHS.WORKSPACE_REPORT_FULL,
  query: {
    longitude: -28.09249823,
    latitude: 38.48103761,
    zoom: 4.98397046,
    dataviewInstances: [
      {
        id: 'context-layer-eez',
        config: {
          visible: true,
        },
      },
    ],
    bivariateDataviews: null,
    start: '2025-12-16T00:00:00.000Z',
    end: '2026-03-16T00:00:00.000Z',
    reportComparisonDataviewIds: {
      main: 'ais',
      compare: 'sentinel2__dataset-comparison',
    },
    reportActivityGraph: 'datasetComparison',
    reportCategory: 'activity',
  } as unknown as QueryParams,
})
