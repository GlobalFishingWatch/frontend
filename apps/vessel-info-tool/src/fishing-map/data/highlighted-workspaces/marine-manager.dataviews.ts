import { BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES } from 'data/default-workspaces/context-layers'
import {
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE,
  EEZ_DATAVIEW_INSTANCE_ID,
  GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
  GLOBAL_SALINITY_DATAVIEW_SLUG,
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'

export const WIZARD_TEMPLATE_ID = 'wizard_template-public'

export const MARINE_MANAGER_DATAVIEWS = [
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE,
  ...BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES.filter(
    (d) => d.id === EEZ_DATAVIEW_INSTANCE_ID || d.id === MPA_DATAVIEW_INSTANCE_ID
  ),
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
