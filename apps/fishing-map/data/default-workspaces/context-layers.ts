import type { DataviewInstance } from '@globalfishingwatch/api-types'

import {
  EEZ_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_INSTANCE_ID,
  FAO_AREAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  MPA_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  PROTECTEDSEAS_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_INSTANCE_ID,
  RFMO_DATAVIEW_SLUG,
} from 'data/workspaces'

export const BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES: DataviewInstance[] = [
  {
    id: EEZ_DATAVIEW_INSTANCE_ID,
    config: {
      color: '#069688',
      visible: false,
    },
    dataviewId: EEZ_DATAVIEW_SLUG,
  },
  {
    id: MPA_DATAVIEW_INSTANCE_ID,
    config: {
      color: '#1AFF6B',
      visible: false,
    },
    dataviewId: MPA_DATAVIEW_SLUG,
  },
  {
    id: PROTECTEDSEAS_DATAVIEW_INSTANCE_ID,
    config: {
      visible: false,
    },
    dataviewId: PROTECTED_SEAS_DATAVIEW_SLUG,
  },
  {
    id: FAO_AREAS_DATAVIEW_INSTANCE_ID,
    config: {
      visible: false,
    },
    dataviewId: FAO_AREAS_DATAVIEW_SLUG,
  },
  {
    id: RFMO_DATAVIEW_INSTANCE_ID,
    config: {
      color: '#6b67e5',
      visible: false,
    },
    dataviewId: RFMO_DATAVIEW_SLUG,
  },
]

export const VESSEL_PROFILE_DATAVIEWS_INSTANCES = BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES.filter(
  (d) => d.id !== PROTECTEDSEAS_DATAVIEW_INSTANCE_ID
)
