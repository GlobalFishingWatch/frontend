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
  'Current Vessel Flag (3-alpha code)': string
  'Vessel Name': string
  'Vessel registration number': string
  'International radio call sign (if any)'?: string
  'UVI (Unique Vessel Identifier)/ IMO Number (if allocated)'?: string
  'Previous names (if known)': string
  'Port of registry': string
  'Previous flag (if any)': string
  'Type of vessel (ISSCFV code)': string
  'Type of fishing method (ISSCFG code)': string
  'Length (m)': number
  'Length Type': string
  'Gross Tonnage (GT)': number
  'Power of main engine(s) (kW)': number
  'Hold capacity (m3)': number
  'Name of owner(s)': string
  'Address of owner(s)': string
  'Flag Authorisation Start Date (YYYY-MON-DD)': string
  'Flag Authorisation End Date (YYYY-MON-DD)': string
  '3 recent photographs supplied? (y/n)': 'y' | 'n'
  'Vessel communication types and identification': string
  'VMS system (brand, model etc)': string
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
