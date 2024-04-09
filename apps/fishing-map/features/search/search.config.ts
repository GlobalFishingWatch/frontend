import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { MultiSelectOption, SelectOption } from '@globalfishingwatch/ui-components'
import { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import { VesselSearchState } from 'types'

export const MIN_SEARCH_CHARACTERS = 3

export type SearchType = 'basic' | 'advanced'

export type SearchFilterSelections = {
  query?: string
  lastTransmissionDate?: string
  firstTransmissionDate?: string
  ssvid?: string
  imo?: string
  callsign?: string
  owner?: string
  sources?: MultiSelectOption<string>[]
  infoSource?: SelectOption<VesselIdentitySourceEnum>[]
} & Partial<Record<SupportedDatasetSchema, MultiSelectOption<string>[]>>

export const RESULTS_PER_PAGE = 20
export const SSVID_LENGTH = 9
export const IMO_LENGTH = 7
export const EMPTY_FILTERS = {
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
  ...EMPTY_FILTERS,
}
