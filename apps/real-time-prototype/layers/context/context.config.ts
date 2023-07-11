export const API_PATH = 'https://gateway.api.dev.globalfishingwatch.org/v2/datasets'

const GRID = 'Graticules'
const EEZ = 'EEZs (Marine Regions)'
const MPAS = 'MPAs (WDPA)'
const FAO = 'FAO major fishing areas'
const RFMO = 'RFMOs'
const HIGH_SEAS = 'High Seas'

export const CONTEXT_LAYERS_IDS = [GRID, EEZ, MPAS, FAO, RFMO, HIGH_SEAS]

export const CONTEXT_LAYERS_OBJECT = {
  [GRID]: {
    dataset: 'public-graticules/user-context-layer-v1',
    lineColor: [252, 162, 111, 15],
  },
  [EEZ]: {
    dataset: 'public-eez-areas/user-context-layer-v1',
    lineColor: [6, 150, 136],
  },
  [MPAS]: {
    dataset: 'public-mpa-all/user-context-layer-v1',
    lineColor: [26, 255, 107],
  },
  [FAO]: {
    dataset: 'public-fao-major/user-context-layer-v1',
    lineColor: [252, 162, 111],
  },
  [RFMO]: {
    dataset: 'public-rfmo/user-context-layer-v1',
    lineColor: [107, 103, 229],
  },
  [HIGH_SEAS]: {
    dataset: 'public-high-seas/user-context-layer-v1',
    lineColor: [65, 132, 244],
  },
}
