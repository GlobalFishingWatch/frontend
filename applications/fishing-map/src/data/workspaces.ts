export type WorkspaceEnv = 'development' | 'production'
export const WORKSPACE_ENV =
  (process.env.REACT_APP_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'

export function getWorkspaceEnv(): WorkspaceEnv {
  return WORKSPACE_ENV
}

export const DEFAULT_BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
export const DEFAULT_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 92 : 171
export const DEFAULT_FISHING_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 91 : 178
