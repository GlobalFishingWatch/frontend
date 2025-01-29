import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DataviewType } from '@globalfishingwatch/api-types'
import { BasemapType } from '@globalfishingwatch/deck-layers'

import { PUBLIC_SUFIX } from './config'

type WorkspaceEnv = 'development' | 'production'
export const WORKSPACE_ENV =
  (process.env.NEXT_PUBLIC_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'

export function getWorkspaceEnv(): WorkspaceEnv {
  return WORKSPACE_ENV
}

export enum WorkspaceCategory {
  FishingActivity = 'fishing-activity',
  MarineManager = 'marine-manager',
}

export const GLOBAL_VESSELS_DATASET_ID = 'public-global-all-vessels'

const DEFAULT_WORKSPACE_KEY = 'default'
export const DEFAULT_WORKSPACE_ID = `${DEFAULT_WORKSPACE_KEY}-${PUBLIC_SUFIX}`
export const DEFAULT_WORKSPACE_CATEGORY = WorkspaceCategory.FishingActivity
export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap'

// IMPORTANT: When updating this list, also update it's corresponding
// values in:
//      apps/vessel-history/src/features/dataviews/dataviews.config.ts

// Contextual layers dataviews by environment
export const BASEMAP_DATAVIEW_SLUG = 'basemap'
export const BASEMAP_LABELS_DATAVIEW_SLUG = 'basemap-labels'
export const EEZ_DATAVIEW_SLUG = 'eez'
export const EEZ_DATAVIEW_INSTANCE_ID = 'context-layer-eez'
export const MPA_DATAVIEW_SLUG = 'mpa'
export const MPA_DATAVIEW_INSTANCE_ID = 'context-layer-mpa'
export const BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap-labels'
export const PROTECTEDSEAS_DATAVIEW_INSTANCE_ID = 'context-layer-protectedseas'
export const RFMO_DATAVIEW_SLUG = 'tuna-rfmo-areas'
export const RFMO_DATAVIEW_INSTANCE_ID = 'context-layer-rfmo'
export const HIGH_SEAS_DATAVIEW_SLUG = 'high-seas'
export const PROTECTED_SEAS_DATAVIEW_SLUG = 'protected-seas'
export const GRATICULES_DATAVIEW_SLUG = 'graticules'
export const FIXED_SAR_INFRASTRUCTURE = 'fixed-infrastructure'
export const FAO_AREAS_DATAVIEW_SLUG = 'fao-areas'
export const FAO_AREAS_DATAVIEW_INSTANCE_ID = 'context-layer-fao-areas'
export const PORTS_FOOTPRINT_DATAVIEW_SLUG = 'ports-footprint'

// Workspaces dataviews
export const FISHING_DATAVIEW_SLUG = 'apparent-fishing-effort-v-3'
export const CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG = 'encounter-cluster-events-v-3'
export const CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG = 'loitering-cluster-events-v-3'
export const CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG = 'port-visit-cluster-events-v-3'
export const VIIRS_MATCH_DATAVIEW_SLUG = 'viirs-match-v-3'
export const SAR_DATAVIEW_SLUG = 'sar-v-3'
export const PRESENCE_DATAVIEW_SLUG = 'presence-activity-v-3'
export const TEMPLATE_USER_TRACK_SLUG = 'user-track'
export const TEMPLATE_VESSEL_DATAVIEW_SLUG = 'fishing-map-vessel-track-v-3'
export const TEMPLATE_CONTEXT_DATAVIEW_SLUG = 'default-context-layer'
export const TEMPLATE_POINTS_DATAVIEW_SLUG = 'default-points-layer'
export const TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG = 'gfw-environmental-layer'
export const TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG = 'heatmap-environmental-layer'
export const TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG = 'heatmap-static-layer'
export const TEMPLATE_ACTIVITY_DATAVIEW_SLUG = 'activity-template'
export const TEMPLATE_CLUSTERS_DATAVIEW_SLUG = 'template-for-bigquery-cluster-events'
const TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG = 'default-environmental-layer'

export const TEMPLATE_DATAVIEW_SLUGS = [
  TEMPLATE_USER_TRACK_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
  TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG,
  TEMPLATE_POINTS_DATAVIEW_SLUG,
  TEMPLATE_ACTIVITY_DATAVIEW_SLUG,
  TEMPLATE_CLUSTERS_DATAVIEW_SLUG,
]

export const DEFAULT_PRESENCE_VESSEL_GROUP_DATASETS = [
  'public-global-presence:v3.0',
  'public-chile-presence:v20211126',
  'public-panama-presence:v20211126',
  'public-norway-presence:v20220112',
  'public-png-presence:v20230210',
]

const PRESENCE_DATAVIEWS = [
  VIIRS_MATCH_DATAVIEW_SLUG, // we ensure the + icon woks for the presence category
  PRESENCE_DATAVIEW_SLUG, // In case the workspace doesn't have the dataview added,
  SAR_DATAVIEW_SLUG, // TODO include once ready to release
]

export const CONTEXT_LAYERS_DATAVIEWS = [
  BASEMAP_DATAVIEW_SLUG,
  EEZ_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  GRATICULES_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  BASEMAP_LABELS_DATAVIEW_SLUG,
  FIXED_SAR_INFRASTRUCTURE,
  PORTS_FOOTPRINT_DATAVIEW_SLUG,
]

// Global environmental dataviews
export const GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG = 'global-sea-surface-temperature'
export const GLOBAL_SALINITY_DATAVIEW_SLUG = 'global-water-salinity'
export const GLOBAL_CHLOROPHYL_DATAVIEW_SLUG = 'global-chlorophyll'

const ENVIRONMENT_DATAVIEWS = [
  GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG,
  GLOBAL_SALINITY_DATAVIEW_SLUG,
  GLOBAL_CHLOROPHYL_DATAVIEW_SLUG,
]

export const DEFAULT_DATAVIEW_SLUGS = [
  BASEMAP_DATAVIEW_SLUG,
  FISHING_DATAVIEW_SLUG,
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  ...PRESENCE_DATAVIEWS,
  ...ENVIRONMENT_DATAVIEWS,
  ...TEMPLATE_DATAVIEW_SLUGS,
  ...CONTEXT_LAYERS_DATAVIEWS,
]

export const PROFILE_DATAVIEW_SLUGS = [
  BASEMAP_DATAVIEW_SLUG,
  EEZ_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
]

export const ONLY_GFW_STAFF_DATAVIEW_SLUGS: string[] = []
export const HIDDEN_DATAVIEW_FILTERS: string[] = []

export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE: DataviewInstance = {
  dataviewId: BASEMAP_DATAVIEW_SLUG,
  id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  config: {
    type: DataviewType.Basemap,
    basemap: BasemapType.Default,
  },
}
