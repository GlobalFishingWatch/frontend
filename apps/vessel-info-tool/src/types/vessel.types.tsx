import type { ColumnFiltersState } from '@tanstack/react-table'

import type { SelectOption, SliderRangeConfig } from '@globalfishingwatch/ui-components'

export type VesselParams = {
  name: string | null
  imo: string | null
  mmsi: string | null
}

export type Vessel = {
  id: string
  name: string
} & Record<string, any>

export interface ICCATVessel {
  ICCATSerialNo: string
  NatRegNo: string
  IntRegNo: string
  IRNoType: 'IMO'
  IRCS: string
  VesselNameCur: string
  VesselNamePrv?: string
  FlagCurCd: string
  FlagPrvCd?: string
  OwnerID?: string // link to ICCATOwner.OwOpEntityID
  IsscfvID: string
  IsscfgID: string
  LengthM: number
  LenType: 'LOA'
  Tonnage: number
  TonType: 'GT' | 'GRT'
  CarCapacity: number
  CCapUnitCd: 'm3' //| 'cf' for cubic feet if needed in future

  //optional fields
  ExternalMark?: string
  YrBuilt?: string
  ShipyNat?: string
  HomePort?: string
  DepthM?: number
  EngineHP?: number
  VMSSysCd?: string
}

export interface ICCATOwner {
  OwOpEntityID: string // Insert consecutive number. This number should be transposed to Form CP01-A, (owner /operator ID fields) for each vessel owned or operated by this person/company.
  OwOpName: string
  OwOpAddrs?: string
  OwOpCity?: string
  OwOpZipCd?: string
  OwOpCtry?: string
  OwOpEmail?: string
  OwOpTel?: string
}

export interface SPRFMOVessel {
  currentVesselFlag: string // 3-alpha code
  vesselName: string
  vesselRegistrationNumber: string
  internationalRadioCallSign?: string
  uviOrImoNumber?: string
  previousNames?: string
  portOfRegistry?: string
  previousFlag?: string
  vesselTypeCode?: string // ISSCFV
  fishingMethodCode?: string // ISSCFG
  yearBuilt?: number
  placeBuilt?: string
  lengthMeters?: number
  lengthType?: string //“LOA”, “LBP”
  mouldedDepthMeters?: number
  beamMeters?: number
  grossTonnageGt?: number
  grossRegisterTonnageGrt?: number
  enginePowerKw?: number
  holdCapacityM3?: number
  ownerName?: string
  ownerAddress?: string
  operatorName?: string
  operatorAddress?: string
  flagAuthStartDate?: string // YYYY-MON-DD
  flagAuthEndDate?: string // YYYY-MON-DD
  recentPhotographsSupplied?: boolean
  freezerType?: string
  numberOfFreezerUnits?: number
  freezingCapacityTonsPerDay?: number
  communicationTypes?: string
  vmsSystem?: string
  externalMarkings?: string
  fishProcessingTypes?: string
  electronics?: string
  licenseOwner?: string
  licenseOwnerAddress?: string
  vesselMaster?: string
  vesselMasterNationality?: string
  fishingMaster?: string
  fishingMasterNationality?: string
}

export type ExportableVessel = Vessel | ICCATVessel | SPRFMOVessel | Record<string, any>

export type FilterType = 'select' | 'text' | 'date' | 'number' | ''

export interface FilterState {
  id: string
  value: any
  label?: string
  type?: FilterType
  options?: SelectOption[]
  numberConfig?: SliderRangeConfig
}
export interface ExpandedRowData {
  [key: string]: any
}
export interface TableSearchParams {
  selectedRows?: string
  sourceSystem?: 'brazil' | 'panama'
  rfmo?: RFMO
  globalSearch?: string
  columnFilters: ColumnFiltersState
}
export interface FiltersState {
  filterConfigs: FilterState[]
  globalFilter: string
  filteredData: any[]
  isLoading: boolean
  urlSyncEnabled: boolean
  debounceMs: number
}

export enum RFMO {
  ICCAT = 'iccat',
  SPRFMO = 'sprfmo',
  GR = 'gr',
}

export enum ActionRequest {
  AddNewVessels = 1,
  ChangesToSomeVessels = 2,
  FullRevisionOfVesselRecord = 3,
}
