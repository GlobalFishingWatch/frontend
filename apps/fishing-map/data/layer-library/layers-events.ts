import { IS_PRODUCTION_WORKSPACE_ENV, PATH_BASENAME } from 'data/config'
import type { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
} from 'data/workspaces'
import {
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'

export const LAYERS_LIBRARY_EVENTS: LibraryLayerConfig[] = [
  {
    id: ENCOUNTER_EVENTS_SOURCE_ID,
    dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/encounters.jpg`,
    config: {
      color: '#FAE9A0',
      // TODO remove this when removing the selectIsGlobalReportsEnabled feature flag
      eventsTemporalAggregation: IS_PRODUCTION_WORKSPACE_ENV,
    },
  },
  {
    id: LOITERING_EVENTS_SOURCE_ID,
    dataviewId: CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/loitering.jpg`,
    config: {
      color: '#CEA9F9',
      // TODO remove this when removing the selectIsGlobalReportsEnabled feature flag
      eventsTemporalAggregation: IS_PRODUCTION_WORKSPACE_ENV,
    },
    onlyGFWUser: true,
  },
  {
    id: PORT_VISITS_EVENTS_SOURCE_ID,
    dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/port-visits.jpg`,
    config: {
      color: '#9AEEFF',
      // TODO remove this when removing the selectIsGlobalReportsEnabled feature flag
      eventsTemporalAggregation: IS_PRODUCTION_WORKSPACE_ENV,
    },
  },
]

export const LAYER_LIBRARY_EVENTS_IDS = LAYERS_LIBRARY_EVENTS.map((layer) => layer.id)
