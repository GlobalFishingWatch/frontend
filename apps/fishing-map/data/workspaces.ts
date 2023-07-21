import { PUBLIC_SUFIX, PRIVATE_SUFIX } from './config'

export const GLOBAL_VESSELS_DATASET_ID = 'public-global-all-vessels'

export const DEFAULT_WORKSPACE_KEY = 'default'
export const DEFAULT_WORKSPACE_ID = `${DEFAULT_WORKSPACE_KEY}-${PRIVATE_SUFIX}`
export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap'

export type WorkspaceEnv = 'development' | 'production'
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
  CountryPortals = 'country-portals',
}

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
export const HIGH_SEAS_DATAVIEW_SLUG = 'high-seas'
export const PROTECTED_SEAS_DATAVIEW_SLUG = 'protected-seas'
export const GRATICULES_DATAVIEW_SLUG = 'graticules'
export const FAO_AREAS_DATAVIEW_SLUG = 'fao-areas'

// Workspaces dataviews
export const FISHING_DATAVIEW_SLUG = 'apparent-fishing-effort'
export const CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG = 'encounter-cluster-events'
export const VIIRS_MATCH_DATAVIEW_SLUG = 'viirs-match'
export const SAR_DATAVIEW_SLUG = 'sar'
export const PRESENCE_DATAVIEW_SLUG = 'presence-activity'
export const VESSEL_PRESENCE_DATAVIEW_SLUG = 'fishing-map-vessel-presence'
export const TEMPLATE_USER_TRACK_SLUG = 'user-track'
// TODO: update 'fishing-map-vessel-track' dataview with the new identity vessel dataset and use it here again
export const TEMPLATE_VESSEL_DATAVIEW_SLUG = 'fishing-map-identity-vessel' // 'fishing-map-vessel-track'
export const TEMPLATE_CONTEXT_DATAVIEW_SLUG = 'default-context-layer'
export const TEMPLATE_POINTS_DATAVIEW_SLUG = 'default-points-layer'
export const TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG = 'default-environmental-layer'
export const TEMPLATE_ACTIVITY_DATAVIEW_SLUG = 'activity-template'
export const TEMPLATE_CLUSTERS_DATAVIEW_SLUG = 'template-for-bigquery-cluster-events'

export const TEMPLATE_DATAVIEW_SLUGS = [
  TEMPLATE_USER_TRACK_SLUG,
  TEMPLATE_VESSEL_DATAVIEW_SLUG,
  TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG,
  TEMPLATE_POINTS_DATAVIEW_SLUG,
  TEMPLATE_ACTIVITY_DATAVIEW_SLUG,
  TEMPLATE_CLUSTERS_DATAVIEW_SLUG,
]

export const PRESENCE_DATAVIEWS = [
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
]

// Global environmental dataviews
export const GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG = 'global-sea-surface-temperature'
export const GLOBAL_SALINITY_DATAVIEW_SLUG = 'global-water-salinity'
export const GLOBAL_CHLOROPHYL_DATAVIEW_SLUG = 'global-chlorophyll'

export const DEFAULT_DATAVIEW_SLUGS = [
  FISHING_DATAVIEW_SLUG,
  ...PRESENCE_DATAVIEWS,
  ...TEMPLATE_DATAVIEW_SLUGS,
]

export const PROFILE_DATAVIEW_SLUGS = [
  EEZ_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  // TODO enable when mock deletec
  // TEMPLATE_VESSEL_DATAVIEW_SLUG
]

export const ONLY_GFW_STAFF_DATAVIEW_SLUGS: string[] = []
export const HIDDEN_DATAVIEW_FILTERS: string[] = []
