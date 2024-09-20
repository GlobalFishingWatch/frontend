import { Dataview, DataviewType, DataviewCategory, EndpointId } from '@globalfishingwatch/api-types'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
} from 'data/workspaces'

const dataviews: Dataview[] = [
  {
    id: 11111111,
    name: 'Encounter cluster events pipe 3',
    slug: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    app: 'fishing-map',
    config: {
      type: 'FOURWINGS_TILE_CLUSTER',
      color: '#FAE9A0',
      clusterMaxZoomLevels: {
        default: 6,
      },
    },
    datasetsConfig: [
      {
        filters: {
          encounter_type: ['FISHING-CARRIER', 'FISHING-SUPPORT'],
        },
        params: [],
        endpoint: 'events-cluster-tiles',
        datasetId: 'public-global-encounters-events:v3.0',
      },
    ],
    description: 'Encounter cluster events',
    createdAt: '2024-05-16T08:21:11.723Z',
    updatedAt: '2024-05-16T08:21:11.723Z',
    category: DataviewCategory.Events,
  },
  {
    id: 22222222,
    name: 'Loitering cluster events pipe 3',
    slug: CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
    app: 'fishing-map',
    config: {
      type: 'FOURWINGS_TILE_CLUSTER',
      color: '#CEA9F9',
      clusterMaxZoomLevels: {
        default: 6,
      },
    },
    datasetsConfig: [
      {
        filters: {},
        params: [],
        endpoint: 'events-cluster-tiles',
        datasetId: 'public-global-loitering-events:v3.0',
      },
    ],
    description: 'Loitering cluster events',
    createdAt: '2024-05-16T08:21:11.723Z',
    updatedAt: '2024-05-16T08:21:11.723Z',
    category: DataviewCategory.Events,
  },
  {
    id: 33333333,
    name: 'Port visits cluster events pipe 3',
    slug: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
    app: 'fishing-map',
    config: {
      type: 'FOURWINGS_TILE_CLUSTER',
      color: '#9AEEFF',
      clusterMaxZoomLevels: {
        country: 3,
        // port: 6,
        default: 8,
      },
    },
    datasetsConfig: [
      {
        params: [],
        filters: {
          confidence: 2,
        },
        endpoint: 'events-cluster-tiles',
        datasetId: 'public-global-port-visits-events:v3.0',
      },
    ],
    description: 'Por visit cluster events',
    createdAt: '2024-05-16T08:21:11.723Z',
    updatedAt: '2024-05-16T08:21:11.723Z',
    category: DataviewCategory.Events,
  },
]

export default dataviews
