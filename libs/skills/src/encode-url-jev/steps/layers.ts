import { noul } from '@typesafe-ai/sdk'

import {
  AIS_DATAVIEW_INSTANCE_ID,
  BATHYMETRY_DATAVIEW_PREFIX,
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
  PRESENCE_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
  VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import type { Step } from './step'

// Which layers the message asks to see. One noul per layer, so several can be true at once.

type Palette = { color: string; colorRamp: string }

type LayerSpec = {
  question: string
  /** Heatmap environment layers share one template dataview: the instance carries the dataset */
  envDataset?: string
  /** Layer-library color, set on instances added on top of the default workspace */
  palette?: Palette
}

// "The words of `message` itself" keeps Jev from answering yes because `current_map` already
// shows the layer (measured: 0.55 → 0.02 on a follow-up that never mentions fishing)
const asks = (topic: string) => `Do the words of \`message\` itself mention ${topic}?`

export const LAYERS: Record<string, LayerSpec> = {
  [AIS_DATAVIEW_INSTANCE_ID]: { question: asks('fishing activity or fishing effort') },
  [VMS_DATAVIEW_INSTANCE_ID]: {
    question: asks('VMS (vessel monitoring system) data'),
  },
  [PRESENCE_DATAVIEW_INSTANCE_ID]: {
    question: asks(
      'vessel presence, or non-fishing vessels such as cargo, passenger or carrier vessels'
    ),
  },
  [SAR_DATAVIEW_INSTANCE_ID]: { question: asks('SAR or radar detections') },
  [SENTINEL2_DATAVIEW_INSTANCE_ID]: { question: asks('Sentinel-2 or optical satellite imagery') },
  [VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID]: { question: asks('VIIRS or night light detections') },
  [ENCOUNTER_EVENTS_SOURCE_ID]: { question: asks('encounters, meaning vessels meeting at sea') },
  [LOITERING_EVENTS_SOURCE_ID]: {
    question: asks('loitering, meaning vessels idling or drifting at sea'),
  },
  [PORT_VISITS_EVENTS_SOURCE_ID]: { question: asks('port visits or vessels visiting ports') },
  [BATHYMETRY_DATAVIEW_PREFIX]: { question: asks('bathymetry or ocean depth') },
  currents: { question: asks('ocean currents'), palette: { color: '#00EEFF', colorRamp: 'sky' } },
  winds: { question: asks('winds') },
  // Dataset ids and colors from apps/platform/data/map/layer-library/layers-environment.ts
  sst: {
    question: asks('temperature, sea surface temperature or water temperature'),
    envDataset: 'public-global-sst:v20231213',
    palette: { color: '#FF6854', colorRamp: 'red' },
  },
  'sst-anomalies': {
    question: asks('sea surface temperature anomalies'),
    envDataset: 'public-global-sst-anomalies:v20231213',
    palette: { color: '#FFAA0D', colorRamp: 'orange' },
  },
  salinity: {
    question: asks('salinity'),
    envDataset: 'public-global-salinity:v20231213',
    palette: { color: '#9CA4FF', colorRamp: 'lilac' },
  },
  chlorophyl: {
    question: asks('chlorophyll'),
    envDataset: 'public-global-chlorophyl:v20231213',
    palette: { color: '#FFEA00', colorRamp: 'yellow' },
  },
  nitrate: {
    question: asks('nitrate'),
    envDataset: 'public-global-nitrate:v20231213',
    palette: { color: '#FF6854', colorRamp: 'red' },
  },
  oxygen: {
    question: asks('dissolved oxygen'),
    envDataset: 'public-global-oxygen:v20231213',
    palette: { color: '#00EEFF', colorRamp: 'sky' },
  },
  ph: {
    question: asks('pH or ocean acidity'),
    envDataset: 'public-global-ph:v20231213',
    palette: { color: '#9CA4FF', colorRamp: 'lilac' },
  },
  phosphate: {
    question: asks('phosphate'),
    envDataset: 'public-global-phosphate:v20231213',
    palette: { color: '#A6FF59', colorRamp: 'green' },
  },
  thgt: {
    question: asks('wave height'),
    envDataset: 'public-global-thgt:v20231213',
    palette: { color: '#FFAE9B', colorRamp: 'salmon' },
  },
}

const LIBRARY_ALIASES: Record<string, string> = {
  'fishing-effort-ais': AIS_DATAVIEW_INSTANCE_ID,
  'fishing-effort-vms': VMS_DATAVIEW_INSTANCE_ID,
}

/** The LAYERS key of an instance id: `fishing-effort-ais__123` → `ais`, `sst__123` → `sst` */
export const layerKey = (id: string) => {
  const base = id.replace(/__\d+$/, '')
  return LIBRARY_ALIASES[base] ?? base
}

const DETECTION_LAYERS = [
  SAR_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
  VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
]

export type LayersDecision = {
  /** Layer ids (keys of LAYERS) the message asks to see */
  ids: string[]
}

export const layersStep: Step<LayersDecision> = {
  needs: [],
  questions() {
    return {
      ...Object.fromEntries(
        Object.entries(LAYERS).map(([id, { question }]) => [`layers.${id}`, noul(question)])
      ),
      'layers.ais_named': noul(asks('AIS by name')),
      'layers.detections': noul(
        asks('vessel detections, satellite imagery, or dark vessels that do not broadcast AIS')
      ),
    }
  },
  resolve(read) {
    const ids = Object.keys(LAYERS).filter((id) => read.yes(`layers.${id}`))
    // Detections asked in general (e.g. "dark vessels") without naming a source → all sources
    if (read.yes('layers.detections') && !DETECTION_LAYERS.some((id) => ids.includes(id))) {
      ids.push(...DETECTION_LAYERS)
    }
    // "VMS fishing" means the VMS layer, not VMS + AIS: generic fishing goes to AIS only when
    // VMS isn't asked for, or when AIS is named too
    const dropAis = ids.includes(VMS_DATAVIEW_INSTANCE_ID) && !read.yes('layers.ais_named')
    return { ids: dropAis ? ids.filter((id) => id !== AIS_DATAVIEW_INSTANCE_ID) : ids }
  },
}
