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

// Different ids for each different environment
// TODO migrate to use strings and define ids for the following ones
// IMPORTANT: When updating this list, also update it's corresponding
// values in:
//      applications/vessel-history/src/features/dataviews/dataviews.config.ts
export const DEFAULT_BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
export const DEFAULT_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 92 : 171
export const DEFAULT_FISHING_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 91 : 178
export const DEFAULT_EVENTS_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 140 : 0
export const DEFAULT_PRESENCE_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 124 : 241
export const DEFAULT_CONTEXT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 123 : 220
export const DEFAULT_ENVIRONMENT_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 125 : 223
export const DEFAULT_USER_TRACK_ID = WORKSPACE_ENV === 'development' ? 999 : 999
