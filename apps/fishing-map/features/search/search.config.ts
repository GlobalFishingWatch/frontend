import type { VesselSearchState } from 'features/search/search.types'

export const MIN_SEARCH_CHARACTERS = 3

export const SEARCH_TYPES = ['basic', 'advanced'] as const
export type SearchType = (typeof SEARCH_TYPES)[number]

export const RESULTS_PER_PAGE = 20
export const SSVID_LENGTH = 9
export const IMO_LENGTH = 7
export const CALLSIGN_MIN_LENGTH = 4
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
}

export const DEFAULT_SEARCH_STATE: VesselSearchState = {
  searchOption: 'basic',
  ...EMPTY_SEARCH_FILTERS,
}
