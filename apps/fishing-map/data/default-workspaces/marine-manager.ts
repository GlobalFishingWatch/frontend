import {
  EEZ_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  GLOBAL_SALINITY_DATAVIEW_SLUG,
  GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'

export const WIZARD_TEMPLATE_ID = 'wizard_template-public'

export const MARINE_MANAGER_DATAVIEWS = [
  {
    id: EEZ_DATAVIEW_INSTANCE_ID,
    config: { color: '#069688', visible: true },
    dataviewId: EEZ_DATAVIEW_SLUG,
  },
  {
    id: MPA_DATAVIEW_INSTANCE_ID,
    config: { color: '#1AFF6B', visible: true },
    dataviewId: MPA_DATAVIEW_SLUG,
  },
]

export const MARINE_MANAGER_DATAVIEWS_INSTANCES = [
  {
    id: 'global-sea-surface-temperature',
    config: {
      visible: false,
    },
    dataviewId: GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  },
  {
    id: 'global-water-salinity',
    config: {
      visible: false,
    },
    dataviewId: GLOBAL_SALINITY_DATAVIEW_SLUG,
  },
  {
    id: 'global-chlorophyl',
    config: {
      visible: false,
    },
    dataviewId: GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  },
]
