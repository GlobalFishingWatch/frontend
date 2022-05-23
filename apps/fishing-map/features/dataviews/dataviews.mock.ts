import { Dataview, DataviewCategory, EndpointId } from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import { SKYLIGHT_ENCOUNTERS_DATASET_ID } from 'features/datasets/datasets.mock'

export const SKYLIGHT_ENCOUNTERS_DATAVIEW_ID = 7777777

export const dataviews: Dataview[] = [
  {
    id: SKYLIGHT_ENCOUNTERS_DATAVIEW_ID,
    name: 'Encounters',
    description: 'Skylight integration for Rendezvous events',
    app: 'fishing-map',
    config: {
      type: GeneratorType.Points,
      color: '#FAE9A0',
    },
    infoConfig: null,
    category: DataviewCategory.RealTime,
    datasetsConfig: [
      {
        params: [],
        endpoint: EndpointId.ContextGeojson,
        datasetId: SKYLIGHT_ENCOUNTERS_DATASET_ID,
      },
    ],
    createdAt: '2021-03-22T15:36:44.423Z',
    updatedAt: '2021-10-21T10:28:20.207Z',
  },
]

export default dataviews
