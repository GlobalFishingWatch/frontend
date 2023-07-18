export const API_PATH = 'https://gateway.api.dev.globalfishingwatch.org/v2/datasets'

const GRID = 'Graticules'
const EEZ = 'EEZs (Marine Regions)'
const MPAS_WDPA = 'MPAs (WDPA)'
const MPAS_PS = 'MPAs (Protected Seas)'
const FAO = 'FAO Major Fishing Areas'
const RFMO = 'RFMOs'
const HIGH_SEAS = 'High Seas'

export const CONTEXT_LAYERS_IDS = [EEZ, MPAS_WDPA, MPAS_PS, FAO, RFMO, HIGH_SEAS, GRID]

export const CONTEXT_LAYERS_OBJECT = {
  [GRID]: {
    dataset: 'public-graticules/user-context-layer-v1',
    lineColor: [252, 162, 111, 15],
  },
  [EEZ]: {
    dataset: 'public-eez-areas/user-context-layer-v1',
    lineColor: [6, 150, 136],
  },
  [MPAS_WDPA]: {
    dataset: 'public-mpa-all/user-context-layer-v1',
    lineColor: [26, 255, 107],
  },
  [MPAS_PS]: {
    dataset: 'public-protectedseas/user-context-layer-v1',
    lineColor: [59, 162, 209],
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
