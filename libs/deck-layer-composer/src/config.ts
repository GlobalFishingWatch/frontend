export const API_GATEWAY =
  process.env.API_GATEWAY ||
  process.env.REACT_APP_API_GATEWAY ||
  process.env.NEXT_PUBLIC_API_GATEWAY ||
  'https://gateway.api.dev.globalfishingwatch.org'

const GRID = 'grid'
const EEZ = 'eez'
const MPAS = 'mpas'
const FAO = 'fao'
const RFMO = 'rfmo'
const HIGH_SEAS = 'high-seas'

export const CONTEXT_LAYERS_IDS = [GRID, EEZ, MPAS, FAO, RFMO, HIGH_SEAS]
