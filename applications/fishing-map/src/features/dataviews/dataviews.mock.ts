import { Dataview, DataviewCategory } from '@globalfishingwatch/api-types/dist'

export const dataviews: Dataview[] = [
  {
    id: 1,
    name: 'Sea surface temperature for Palau',
    description:
      'The NOAA 1/4° daily Optimum Interpolation Sea Surface Temperature (or daily OISST) is an analysis constructed by combining observations from different platforms (satellites, ships, buoys, and Argo floats) on a regular global grid. A spatially complete SST map is produced by interpolating to fill in gaps. The methodology includes bias adjustment of satellite and ship observations (referenced to buoys) to compensate for platform differences and sensor biases.',
    app: 'fishing-map',
    config: {
      type: 'HEATMAP_ANIMATED',
      color: '#ff0000',
      colorRamp: 'red',
      breaks: [28, 28.4, 28.6, 28.8, 29, 29.3, 29.6, 30],
      interval: 'month',
    },
    category: DataviewCategory.Environment,
    datasetsConfig: [
      {
        params: [
          {
            id: 'type',
            value: 'heatmap',
          },
        ],
        endpoint: '4wings-tiles',
        datasetId: 'fd-water-temperature-palau-v2',
      },
    ],
    createdAt: '2021-02-18T17:33:36.198Z',
    updatedAt: '2021-02-18T17:33:36.198Z',
  },
]
export default dataviews
