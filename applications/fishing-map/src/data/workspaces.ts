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
export const DEFAULT_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 92 : 171
export const DEFAULT_FISHING_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 91 : 178
export const DEFAULT_EVENTS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 140 : 0 // TODO in pro
export const DEFAULT_PRESENCE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 124 : 241
export const DEFAULT_VIIRS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 159 : 0 // TODO in pro
export const DEFAULT_CONTEXT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 123 : 220
export const DEFAULT_ENVIRONMENT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 125 : 223
export const DEFAULT_USER_TRACK_ID = WORKSPACE_ENV === 'development' ? 154 : 251

export const DEFAULT_DATAVIEW_IDS = [
  DEFAULT_USER_TRACK_ID, // Default user custom tracks dataview for new layers
  DEFAULT_VESSEL_DATAVIEW_ID, // Fetch vessel information
  DEFAULT_CONTEXT_DATAVIEW_ID, // Default context dataview for new layers
  DEFAULT_ENVIRONMENT_DATAVIEW_ID, // Default environmet dataview for new layers
]
