/** Prefix of context layer dataview instance ids (e.g. `context-layer-eez`) */
export const CONTEXT_LAYER_INSTANCE_PREFIX = 'context-layer-' as const

/** Separator between a layer-library id and its unique suffix (e.g. `fishing-effort-ais__123`) */
export const LAYER_LIBRARY_ID_SEPARATOR = '__'

// Dataview instance ids used by the default workspace
export const AIS_DATAVIEW_INSTANCE_ID = 'ais'
export const VMS_DATAVIEW_INSTANCE_ID = 'vms'
export const PRESENCE_DATAVIEW_INSTANCE_ID = 'presence'
export const SAR_DATAVIEW_INSTANCE_ID = 'sar'
export const SENTINEL2_DATAVIEW_INSTANCE_ID = 'sentinel2'
export const VIIRS_DATAVIEW_INSTANCE_ID = 'viirs'
export const VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID = 'viirs-skylight'

// Event layer source/instance ids
export const ENCOUNTER_EVENTS_SOURCE_ID = 'encounters'
export const PORT_VISITS_EVENTS_SOURCE_ID = 'port-visits'
export const LOITERING_EVENTS_SOURCE_ID = 'loitering'
export const GAPS_EVENTS_SOURCE_ID = 'gap'

export const BATHYMETRY_DATAVIEW_PREFIX = 'bathymetry' as const
