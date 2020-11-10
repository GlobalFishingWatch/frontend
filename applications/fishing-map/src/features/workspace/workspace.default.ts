import { Workspace } from '@globalfishingwatch/api-types'
import { DEFAULT_FISHING_DATAVIEW_ID, DEFAULT_VESSEL_DATAVIEW_ID } from 'data/datasets'

const workspace: Workspace = {
  id: 31,
  name: 'Default public Fishing Map workspace',
  description: '',
  startAt: new Date(2019, 0).toISOString(),
  endAt: new Date(2020, 0).toISOString(),
  viewport: {
    zoom: 4.4,
    latitude: 43,
    longitude: -3,
  },
  datasets: [{ id: 'test-alias-import-vessels-pipeline:latest' }],
  dataviewInstances: [
    {
      id: 'basemap',
      dataviewId: 90,
    },
    {
      id: 'fishing-1',
      config: {
        // filters: ['ESP'],
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'fishing-2',
      config: {
        color: '#FF64CE',
        filters: ['FRA'],
        colorRamp: 'magenta',
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    // {
    //   id: 'vessel-1',
    //   config: {
    //     color: '#F95E5E',
    //     visible: false,
    //   },
    //   dataviewId: DEFAULT_VESSEL_DATAVIEW_ID,
    //   datasetsConfig: [
    //     {
    //       params: [
    //         {
    //           id: 'vesselId',
    //           value: '00ba29183-3b86-9e36-cf20-ee340e409521',
    //         },
    //       ],
    //       endpoint: 'carriers-tracks',
    //       datasetId: 'fishing-tracks:v20200507',
    //     },
    //     {
    //       params: [
    //         {
    //           id: 'vesselId',
    //           value: '00ba29183-3b86-9e36-cf20-ee340e409521',
    //         },
    //       ],
    //       endpoint: 'carriers-vessel',
    //       datasetId: 'test-alias-import-vessels-pipeline:latest',
    //     },
    //   ],
    // },
    // {
    //   id: 'context-layer-1',
    //   config: {
    //     color: '#069688',
    //     visible: false,
    //   },
    //   dataviewId: 93,
    // },
    {
      id: 'context-layer-1',
      config: {
        color: '#069688',
        visible: true,
      },
      dataviewId: 94,
    },
  ],
  dataviews: [],
}

export default workspace
