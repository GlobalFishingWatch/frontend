import type { SelectOption } from '@globalfishingwatch/ui-components'

export type VesselParams = {
  name: string | null
  imo: string | null
  mmsi: string | null
}

export type Vessel = Record<string, any>

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
