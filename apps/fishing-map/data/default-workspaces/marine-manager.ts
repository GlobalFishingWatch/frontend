import {
  MPA_DATAVIEW_ID,
  MPA_DATAVIEW_INSTANCE_ID,
  GLOBAL_CHLOROPHYL_DATAVIEW_ID,
  GLOBAL_SALINITY_DATAVIEW_ID,
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_ID,
} from 'data/workspaces'

export const WIZARD_TEMPLATE_ID = 'wizard_template-public'

export const MARINE_MANAGER_DATAVIEWS = [
  {
    id: MPA_DATAVIEW_INSTANCE_ID,
    config: { color: '#1AFF6B', visible: true },
    dataviewId: MPA_DATAVIEW_ID,
  },
]

export const MARINE_MANAGER_DATAVIEWS_INSTANCES = [
  {
    id: 'water-temp',
    config: {
      visible: false,
    },
    dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_ID,
  },
  {
    id: 'salinity',
    config: {
      visible: false,
    },
    dataviewId: GLOBAL_SALINITY_DATAVIEW_ID,
  },
  {
    id: 'chlorophyl',
    config: {
      visible: false,
    },
    dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_ID,
  },
]
