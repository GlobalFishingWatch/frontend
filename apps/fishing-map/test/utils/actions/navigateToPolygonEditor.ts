import { USER_POLYGON_DATASET_ID } from 'test/utils/store/redux-store-test.data'

import { setLocation } from 'router/location.slice'
import { ROUTE_PATHS } from 'router/routes.utils'
import type { QueryParams } from 'types'

/**
 * Pre-built `location/setLocation` action that seeds Redux state to match the
 * home route with the user-polygon dataset open in the polygon editor.
 */
export const navigateToPolygonEditorAction = setLocation({
  type: 'HOME',
  payload: {},
  pathname: '/',
  to: ROUTE_PATHS.HOME,
  query: {
    dataviewInstances: [
      {
        id: 'user-polygons-1771416000000-1771416000000',
        config: {
          color: '#F95E5E',
        },
        dataviewId: 'default-context-layer',
        datasetsConfig: [
          {
            datasetId: USER_POLYGON_DATASET_ID,
            params: [],
            endpoint: 'context-tiles',
          },
        ],
      },
      {
        id: 'vms',
        config: {
          visible: false,
        },
      },
      {
        id: 'ais',
        config: {
          visible: false,
        },
      },
    ],
    bivariateDataviews: null,
    longitude: 26,
    latitude: 19,
    zoom: 1.49,
    mapDrawingEditId: USER_POLYGON_DATASET_ID,
    mapDrawing: 'polygons',
  } as unknown as QueryParams,
})
