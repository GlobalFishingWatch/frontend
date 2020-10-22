/* eslint-disable @typescript-eslint/camelcase */
import { Workspace } from '@globalfishingwatch/api-types'
export const FISHING_DATASET_ID = 'fishing_v4'
export const TRACKS_DATASET_ID = 'fishing-tracks:v20200507'
export const VESSELS_DATASET_ID = 'test-alias-import-vessels-pipeline:latest'

// TODO use only types and remove the above ids
export const FISHING_DATASET_TYPE = '4wings:v1'
export const TRACKS_DATASET_TYPE = 'carriers-tracks:v1'
export const VESSELS_DATASET_TYPE = 'carriers-vessels:v1'
export const USER_CONTEXT_TYPE = 'user-context-layer:v1'

const workspace: Workspace = {
  id: 1,
  name: 'Default public Fishing Map workspace',
  description: '',
  viewport: {
    zoom: 3.2,
    latitude: 17,
    longitude: -10,
  },
  startAt: '2018-01-01T00:00:00.000Z',
  endAt: '2019-12-31T00:00:00.000Z',
  // TODO: if a dataview is using a dataset not included here we have to fetch it
  datasets: [{ id: FISHING_DATASET_ID }, { id: TRACKS_DATASET_ID }, { id: VESSELS_DATASET_ID }],
  // TODO: same with dataviewInstances using dataviews not included here
  dataviews: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  // We need to "instanciate" every dataview we want to use in the workspace
  // think as same model than mapbox-gl with source (dataview) and layer (dataviewIntance)
  dataviewInstances: [
    {
      id: 'basemap',
      dataviewId: 2,
    },
    {
      id: 'fishing-1',
      dataviewId: 3,
      config: {
        filters: ['ESP'],
      },
    },
    {
      id: 'fishing-2',
      dataviewId: 3,
      config: {
        color: '#ff0000',
        colorRamp: 'red',
        filters: ['FRA'],
      },
    },
    {
      id: 'vessel-1',
      dataviewId: 4,
      config: {
        color: '#F95E5E',
      },
      datasetsConfig: [
        {
          datasetId: TRACKS_DATASET_ID,
          params: [{ id: 'vesselId', value: '00ba29183-3b86-9e36-cf20-ee340e409521' }],
          endpoint: 'carriers-tracks',
        },
        {
          datasetId: VESSELS_DATASET_ID,
          params: [{ id: 'vesselId', value: '00ba29183-3b86-9e36-cf20-ee340e409521' }],
          endpoint: 'carriers-vessel',
        },
      ],
    },
    // {
    //   id: 'vessel-2',
    //   dataviewId: 4,
    //   config: {
    //     color: '#FFAAAD',
    //   },
    //   datasetsConfig: [
    //     {
    //       datasetId: TRACKS_DATASET_ID,
    //       params: [{ id: 'vesselId', value: '0017a7b68-87c4-5af4-c46e-5bebee3ddceb' }],
    //       endpoint: 'carriers-tracks',
    //     },
    //     {
    //       datasetId: VESSELS_DATASET_ID,
    //       params: [{ id: 'vesselId', value: '0017a7b68-87c4-5af4-c46e-5bebee3ddceb' }],
    //       endpoint: 'carriers-vessel',
    //     },
    //   ],
    // },
    {
      id: 'context-layer-1',
      dataviewId: 5,
      config: {
        color: '#069688',
      },
    },
  ],
}

export default workspace
