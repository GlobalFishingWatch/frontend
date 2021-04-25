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
  MarineReserves = 'marine-reserves',
  CountryPortals = 'country-portals',
}

const DEV_WORKSPACE = WORKSPACE_ENV === 'development'

// Default context layers
export const DEFAULT_BASEMAP_DATAVIEW_ID = DEV_WORKSPACE ? 90 : 173
export const DEFAULT_EEZ_DATAVIEW_ID = DEV_WORKSPACE ? 94 : 177
export const DEFAULT_MPA_NO_TAKE_DATAVIEW_ID = DEV_WORKSPACE ? 99 : 179
export const DEFAULT_MPA_RESTRICTED_DATAVIEW_ID = DEV_WORKSPACE ? 100 : 180
export const DEFAULT_MPA_DATAVIEW_ID = DEV_WORKSPACE ? 98 : 176
export const DEFAULT_RFMO_DATAVIEW_ID = DEV_WORKSPACE ? 95 : 175

// Other layers configuration
export const DEFAULT_VESSEL_DATAVIEW_ID = DEV_WORKSPACE ? 92 : 171
export const DEFAULT_FISHING_DATAVIEW_ID = DEV_WORKSPACE ? 91 : 178
export const DEFAULT_EVENTS_DATAVIEW_ID = DEV_WORKSPACE ? 140 : 0
export const DEFAULT_PRESENCE_DATAVIEW_ID = DEV_WORKSPACE ? 124 : 241
export const DEFAULT_CONTEXT_DATAVIEW_ID = DEV_WORKSPACE ? 123 : 220
export const DEFAULT_ENVIRONMENT_DATAVIEW_ID = DEV_WORKSPACE ? 125 : 223
export const DEFAULT_USER_TRACK_ID = DEV_WORKSPACE ? 999 : 999
