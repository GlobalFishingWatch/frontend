import type { DataviewInstance } from '@globalfishingwatch/api-types'

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

export const REPORT_EVENTS_DATAVIEW_INSTANCES: DataviewInstance[] = [
  {
    id: ENCOUNTER_EVENTS_SOURCE_ID,
    dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
    config: {
      visible: false,
    },
  },
  {
    id: LOITERING_EVENTS_SOURCE_ID,
    dataviewId: CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
    config: {
      visible: false,
    },
  },
  {
    id: PORT_VISITS_EVENTS_SOURCE_ID,
    dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
    config: {
      visible: false,
    },
  },
]
