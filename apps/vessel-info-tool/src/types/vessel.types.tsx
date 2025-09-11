import type { SelectOption } from '@globalfishingwatch/ui-components'

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
  label: string
  type: FilterType
  options?: SelectOption[]
  filteredValue?: any
}
export interface ExpandedRowData {
  [key: string]: any
}
export interface TableSearchParams {
  search?: string
  filters?: Record<string, string | string[]>
}
export interface FiltersState {
  filterConfigs: FilterState[]
  globalFilter: string
  filteredData: any[]
  originalData: any[]
  isLoading: boolean
  urlSyncEnabled: boolean
  debounceMs: number
}

export enum RFMO {
  ICCAT = 'iccat',
  SPRFMO = 'sprfmo',
  GR = 'gr',
}
