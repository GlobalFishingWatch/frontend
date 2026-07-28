import { DATASET_PUBLIC_PREFIX, PIPE_DATASET_VERSION } from '@globalfishingwatch/datasets-client'

import { CONTEXT_LAYER_INSTANCE_PREFIX } from './dataviews'

// Note: erasable-syntax-only package (loaded by plain node via type stripping) — const object instead of enum
export const WorkspaceCategory = {
  FishingActivity: 'fishing-activity',
  MarineManager: 'marine-manager',
  Reports: 'reports',
} as const
export type WorkspaceCategory = (typeof WorkspaceCategory)[keyof typeof WorkspaceCategory]

const DEFAULT_WORKSPACE_KEY = 'default'
export const DEFAULT_WORKSPACE_ID = `${DEFAULT_WORKSPACE_KEY}-${DATASET_PUBLIC_PREFIX}`
export const DEFAULT_WORKSPACE_CATEGORY = WorkspaceCategory.FishingActivity
export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap' as const

export const DEEP_SEA_MINING_WORKSPACE_ID = 'deep-sea-mining-public' as const

// Contextual layers dataviews
export const BASEMAP_DATAVIEW_SLUG = 'basemap' as const
export const BASEMAP_LABELS_DATAVIEW_SLUG = 'basemap-labels' as const
export const EEZ_DATAVIEW_SLUG = 'eez' as const
export const EEZ_AREAS_12NM_DATAVIEW_SLUG = 'eez-12-nm' as const
export const EEZ_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}eez` as const
export const MPA_DATAVIEW_SLUG = 'mpa' as const
export const MPA_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}mpa` as const
export const BASEMAP_LABELS_DATAVIEW_INSTANCE_ID = 'basemap-labels' as const
export const PROTECTEDSEAS_DATAVIEW_INSTANCE_ID =
  `${CONTEXT_LAYER_INSTANCE_PREFIX}protectedseas` as const
export const RFMO_DATAVIEW_SLUG = 'tuna-rfmo-areas' as const
export const RFMO_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}rfmo` as const
export const HIGH_SEAS_DATAVIEW_SLUG = 'high-seas' as const
export const HIGH_SEAS_POCKETS_DATAVIEW_SLUG = 'high-seas-pocket' as const
export const PAA_DUKE_DATAVIEW_SLUG = 'paa-duke' as const
export const GFCM_FAO_DATAVIEW_SLUG = 'gfcm-fao' as const
export const PROTECTED_SEAS_DATAVIEW_SLUG = 'protected-seas' as const
export const MPATLAS_DATAVIEW_SLUG = 'mpatlas' as const
export const GRATICULES_DATAVIEW_SLUG = 'graticules' as const
export const FIXED_SAR_INFRASTRUCTURE = 'fixed-infrastructure' as const
export const PORTS_AIS_DATAVIEW_SLUG = 'ais-ports' as const
export const PORTS_VMS_DATAVIEW_SLUG = 'vms-ports' as const
export const FAO_AREAS_DATAVIEW_SLUG = 'fao-areas' as const
export const FAO_AREAS_DATAVIEW_INSTANCE_ID = `${CONTEXT_LAYER_INSTANCE_PREFIX}fao-areas` as const
export const PORTS_FOOTPRINT_AIS_DATAVIEW_SLUG = 'ais-ports-footprint' as const
export const PORTS_FOOTPRINT_VMS_DATAVIEW_SLUG = 'vms-ports-footprint' as const
export const CURRENTS_DATAVIEW_SLUG = 'currents' as const
export const WINDS_DATAVIEW_SLUG = 'winds' as const
export const BATHYMETRY_CONTOUR_DATAVIEW_SLUG = 'bathymetry-contour' as const

export const FISHING_DATAVIEW_SLUG_PREFIX = 'apparent-fishing-effort' as const
// Workspaces dataviews (versioned by the dataset pipeline)
export const FISHING_DATAVIEW_SLUG_ALL =
  `${FISHING_DATAVIEW_SLUG_PREFIX}-v-${PIPE_DATASET_VERSION}` as const
export const FISHING_DATAVIEW_SLUG_AIS =
  `${FISHING_DATAVIEW_SLUG_PREFIX}-ais-v-${PIPE_DATASET_VERSION}` as const
export const FISHING_DATAVIEW_SLUG_VMS =
  `${FISHING_DATAVIEW_SLUG_PREFIX}-vms-v-${PIPE_DATASET_VERSION}` as const
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
export const VIIRS_MATCH_DATAVIEW_SLUG = `viirs-match-v-${PIPE_DATASET_VERSION}` as const
export const VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG =
  `viirs-match-skylight-v-${PIPE_DATASET_VERSION}` as const
export const SAR_DATAVIEW_SLUG = `sar-v-${PIPE_DATASET_VERSION}` as const
export const SENTINEL2_DATAVIEW_SLUG = `sentinel-2-v-${PIPE_DATASET_VERSION}` as const
export const PRESENCE_DATAVIEW_SLUG = `presence-activity-v-${PIPE_DATASET_VERSION}` as const
export const TEMPLATE_USER_TRACK_SLUG = `user-track` as const
export const TEMPLATE_VESSEL_DATAVIEW_SLUG =
  `fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}` as const
export const TEMPLATE_VESSEL_DATAVIEW_SLUG_GAPS =
  `fishing-map-vessel-track-v-${PIPE_DATASET_VERSION}-gaps` as const
export const TEMPLATE_VESSEL_TRACK_DATAVIEW_SLUG =
  `vessel-track-only-v-${PIPE_DATASET_VERSION}` as const
export const TEMPLATE_POINTS_DATAVIEW_SLUG = `default-points-layer` as const
export const TEMPLATE_ACTIVITY_DATAVIEW_SLUG = `activity-template` as const
export const TEMPLATE_CLUSTERS_DATAVIEW_SLUG = `template-for-bigquery-cluster-events` as const
export const TEMPLATE_ENVIRONMENT_DATAVIEW_SLUG = `default-environmental-layer` as const
export const TEMPLATE_CONTEXT_DATAVIEW_SLUG = `default-context-layer` as const
export const TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG = `gfw-environmental-layer` as const
export const TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG = `heatmap-environmental-layer` as const
export const TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG = `heatmap-static-layer` as const
