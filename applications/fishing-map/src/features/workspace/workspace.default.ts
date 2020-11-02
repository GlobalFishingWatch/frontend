import { Workspace } from '@globalfishingwatch/api-types'

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
      dataviewId: 91,
    },
    {
      id: 'fishing-2',
      config: {
        color: '#ff0000',
        filters: ['FRA'],
        colorRamp: 'red',
      },
      dataviewId: 91,
    },
    {
      id: 'vessel-1',
      config: {
        color: '#F95E5E',
      },
      dataviewId: 92,
      datasetsConfig: [
        {
          params: [
            {
              id: 'vesselId',
              value: '00ba29183-3b86-9e36-cf20-ee340e409521',
            },
          ],
          endpoint: 'carriers-tracks',
          datasetId: 'fishing-tracks:v20200507',
        },
        {
          params: [
            {
              id: 'vesselId',
              value: '00ba29183-3b86-9e36-cf20-ee340e409521',
            },
          ],
          endpoint: 'carriers-vessel',
          datasetId: 'test-alias-import-vessels-pipeline:latest',
        },
      ],
    },
    {
      id: 'context-layer-1',
      config: {
        color: '#069688',
        visible: false,
      },
      dataviewId: 93,
    },
  ],
  dataviews: [],
}

export default workspace
