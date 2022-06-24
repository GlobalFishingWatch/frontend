import { Dataview, DataviewCategory, EndpointId } from '@globalfishingwatch/api-types'
import { GeneratorType } from '@globalfishingwatch/layer-composer'
import {
  SKYLIGHT_ENCOUNTERS_DATASET_ID,
  SKYLIGHT_FISHING_DATASET_ID,
  SKYLIGHT_LOITERING_DATASET_ID,
} from 'features/datasets/datasets.mock'

export const SKYLIGHT_ENCOUNTERS_DATAVIEW_ID = 7777777
export const SKYLIGHT_LOITERING_DATAVIEW_ID = 888888
export const SKYLIGHT_FISHING_DATAVIEW_ID = 999999

export const dataviews: Dataview[] = [
  {
    id: SKYLIGHT_ENCOUNTERS_DATAVIEW_ID,
    slug: 'skylight-standard-rendezvous',
    name: 'Standard Rendezvous',
    description: 'Skylight integration for Double Rendezvous events',
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
  },
  {
    id: SKYLIGHT_LOITERING_DATAVIEW_ID,
    slug: 'skylight-dark-rendezvous',
    name: 'Dark Rendezvous',
    description: 'Skylight integration for Dark Rendezvous events',
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
        datasetId: SKYLIGHT_LOITERING_DATASET_ID,
      },
    ],
  },
  {
    id: SKYLIGHT_FISHING_DATAVIEW_ID,
    slug: 'skylight-fishing-events',
    name: 'Fishing events',
    description: 'Skylight integration for fishing events',
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
        datasetId: SKYLIGHT_FISHING_DATASET_ID,
      },
    ],
  },
]

export default dataviews
