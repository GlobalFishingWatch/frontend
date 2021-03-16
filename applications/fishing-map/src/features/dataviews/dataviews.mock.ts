import { Dataview } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 99999,
    name: 'Vessel events',
    description: 'Vessel events',
    app: 'fishing-map',
    config: {
      type: 'VESSEL_EVENTS',
      color: '#F95E5E',
      filterByTypetype: null,
    },
    datasetsConfig: [
      {
        query: [
          {
            id: 'vessels',
            value: '7f28f657a-ac10-0579-de53-5e52207200a4',
          },
          // {
          //   id: 'wrapLongitudes',
          //   value: false,
          // },
          // {
          //   id: 'fields',
          //   value: 'lonlat,timestamp,speed',
          // },
          // {
          //   id: 'format',
          //   value: 'valueArray',
          // },
        ],
        params: [],
        endpoint: 'carriers-events',
        datasetId: 'global-port-events:v20201001',
      },
    ],
  },
]
export default dataviews
