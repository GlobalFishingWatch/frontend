import { WORKSPACE_ENV } from 'features/workspace/workspace.slice'

export const FISHING_DATASET_TYPE = '4wings:v1'
export const TRACKS_DATASET_TYPE = 'carriers-tracks:v1'
export const VESSELS_DATASET_TYPE = 'carriers-vessels:v1'
export const USER_CONTEXT_TYPE = 'user-context-layer:v1'

export const DEFAULT_BASEMAP_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 90 : 173
export const DEFAULT_VESSEL_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 92 : 171
export const DEFAULT_FISHING_DATAVIEW_ID = WORKSPACE_ENV === 'development' ? 91 : 178
