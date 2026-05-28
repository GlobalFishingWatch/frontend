import { ROUTE_PATHS } from 'router/routes.utils'

import { USER_POLYGON_DATASET_ID } from '../fixtures'

import type { NavigationConfig } from './navigation-config'

export function navigateToPolygonEditor(): NavigationConfig<typeof ROUTE_PATHS.HOME> {
  return {
    to: ROUTE_PATHS.HOME,
    search: {
      dataviewInstances: [
        {
          id: 'user-polygons-1771416000000-1771416000000',
          config: { color: '#F95E5E' },
          dataviewId: 'default-context-layer',
          datasetsConfig: [
            {
              datasetId: USER_POLYGON_DATASET_ID,
              params: [],
              endpoint: 'context-tiles',
            },
          ],
        },
        { id: 'vms', config: { visible: false } },
        { id: 'ais', config: { visible: false } },
      ],
      bivariateDataviews: null,
      longitude: 26,
      latitude: 19,
      zoom: 1.49,
      mapDrawingEditId: USER_POLYGON_DATASET_ID,
      mapDrawing: 'polygons',
    },
  }
}
