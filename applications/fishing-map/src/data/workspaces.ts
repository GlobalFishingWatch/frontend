import { PUBLIC_SUFIX } from './config'

export const DEFAULT_WORKSPACE_KEY = 'default'
export const DEFAULT_WORKSPACE_ID = `${DEFAULT_WORKSPACE_KEY}-${PUBLIC_SUFIX}`

export type WorkspaceEnv = 'development' | 'production'
export const WORKSPACE_ENV =
  (process.env.REACT_APP_WORKSPACE_ENV as WorkspaceEnv) ||
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
//      applications/vessel-history/src/features/dataviews/dataviews.config.ts

// Contextual layers dataviews by environment
export const DEFAULT_BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
export const DEFAULT_EEZ_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 94 : 177
export const DEFAULT_MPA_NO_TAKE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 99 : 179
export const DEFAULT_MPA_RESTRICTED_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 100 : 180
export const DEFAULT_MPA_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 98 : 176
export const DEFAULT_RFMO_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 95 : 175

// Workspaces dataviews
export const DEFAULT_FISHING_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 91 : 178
export const DEFAULT_CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID =
  WORKSPACE_ENV === 'development' ? 140 : 254
export const DEFAULT_PRESENCE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 124 : 241
export const DEFAULT_VIIRS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 159 : 255
export const TEMPLATE_USER_TRACK_ID = WORKSPACE_ENV === 'development' ? 154 : 251
export const TEMPLATE_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 92 : 171
export const TEMPLATE_CONTEXT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 123 : 220
export const TEMPLATE_ENVIRONMENT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 125 : 223

export const TEMPLATE_DATAVIEW_IDS = [
  TEMPLATE_USER_TRACK_ID,
  TEMPLATE_VESSEL_DATAVIEW_ID,
  TEMPLATE_CONTEXT_DATAVIEW_ID,
  TEMPLATE_ENVIRONMENT_DATAVIEW_ID,
]

export const DEFAULT_DATAVIEW_IDS = [
  DEFAULT_PRESENCE_DATAVIEW_ID, // In case the workspace doesn't have the dataview added,
  DEFAULT_VIIRS_DATAVIEW_ID, // we ensure the + icon woks for the presence category
  ...TEMPLATE_DATAVIEW_IDS,
]
