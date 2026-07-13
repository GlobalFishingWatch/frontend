export type LayerCategory = 'activity' | 'detections' | 'events' | 'environment' | 'context'

export type LayerInfo = {
  name: string
  category: LayerCategory
}

/**
 * Dataview instance ids used by the fishing-map default workspace and layer library.
 * Sources: apps/fishing-map/data/dataviews.ts, data/workspaces.ts, data/layer-library
 */
export const LAYERS_DICTIONARY: Record<string, LayerInfo> = {
  // Activity
  ais: { name: 'Apparent fishing effort (AIS)', category: 'activity' },
  'fishing-effort-ais': { name: 'Apparent fishing effort (AIS)', category: 'activity' },
  vms: { name: 'Apparent fishing effort (VMS)', category: 'activity' },
  'fishing-effort-vms': { name: 'Apparent fishing effort (VMS)', category: 'activity' },
  presence: { name: 'Vessel presence (AIS)', category: 'activity' },
  // Detections
  sar: { name: 'Vessel detections (SAR)', category: 'detections' },
  sentinel2: { name: 'Vessel detections (Sentinel-2 optical)', category: 'detections' },
  viirs: { name: 'Night light detections (VIIRS EOG)', category: 'detections' },
  'viirs-skylight': { name: 'Night light detections (VIIRS Skylight)', category: 'detections' },
  // Events
  encounters: { name: 'Encounter events', category: 'events' },
  loitering: { name: 'Loitering events', category: 'events' },
  'port-visits': { name: 'Port visit events', category: 'events' },
  gap: { name: 'AIS off events (gaps)', category: 'events' },
  // Context
  basemap: { name: 'Basemap', category: 'context' },
  'basemap-labels': { name: 'Basemap labels', category: 'context' },
  eez: { name: 'EEZs (Exclusive Economic Zones)', category: 'context' },
  mpa: { name: 'MPAs (Marine Protected Areas)', category: 'context' },
  mpatlas: { name: 'MPAtlas protection level', category: 'context' },
  protectedseas: { name: 'ProtectedSeas regulations', category: 'context' },
  rfmo: { name: 'RFMOs (Tuna Regional Fisheries Management Organizations)', category: 'context' },
  'fao-areas': { name: 'FAO major fishing areas', category: 'context' },
  'fao-major': { name: 'FAO major fishing areas', category: 'context' },
  graticules: { name: 'Latitude/longitude grids', category: 'context' },
  'high-seas': { name: 'High seas', category: 'context' },
  'high-seas-pockets': { name: 'High seas pockets', category: 'context' },
  'eez-areas-12nm': { name: '12 nautical miles zones', category: 'context' },
  'offshore-fixed-infrastructure': { name: 'Offshore fixed infrastructure', category: 'context' },
  'port-locations': { name: 'Port locations (AIS)', category: 'context' },
  'port-locations-vms': { name: 'Port locations (VMS)', category: 'context' },
  'paa-duke': { name: 'Preferential access areas (Duke)', category: 'context' },
  'gfcm-fao': { name: 'GFCM FAO areas', category: 'context' },
  'dsm-isa-leasing-areas': { name: 'Deep sea mining ISA leasing areas', category: 'context' },
  immas: { name: 'Important Marine Mammal Areas', category: 'context' },
  ebsas: { name: 'Ecologically or Biologically Significant Areas', category: 'context' },
  // Environment
  bathymetry: { name: 'Bathymetry', category: 'environment' },
  currents: { name: 'Currents', category: 'environment' },
  winds: { name: 'Winds', category: 'environment' },
  chlorophyl: { name: 'Chlorophyll-a concentration', category: 'environment' },
  nitrate: { name: 'Nitrate concentration', category: 'environment' },
  oxygen: { name: 'Dissolved oxygen', category: 'environment' },
  ph: { name: 'pH', category: 'environment' },
  phosphate: { name: 'Phosphate concentration', category: 'environment' },
  salinity: { name: 'Salinity', category: 'environment' },
  sst: { name: 'Sea surface temperature', category: 'environment' },
  'sst-anomalies': { name: 'Sea surface temperature anomalies', category: 'environment' },
  'sst-anomalies-min': { name: 'Sea surface temperature anomalies (min)', category: 'environment' },
  'sst-anomalies-max': { name: 'Sea surface temperature anomalies (max)', category: 'environment' },
  thgt: { name: 'Wave height', category: 'environment' },
  'marine-ecoregions': { name: 'Marine ecoregions', category: 'environment' },
  mangroves: { name: 'Mangroves', category: 'environment' },
  seamounts: { name: 'Seamounts', category: 'environment' },
  'coral-reefs': { name: 'Coral reefs', category: 'environment' },
  seagrasses: { name: 'Seagrasses', category: 'environment' },
}

const CONTEXT_LAYER_PREFIX = 'context-layer-'
const VESSEL_LAYER_PREFIX = 'vessel-'

/**
 * Resolves a dataview instance id to layer info. Handles the app id conventions:
 * `context-layer-` prefix, `__<timestamp>` suffix (layer-library additions) and
 * `vessel-` prefix (vessel track layers)
 */
export const getLayerInfo = (instanceId: string): LayerInfo => {
  const baseId = instanceId.replace(/__\d+$/, '')
  const contextId = baseId.startsWith(CONTEXT_LAYER_PREFIX)
    ? baseId.replace(CONTEXT_LAYER_PREFIX, '')
    : baseId
  if (LAYERS_DICTIONARY[contextId]) {
    return LAYERS_DICTIONARY[contextId]
  }
  if (baseId.startsWith(VESSEL_LAYER_PREFIX)) {
    return {
      name: `Vessel track (${baseId.replace(VESSEL_LAYER_PREFIX, '')})`,
      category: 'activity',
    }
  }
  return { name: baseId, category: 'context' }
}
