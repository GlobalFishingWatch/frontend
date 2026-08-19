import { VESSEL_DATAVIEW_INSTANCE_PREFIX } from '@globalfishingwatch/dataviews-client'
import * as WORKSPACE_CONFIG from '@platform/config'

export type LayerCategory = 'activity' | 'detections' | 'events' | 'environment' | 'context'

export type LayerInfo = {
  name: string
  category: LayerCategory
  /** Backend dataview slug, filled automatically by the encoder for layer-library instances */
  dataviewId?: string
}

/**
 * Dataview instance ids used by the platform default workspace and layer library.
 * Ids and slugs come from @platform/config (single source of truth with the app)
 */
export const LAYERS_DICTIONARY: Record<string, LayerInfo> = {
  // Activity
  [WORKSPACE_CONFIG.AIS_DATAVIEW_INSTANCE_ID]: {
    name: 'Apparent fishing effort (AIS)',
    category: 'activity',
    dataviewId: WORKSPACE_CONFIG.FISHING_AIS_DATAVIEW_SLUG,
  },
  'fishing-effort-ais': {
    name: 'Apparent fishing effort (AIS)',
    category: 'activity',
    dataviewId: WORKSPACE_CONFIG.FISHING_AIS_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.VMS_DATAVIEW_INSTANCE_ID]: {
    name: 'Apparent fishing effort (VMS)',
    category: 'activity',
    dataviewId: WORKSPACE_CONFIG.FISHING_VMS_DATAVIEW_SLUG,
  },
  'fishing-effort-vms': {
    name: 'Apparent fishing effort (VMS)',
    category: 'activity',
    dataviewId: WORKSPACE_CONFIG.FISHING_VMS_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.PRESENCE_DATAVIEW_INSTANCE_ID]: {
    name: 'Vessel presence (AIS)',
    category: 'activity',
    dataviewId: WORKSPACE_CONFIG.PRESENCE_DATAVIEW_SLUG,
  },
  // Detections
  [WORKSPACE_CONFIG.SAR_DATAVIEW_INSTANCE_ID]: {
    name: 'Vessel detections (SAR)',
    category: 'detections',
    dataviewId: WORKSPACE_CONFIG.SAR_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.SENTINEL2_DATAVIEW_INSTANCE_ID]: {
    name: 'Vessel detections (Sentinel-2 optical)',
    category: 'detections',
    dataviewId: WORKSPACE_CONFIG.SENTINEL2_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.VIIRS_DATAVIEW_INSTANCE_ID]: {
    name: 'Night light detections (VIIRS EOG)',
    category: 'detections',
    dataviewId: WORKSPACE_CONFIG.VIIRS_MATCH_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID]: {
    name: 'Night light detections (VIIRS Skylight)',
    category: 'detections',
    dataviewId: WORKSPACE_CONFIG.VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
  },
  // Events
  [WORKSPACE_CONFIG.ENCOUNTER_EVENTS_SOURCE_ID]: {
    name: 'Encounter events',
    category: 'events',
    dataviewId: WORKSPACE_CONFIG.CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.LOITERING_EVENTS_SOURCE_ID]: {
    name: 'Loitering events',
    category: 'events',
    dataviewId: WORKSPACE_CONFIG.CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.PORT_VISITS_EVENTS_SOURCE_ID]: {
    name: 'Port visit events',
    category: 'events',
    dataviewId: WORKSPACE_CONFIG.CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  },
  [WORKSPACE_CONFIG.GAPS_EVENTS_SOURCE_ID]: {
    name: 'AIS off events (gaps)',
    category: 'events',
    dataviewId: WORKSPACE_CONFIG.CLUSTER_GAPS_EVENTS_DATAVIEW_SLUG,
  },
  // Context
  basemap: { name: 'Basemap', category: 'context' },
  'basemap-labels': { name: 'Basemap labels', category: 'context' },
  eez: {
    name: 'EEZs (Exclusive Economic Zones)',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.EEZ_DATAVIEW_SLUG,
  },
  mpa: {
    name: 'MPAs (Marine Protected Areas)',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.MPA_DATAVIEW_SLUG,
  },
  mpatlas: {
    name: 'MPAtlas protection level',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.MPATLAS_DATAVIEW_SLUG,
  },
  protectedseas: {
    name: 'ProtectedSeas regulations',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.PROTECTED_SEAS_DATAVIEW_SLUG,
  },
  rfmo: {
    name: 'RFMOs (Tuna Regional Fisheries Management Organizations)',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.RFMO_DATAVIEW_SLUG,
  },
  'fao-areas': {
    name: 'FAO major fishing areas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.FAO_AREAS_DATAVIEW_SLUG,
  },
  'fao-major': {
    name: 'FAO major fishing areas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.FAO_AREAS_DATAVIEW_SLUG,
  },
  graticules: {
    name: 'Latitude/longitude grids',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.GRATICULES_DATAVIEW_SLUG,
  },
  'high-seas': {
    name: 'High seas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.HIGH_SEAS_DATAVIEW_SLUG,
  },
  'high-seas-pockets': {
    name: 'High seas pockets',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.HIGH_SEAS_POCKETS_DATAVIEW_SLUG,
  },
  'eez-areas-12nm': {
    name: '12 nautical miles zones',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.EEZ_AREAS_12NM_DATAVIEW_SLUG,
  },
  'offshore-fixed-infrastructure': {
    name: 'Offshore fixed infrastructure',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.FIXED_INFRASTRUCTURE_DATAVIEW_SLUG,
  },
  'port-locations': {
    name: 'Port locations (AIS)',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.PORTS_AIS_DATAVIEW_SLUG,
  },
  'port-locations-vms': {
    name: 'Port locations (VMS)',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.PORTS_VMS_DATAVIEW_SLUG,
  },
  'paa-duke': {
    name: 'Preferential access areas (Duke)',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.PAA_DUKE_DATAVIEW_SLUG,
  },
  'gfcm-fao': {
    name: 'GFCM FAO areas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.GFCM_FAO_DATAVIEW_SLUG,
  },
  'dsm-isa-leasing-areas': {
    name: 'Deep sea mining ISA leasing areas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  },
  immas: {
    name: 'Important Marine Mammal Areas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  },
  ebsas: {
    name: 'Ecologically or Biologically Significant Areas',
    category: 'context',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_CONTEXT_DATAVIEW_SLUG,
  },
  // Environment
  [WORKSPACE_CONFIG.BATHYMETRY_DATAVIEW_PREFIX]: {
    name: 'Bathymetry',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_STATIC_DATAVIEW_SLUG,
  },
  currents: {
    name: 'Currents',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.CURRENTS_DATAVIEW_SLUG,
  },
  winds: {
    name: 'Winds',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.WINDS_DATAVIEW_SLUG,
  },
  chlorophyl: {
    name: 'Chlorophyll-a concentration',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  nitrate: {
    name: 'Nitrate concentration',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  oxygen: {
    name: 'Dissolved oxygen',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  ph: {
    name: 'pH',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  phosphate: {
    name: 'Phosphate concentration',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  salinity: {
    name: 'Salinity',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  sst: {
    name: 'Sea surface temperature',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  'sst-anomalies': {
    name: 'Sea surface temperature anomalies',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  'sst-anomalies-min': {
    name: 'Sea surface temperature anomalies (min)',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  'sst-anomalies-max': {
    name: 'Sea surface temperature anomalies (max)',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  thgt: {
    name: 'Wave height',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG,
  },
  'marine-ecoregions': {
    name: 'Marine ecoregions',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  },
  mangroves: {
    name: 'Mangroves',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  },
  seamounts: {
    name: 'Seamounts',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  },
  'coral-reefs': {
    name: 'Coral reefs',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  },
  seagrasses: {
    name: 'Seagrasses',
    category: 'environment',
    dataviewId: WORKSPACE_CONFIG.TEMPLATE_GFW_ENVIRONMENT_DATAVIEW_SLUG,
  },
}

const LIBRARY_ID_SUFFIX_REGEX = new RegExp(`${WORKSPACE_CONFIG.LAYER_LIBRARY_ID_SEPARATOR}\\d+$`)

/**
 * Resolves a dataview instance id to layer info. Handles the app id conventions:
 * `context-layer-` prefix, `__<timestamp>` suffix (layer-library additions) and
 * `vessel-` prefix (vessel track layers)
 */
export const getLayerInfo = (instanceId: string): LayerInfo => {
  const baseId = instanceId.replace(LIBRARY_ID_SUFFIX_REGEX, '')
  const contextId = baseId.startsWith(WORKSPACE_CONFIG.CONTEXT_LAYER_INSTANCE_PREFIX)
    ? baseId.replace(WORKSPACE_CONFIG.CONTEXT_LAYER_INSTANCE_PREFIX, '')
    : baseId
  if (LAYERS_DICTIONARY[contextId]) {
    return LAYERS_DICTIONARY[contextId]
  }
  if (baseId.startsWith(VESSEL_DATAVIEW_INSTANCE_PREFIX)) {
    return {
      name: `Vessel track (${baseId.replace(VESSEL_DATAVIEW_INSTANCE_PREFIX, '')})`,
      category: 'activity',
    }
  }
  return { name: baseId, category: 'context' }
}
