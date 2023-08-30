import { MultiSelectOption, SelectOption } from '@globalfishingwatch/ui-components'
import { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import { VesselSearchState } from 'types'

export type SearchType = 'basic' | 'advanced'
export enum VesselIdentitySourceEnum {
  Registry = 'registryInfo',
  SelfReported = 'selfReportedInfo',
}

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
  sources: undefined,
  lastTransmissionDate: '',
  firstTransmissionDate: '',
  ssvid: undefined,
  imo: undefined,
  callsign: undefined,
  owner: undefined,
  codMarinha: undefined,
  geartype: undefined,
  targetSpecies: undefined,
  fleet: undefined,
  origin: undefined,
}

export const DEFAULT_SEARCH_STATE: VesselSearchState = {
  searchOption: 'basic',
  infoSource: VesselIdentitySourceEnum.SelfReported,
  ...EMPTY_FILTERS,
}
