import { PUBLIC_SUFIX } from './config'

export const DEFAULT_WORKSPACE_KEY = 'default'
export const DEFAULT_WORKSPACE_ID = `${DEFAULT_WORKSPACE_KEY}-${PUBLIC_SUFIX}`
export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap'

export type WorkspaceEnv = 'development' | 'production'
export const WORKSPACE_ENV =
  (process.env.NEXT_PUBLIC_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'

export function getWorkspaceEnv(): WorkspaceEnv {
  return WORKSPACE_ENV
}

export enum WorkspaceCategories {
  FishingActivity = 'fishing-activity',
  MarineManager = 'marine-manager',
  CountryPortals = 'country-portals',
}

// IMPORTANT: When updating this list, also update it's corresponding
// values in:
//      apps/vessel-history/src/features/dataviews/dataviews.config.ts

// Contextual layers dataviews by environment
export const BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
export const EEZ_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 94 : 177
export const MPA_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 98 : 176
export const RFMO_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 95 : 175
export const HIGH_SEAS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 97 : 174
export const PROTECTED_SEAS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 292 : undefined
export const GRATICULES_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 246 : 286
export const FAO_AREAS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 245 : 285

// Workspaces dataviews
export const FISHING_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 91 : 178
export const CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 140 : 254
export const VIIRS_MATCH_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 197 : 289
export const SAR_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 269 : 299
export const PRESENCE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 124 : 241
export const VESSEL_PRESENCE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 195 : 270
export const TEMPLATE_USER_TRACK_ID = WORKSPACE_ENV === 'development' ? 154 : 251
export const TEMPLATE_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 92 : 171
export const TEMPLATE_CONTEXT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 123 : 220
export const TEMPLATE_POINTS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 207 : 274
export const TEMPLATE_ENVIRONMENT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 125 : 223
export const TEMPLATE_ACTIVITY_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 234 : 275
export const TEMPLATE_CLUSTERS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 243 : 284

export const TEMPLATE_DATAVIEW_IDS = [
  TEMPLATE_USER_TRACK_ID,
  TEMPLATE_VESSEL_DATAVIEW_ID,
  TEMPLATE_CONTEXT_DATAVIEW_ID,
  TEMPLATE_ENVIRONMENT_DATAVIEW_ID,
  TEMPLATE_POINTS_DATAVIEW_ID,
  TEMPLATE_ACTIVITY_DATAVIEW_ID,
  TEMPLATE_CLUSTERS_DATAVIEW_ID,
]

export const PRESENCE_DATAVIEWS = [
  VIIRS_MATCH_DATAVIEW_ID, // we ensure the + icon woks for the presence category
  PRESENCE_DATAVIEW_ID, // In case the workspace doesn't have the dataview added,
  SAR_DATAVIEW_ID, // TODO include once ready to release
]

export const DEFAULT_DATAVIEW_IDS = [...PRESENCE_DATAVIEWS, ...TEMPLATE_DATAVIEW_IDS]
