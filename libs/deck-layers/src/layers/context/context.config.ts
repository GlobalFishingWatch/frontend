export const API_PATH = 'https://gateway.api.dev.globalfishingwatch.org/v3/datasets'

const GRID = 'grid'
const EEZ = 'eez'
const MPAS = 'mpas'
const FAO = 'fao'
const RFMO = 'rfmo'
const HIGH_SEAS = 'high-seas'

export const CONTEXT_LAYERS_IDS = [GRID, EEZ, MPAS, FAO, RFMO, HIGH_SEAS]

export const CONTEXT_LAYERS_OBJECT = {
  [GRID]: {
    dataset: 'public-graticules/context-layers',
    lineColor: [192, 192, 192],
  },
  [EEZ]: {
    dataset: 'public-eez-areas/context-layers',
    lineColor: [0, 192, 192],
  },
  [MPAS]: {
    dataset: 'public-mpa-all/context-layers',
    lineColor: [192, 0, 192],
  },
  [FAO]: {
    dataset: 'public-fao-major/context-layers',
    lineColor: [192, 192, 0],
  },
  [RFMO]: {
    dataset: 'public-rfmo/context-layers',
    lineColor: [254, 254, 254],
  },
  [HIGH_SEAS]: {
    dataset: 'public-high-seas/context-layers',
    lineColor: [254, 254, 0],
  },
}
