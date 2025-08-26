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
export interface FieldMapConfig {
  gr: string
  iccat: string
  sprfmo: string
  variants?: string[]
  mandatory: boolean
}

export type FieldMap = Record<string, FieldMapConfig>

export const fieldMap: FieldMap = {
  id: {
    gr: 'IMO',
    iccat: 'IntRegNo',
    sprfmo: "Lloyd's",
    variants: [
      'RGP Registration Number (PPP or RAEP)',
      'id',
      'codigo marinha',
      'Número de Inscrição na Marinha do Brasil',
      'Unique Vessel Identifier (UVI)',
    ],
    mandatory: true,
  },
  name: {
    iccat: 'VesselNameCur',
    sprfmo: 'Vessel Name',
    gr: 'Vessel Name',
    variants: ['Nombre del Buque', 'NOMBRE DE LA NAVE', 'nome', 'shipname', 'name'],
    mandatory: true,
  },
  flag: {
    iccat: 'FlagCurCd',
    sprfmo: 'Vessel Flag',
    gr: 'Current Flag State',
    mandatory: true,
  },
  length: {
    iccat: 'LengthM',
    sprfmo: 'Length(m)',
    gr: 'Length Overall (LOA)(m)',
    variants: ['eslora', 'Lenght'],
    mandatory: true,
  },
  tonnage: {
    iccat: 'Tonnage',
    sprfmo: 'Gross tonnage',
    gr: 'Gross Tonnage (GT)', // same as Gross Registered Tonnage (GRT)?
    variants: ['Gross Register Tonnage (GRT)', 'AB', 'Tonelaje de registro bruto (TRB)'],
    mandatory: true,
  },
  callsign: {
    iccat: 'CallSign',
    sprfmo: 'Call sign',
    gr: 'IRCS',
    variants: ['Internat. IRCS', 'Código de Chamada de Rádio', 'Letras de radio'],
    mandatory: false,
  },
  nationalRegistry: {
    iccat: 'NatRegNo',
    sprfmo: 'National Registry',
    gr: 'National Registration Number',
    variants: [
      'Nat. Registry No.',
      'NATIONAL REGISTER NUMBER',
      'PATENTE DE NAVEGACION',
      'Patente de Navegación',
      'NRN',
      'TIE',
      'TIEM',
      'RGP',
      'Número de Inscrição na Marinha do Brasil',
    ],
    mandatory: false,
  },
  vesselType: {
    iccat: 'IsscfvID',
    sprfmo: 'Vessel Type',
    gr: 'Vessel Type',
    variants: ['Tipo de Embarcación', 'Número da Frota'],
    mandatory: false,
  },
  holdCapacity: {
    iccat: 'HoldCapacity',
    sprfmo: 'Hold Capacity',
    gr: 'Fish Hold Capacity',
    variants: ['Hold capacity (m3)', 'Capacidad de bodega (m3)'],
    mandatory: false,
  },
  ownerName: {
    iccat: '',
    sprfmo: '',
    gr: 'Owner Name',
    variants: ['Propietario', 'Shipowner', 'Name', 'CPF'],
    mandatory: false,
  },
  yearBuilt: {
    iccat: 'YrBuilt',
    sprfmo: 'When Built',
    gr: 'Year Built',
    variants: ['Year of construction ', 'Ano de Construção'],
    mandatory: false,
  },
}
