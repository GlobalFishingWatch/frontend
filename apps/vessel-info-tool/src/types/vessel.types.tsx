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
  [key: string]: string | string[] | undefined
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
