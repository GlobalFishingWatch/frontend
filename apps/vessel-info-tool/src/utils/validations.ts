import type flags from 'data/iccat/flags'
import type gearTypes from 'data/iccat/gearType'
import type vesselType from 'data/iccat/vesselType'

export interface ICCATVessel {
  ICCATSerialNo: string
  NatRegNo: string
  IntRegNo: string
  IRNoType: 'IMO'
  IRCS: string
  VesselNameCur: string
  VesselNamePrv?: string
  FlagCurCd: typeof flags
  FlagPrvCd?: typeof flags
  // owner: {
  //   OwOpEntityID: string
  //   OwOpName: string
  //   OwOpAddrs: string
  //   OwOpCity: string
  //   OwOpZipCd: string
  //   OwOpCtry: typeof flags
  //   OwOpEmail?: string
  //   OwOpTel?: string
  // }
  IsscfvID: typeof vesselType
  IsscfgID: typeof gearTypes
  LengthM: number
  LenType: 'LOA'
  Tonnage: number
  TonType: 'GT' | 'GRT'
  CarCapacity: number
  CCapUnitCd: 'm3' //| 'cf' for cubic feet if needed in future

  //optional fields
  ExternalMark?: string
  YrBuilt?: string
  ShipyNat?: typeof flags
  HomePort?: string
  DepthM?: number
  EngineHP?: number
  VMSSysCd?: string
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

export type MissingFieldsTableType = {
  field: string
  format: string
  emptyRows: number | 'All'
  fallbackValue?: string
}

export function checkMissingMandatoryFields(data: Record<string, any>[]): MissingFieldsTableType[] {
  if (data.length === 0) return []
  const keys = Object.keys(data[0]) as (keyof (ICCATVessel | SPRFMOVessel))[]

  return keys
    .map((field) => {
      let emptyRows = 0

      for (const row of data) {
        const value = row[field]
        if (value === undefined || value === null || value === '') {
          emptyRows++
        }
      }

      if (emptyRows > 0) {
        return {
          field: field as string,
          format: typeof data[0][field],
          emptyRows: emptyRows === data.length ? 'All' : emptyRows,
          fallbackValue: loadFallbackValue(field as string),
        }
      }

      return undefined
    })
    .filter(Boolean) as MissingFieldsTableType[]
}

// loading fallback values
const STORAGE_KEY = 'vesselFallbackValues'

type FallbackValues = Record<string, string>

export function saveFallbackValues(values: FallbackValues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
}

export function loadFallbackValues(): FallbackValues {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : {}
}

export function loadFallbackValue(field: string): string | undefined {
  const values = loadFallbackValues()
  return values[field]
}
