import type { VesselSearchState } from 'features/_vessels/search/search.types'

export {
  CALLSIGN_MIN_LENGTH,
  IMO_LENGTH,
  SSVID_LENGTH,
} from '@globalfishingwatch/data-transforms/vessels'

export const MIN_SEARCH_CHARACTERS = 3

export const SEARCH_TYPES = ['basic', 'advanced'] as const
export type SearchType = (typeof SEARCH_TYPES)[number]

export const RESULTS_PER_PAGE = 20
export const FLAG_LENGTH = 3 // ISO3
export const VESSEL_ID_LENGTH = 37 // GFW Vessel ID
export const EMPTY_SEARCH_FILTERS = {
  id: undefined,
  query: undefined,
  flag: undefined,
  infoSource: undefined,
  sources: undefined,
  lastTransmissionDate: '',
  firstTransmissionDate: '',
  ssvid: undefined,
  imo: undefined,
  callsign: undefined,
  owner: undefined,
  nationalId: undefined,
  codMarinha: undefined,
  shiptypes: undefined,
  geartypes: undefined,
  targetSpecies: undefined,
  fleet: undefined,
  origin: undefined,
  externalId: undefined,
  sourceFleet: undefined,
}

export const DEFAULT_SEARCH_STATE: VesselSearchState = {
  searchOption: 'basic',
  ...EMPTY_SEARCH_FILTERS,
}
