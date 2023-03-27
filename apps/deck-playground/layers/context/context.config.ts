export const API_PATH = 'https://gateway.api.dev.globalfishingwatch.org/v2/datasets'

const GRID = 'grid'
const EEZ = 'eez'
const MPAS = 'mpas'
const FAO = 'fao'
const RFMO = 'rfmo'
const HIGH_SEAS = 'high-seas'

export const CONTEXT_LAYERS_IDS = [GRID, EEZ, MPAS, FAO, RFMO, HIGH_SEAS]

export const CONTEXT_LAYERS_OBJECT = {
  [GRID]: {
    dataset: 'public-graticules/user-context-layer-v1',
    lineColor: [192, 192, 192],
  },
  [EEZ]: {
    dataset: 'public-eez-areas/user-context-layer-v1',
    lineColor: [0, 192, 192],
  },
  [MPAS]: {
    dataset: 'public-mpa-all/user-context-layer-v1',
    lineColor: [192, 0, 192],
  },
  [FAO]: {
    dataset: 'public-fao-major/user-context-layer-v1',
    lineColor: [192, 192, 0],
  },
  [RFMO]: {
    dataset: 'public-rfmo/user-context-layer-v1',
    lineColor: [254, 254, 254],
  },
  [HIGH_SEAS]: {
    dataset: 'public-high-seas/user-context-layer-v1',
    lineColor: [254, 254, 0],
  },
}
