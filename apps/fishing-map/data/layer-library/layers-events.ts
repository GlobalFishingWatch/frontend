import { PATH_BASENAME } from 'data/config'
import { LibraryLayerConfig } from 'data/layer-library/layers.types'
import {
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
} from 'data/workspaces'

export const LAYERS_LIBRARY_EVENTS: LibraryLayerConfig[] = [
  {
    id: 'encounters',
    dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/encounters.jpg`,
    config: {
      color: '#FAE9A0',
    },
  },
  {
    id: 'loitering',
    dataviewId: CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/loitering.jpg`,
    config: {
      color: '#CEA9F9',
    },
  },
  {
    id: 'port-visits',
    dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
    previewImageUrl: `${PATH_BASENAME}/images/layer-library/port-visits.jpg`,
    config: {
      color: '#9AEEFF',
    },
  },
]
