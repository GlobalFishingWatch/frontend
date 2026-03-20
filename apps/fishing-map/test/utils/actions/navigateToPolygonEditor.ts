import { USER_POLYGON_DATASET_ID } from 'test/utils/store/redux-store-test.data'

export const navigateToPolygonEditorAction = {
  type: 'HOME',
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
  },
  payload: {},
  replaceQuery: false,
  replaceUrl: false,
  isHistoryNavigation: false,
  skipHistoryNavigation: false,
  meta: {
    location: {
      current: {
        pathname: '/index',
        type: 'HOME',
        payload: {},
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
        },
        search:
          'dvIn[0][id]=user-polygons-1771416000000-1771416000000&dvIn[0][cfg][clr]=%23F95E5E&dvIn[0][dvId]=default-context-layer&dvIn[0][dsC][0][dsId]=~0&dvIn[0][dsC][0][ept]=context-tiles&dvIn[1][id]=vms&dvIn[1][cfg][vis]=false&dvIn[2][id]=ais&dvIn[2][cfg][vis]=false&bDV&longitude=26&latitude=19&zoom=1.49&mapDrawingEditId=~0&mapDrawing=polygons&tk[0]=public-hawaii-1771993699463',
      },
      prev: {
        pathname: '/index',
        type: 'HOME',
        payload: {},
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
        },
        search:
          'dvIn[0][id]=user-polygons-1771416000000-1771416000000&dvIn[0][cfg][clr]=%23F95E5E&dvIn[0][dvId]=default-context-layer&dvIn[0][dsC][0][dsId]=~0&dvIn[0][dsC][0][ept]=context-tiles&dvIn[1][id]=vms&dvIn[1][cfg][vis]=false&dvIn[2][id]=ais&dvIn[2][cfg][vis]=false&bDV&longitude=26&latitude=19&zoom=1.49&mapDrawingEditId=~0&tk[0]=public-hawaii-1771993699463',
      },
      kind: 'push',
    },
  },
}
