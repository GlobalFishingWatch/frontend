import { PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client/constants'

/** Prefix of context layer dataview instance ids (e.g. `context-layer-eez`) */
export const CONTEXT_LAYER_INSTANCE_PREFIX = 'context-layer-' as const

/** Separator between a layer-library id and its unique suffix (e.g. `fishing-effort-ais__123`) */
export const LAYER_LIBRARY_ID_SEPARATOR = '__' as const

export const BATHYMETRY_DATAVIEW_PREFIX = 'bathymetry' as const

// Dataview instance ids used by the default workspace
export const AIS_DATAVIEW_INSTANCE_ID = 'ais' as const
export const REAL_TIME_DATAVIEW_INSTANCE_ID = 'real-time' as const
export const VMS_DATAVIEW_INSTANCE_ID = 'vms' as const
export const PRESENCE_DATAVIEW_INSTANCE_ID = 'presence' as const
export const SAR_DATAVIEW_INSTANCE_ID = 'sar' as const
export const SENTINEL2_DATAVIEW_INSTANCE_ID = 'sentinel2' as const
export const VIIRS_DATAVIEW_INSTANCE_ID = 'viirs' as const
export const VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID = 'viirs-skylight' as const

// Context layer dataview instance ids
export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap' as const
export const BASEMAP_LABELS_DATAVIEW_INSTANCE_ID = 'basemap-labels' as const
export const EEZ_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}eez` as const
export const MPA_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}mpa` as const
export const RFMO_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}rfmo` as const
export const FAO_AREAS_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}fao-areas` as const
export const PROTECTED_SEAS_DATAVIEW_INSTANCE_ID =
  `${CONTEXT_LAYER_INSTANCE_PREFIX}protectedseas` as const

// Event layer source ids
export const ENCOUNTER_EVENTS_SOURCE_ID = 'encounters' as const
export const PORT_VISITS_EVENTS_SOURCE_ID = 'port-visits' as const
export const LOITERING_EVENTS_SOURCE_ID = 'loitering' as const
export const GAPS_EVENTS_SOURCE_ID = 'gap' as const

// Contextual layer dataview slugs
export const BASEMAP_DATAVIEW_SLUG = 'basemap' as const
export const BASEMAP_LABELS_DATAVIEW_SLUG = 'basemap-labels' as const
export const EEZ_DATAVIEW_SLUG = 'eez' as const
export const EEZ_AREAS_12NM_DATAVIEW_SLUG = 'eez-12-nm' as const
export const MPA_DATAVIEW_SLUG = 'mpa' as const
export const RFMO_DATAVIEW_SLUG = 'tuna-rfmo-areas' as const
export const HIGH_SEAS_DATAVIEW_SLUG = 'high-seas' as const
export const HIGH_SEAS_POCKETS_DATAVIEW_SLUG = 'high-seas-pocket' as const
export const PAA_DUKE_DATAVIEW_SLUG = 'paa-duke' as const
export const GFCM_FAO_DATAVIEW_SLUG = 'gfcm-fao' as const
export const PROTECTED_SEAS_DATAVIEW_SLUG = 'protected-seas' as const
export const MPATLAS_DATAVIEW_SLUG = 'mpatlas' as const
export const GRATICULES_DATAVIEW_SLUG = 'graticules' as const
export const FIXED_INFRASTRUCTURE_DATAVIEW_SLUG = 'fixed-infrastructure' as const
export const PORTS_AIS_DATAVIEW_SLUG = 'ais-ports' as const
export const PORTS_VMS_DATAVIEW_SLUG = 'vms-ports' as const
export const FAO_AREAS_DATAVIEW_SLUG = 'fao-areas' as const
export const PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG = 'ais-ports-footprint' as const
export const PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG = 'vms-ports-footprint' as const
export const CURRENTS_DATAVIEW_SLUG = 'currents' as const
export const WINDS_DATAVIEW_SLUG = 'winds' as const
export const BATHYMETRY_CONTOUR_DATAVIEW_SLUG = 'bathymetry-contour' as const

// Global environmental dataview slugs
export const GLOBAL_WATER_TEMPERATURE_DATAVIEW_SLUG = 'global-sea-surface-temperature' as const
export const GLOBAL_SALINITY_DATAVIEW_SLUG = 'global-water-salinity' as const
export const GLOBAL_CHLOROPHYL_DATAVIEW_SLUG = 'global-chlorophyll' as const

// Activity dataview slugs (versioned by the dataset pipeline)
export const FISHING_DATAVIEW_SLUG_PREFIX = 'apparent-fishing-effort' as const
export const FISHING_ALL_DATAVIEW_SLUG =
  `${FISHING_DATAVIEW_SLUG_PREFIX}-v-${PIPE_DATASET_VERSION}` as const
export const FISHING_AIS_DATAVIEW_SLUG =
  `${FISHING_DATAVIEW_SLUG_PREFIX}-ais-v-${PIPE_DATASET_VERSION}` as const
export const FISHING_VMS_DATAVIEW_SLUG =
  `${FISHING_DATAVIEW_SLUG_PREFIX}-vms-v-${PIPE_DATASET_VERSION}` as const
export const PRESENCE_DATAVIEW_SLUG = `presence-activity-v-${PIPE_DATASET_VERSION}` as const
export const PRESENCE_REALTIME_DATAVIEW_SLUG =
  `presence-realtime-v-${PIPE_DATASET_VERSION}` as const

// Detections dataview slugs
export const VIIRS_MATCH_DATAVIEW_SLUG = `viirs-match-v-${PIPE_DATASET_VERSION}` as const
export const VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG =
  `viirs-match-skylight-v-${PIPE_DATASET_VERSION}` as const
export const SAR_DATAVIEW_SLUG = `sar-v-${PIPE_DATASET_VERSION}` as const
export const SENTINEL2_DATAVIEW_SLUG = `sentinel-2-v-${PIPE_DATASET_VERSION}` as const

// Event cluster dataview slugs
export const CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG =
  `encounter-cluster-events-v-${PIPE_DATASET_VERSION}` as const
export const CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG =
  `loitering-cluster-events-v-${PIPE_DATASET_VERSION}` as const
export const CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG =
  `port-visit-cluster-events-v-${PIPE_DATASET_VERSION}` as const
export const CLUSTER_GAPS_EVENTS_DATAVIEW_SLUG =
  `gaps-cluster-events-v-${PIPE_DATASET_VERSION}` as const
export const CLUSTER_GAPS_AIS_OFF_EVENTS_DATAVIEW_SLUG =
  `gaps-ais-off-cluster-events-v-${PIPE_DATASET_VERSION}` as const

// Template dataview slugs
export const TEMPLATE_USER_TRACK_DATAVIEW_SLUG = 'user-track' as const
export const TEMPLATE_VESSEL_DATAVIEW_SLUG =
  `fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const TEMPLATE_VESSEL_GAPS_DATAVIEW_SLUG =
  `fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}-gaps` as const
export const TEMPLATE_VESSEL_TRACK_DATAVIEW_SLUG =
  `vessel-track-only-v-${PIPE_DATASET_VERSION}` as const
export const TEMPLATE_POINTS_DATAVIEW_SLUG = 'default-points-layer' as const
export const TEMPLATE_ACTIVITY_DATAVIEW_SLUG = 'activity-template' as const
export const TEMPLATE_CLUSTERS_DATAVIEW_SLUG = 'template-for-bigquery-cluster-events' as const
export const TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG = 'default-environmental-layer' as const
export const TEMPLATE_CONTEXT_DATAVIEW_SLUG = 'default-context-layer' as const
export const TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG = 'gfw-environmental-layer' as const
export const TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG = 'heatmap-environmental-layer' as const
export const TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG = 'heatmap-static-layer' as const

// Private VMS vessel track dataview slugs, by country
export const VESSEL_VMS_BRAZIL_DATAVIEW_SLUG =
  `private-bra-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_CHILE_DATAVIEW_SLUG =
  `private-chl-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_PANAMA_DATAVIEW_SLUG =
  `private-pan-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_PERU_DATAVIEW_SLUG =
  `private-per-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_COSTARICA_DATAVIEW_SLUG =
  `private-cri-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_BELIZE_DATAVIEW_SLUG =
  `private-blz-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_MONTENEGRO_DATAVIEW_SLUG =
  `private-mne-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_NORWAY_DATAVIEW_SLUG =
  `private-nor-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_PALAU_DATAVIEW_SLUG =
  `private-plw-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_PAPUA_NEW_GUINEA_DATAVIEW_SLUG =
  `private-png-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const VESSEL_VMS_ECUADOR_DATAVIEW_SLUG =
  `private-ecu-fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
