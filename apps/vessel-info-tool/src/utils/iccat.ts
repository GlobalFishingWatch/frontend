import type { Vessel } from '@/types/vessel.types'

import type flags from 'data/iccat/flags'
import type gearTypes from 'data/iccat/gearType'
import type vesselType from 'data/iccat/vesselType'

import { identifySourceSystem, normalizeKey } from './source'

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
  OwnerID?: string // link to ICCATOwner.OwOpEntityID
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

export interface ICCATOwner {
  OwOpEntityID: string // Insert consecutive number. This number should be transposed to Form CP01-A, (owner /operator ID fields) for each vessel owned or operated by this person/company.
  OwOpName: string
  OwOpAddrs: string
  OwOpCity: string
  OwOpZipCd: string
  OwOpCtry: typeof flags
  OwOpEmail?: string
  OwOpTel?: string
}

export const brazilToICCAT: Record<string, string> = {
  'Nome da Embarcação': 'VesselNameCur',
  'Número de Inscrição no RGP (PPP ou RAEP)': 'IntRegNo',
  'Número de Inscrição na Marinha do Brasil': 'NatRegNo',
  AB: 'Tonnage',
  Comprimento: 'LengthM',
  HP: 'EngineHP',
  'Capacidade do Porão': 'CarCapacity', // or is carCapacity Volume do Tanque?
  //Status 'cancelado' - use for mapping vessel name prev and flag prev

  UF: 'OwOpAddrs',

  // these need conversion functions
  //   "Número da Frota": "IsscfvID",
  //   "Código IN": "",
  //   "Petrecho": "",
}

export const panamaToICCAT: Record<string, string> = {
  'VESSEL NAME / NOMBRE DE LA NAVE': 'VesselNameCur',
  'SHIPOWNER / PROPIETARIO': 'OwOpName',
  //LICENSE / LICENCIA,LICENSE TYPE/ TIPO DE LICENCIA /VALID LICENSE DATE / FECHA DE VENCIMIENTO DE LA LICENCIA
  'VESSEL TYPE / TIPO DE EMBARCACIÓN - FISHING GEAR / ARTE DE PESCA': 'IsscfvID / IsscfgID',
  IMO: 'IntRegNo',
  'IRCS / LETRAS DE RADIO': 'IRCS',
  'NATIONAL REGISTER NUMBER / PATENTE DE NAVEGACION': 'NatRegNo',
  'LENGHT / ESLORA': 'LengthM',
  'GROSS TONNAGE / TONELAJE DE REGISTRO BRUTO (TRB)': 'Tonnage',
  'HOLD CAPACITY (M3) / CAPACIDAD DE BODEGA (M3)': 'CarCapacity',
}

const getPrevICCATVessel = (imo: string): ICCATVessel | undefined => {
  // Implement logic to retrieve the previous ICCAT vessel ID
  return undefined
}

const convertVesselType = (type: string): typeof vesselType => {
  // Implement conversion logic
  return type as typeof vesselType
}

const convertGearType = (type: string): typeof gearTypes => {
  // Implement conversion logic
  return type as typeof gearTypes
}

const generateOwnerList = (data: Vessel[]): ICCATOwner[] => {
  // Implement logic to generate owner list
  return []
}

export const parseVessels = (data: Vessel[]): ICCATVessel[] => {
  if (!data.length) return []

  const sourceSystem = identifySourceSystem(data[0])
  console.log('🚀 ~ parseVessels ~ sourceSystem:', sourceSystem)
  const sourceMap = sourceSystem === 'brazil' ? brazilToICCAT : panamaToICCAT
  const ownerList = generateOwnerList(data)

  return data.map((row) => {
    const normalizedRow: Record<string, any> = {}
    for (const [key, value] of Object.entries(row)) {
      const mappedKey = sourceMap[key] ?? key
      normalizedRow[mappedKey] = value
    }

    const flag = sourceSystem === 'brazil' ? 'BRA' : 'PAN'

    const prevVessel = getPrevICCATVessel(row.IMO)

    const vessel: ICCATVessel = {
      ICCATSerialNo: prevVessel?.ICCATSerialNo ?? '',
      NatRegNo: normalizedRow['NatRegNo'] ?? undefined,
      IntRegNo: normalizedRow['IntRegNo'] ?? undefined,
      IRNoType: 'IMO',
      IRCS: normalizedRow['IRCS'] ?? undefined,
      VesselNameCur: normalizedRow['VesselNameCur'] ?? undefined,
      VesselNamePrv: prevVessel?.VesselNameCur ?? undefined,
      FlagCurCd: normalizedRow['FlagCurCd'] ?? flag,
      FlagPrvCd: prevVessel?.FlagCurCd ?? undefined,
      OwnerID: ownerList.find((owner) => owner.OwOpName === row['OwOpName'])?.OwOpEntityID,
      IsscfvID: normalizedRow['IsscfvID'],
      IsscfgID: normalizedRow['IsscfgID'],
      LengthM: normalizedRow['LengthM'] ?? undefined,
      LenType: 'LOA',
      Tonnage: normalizedRow['Tonnage'] ?? undefined,
      TonType: 'GT',
      CarCapacity: normalizedRow['CarCapacity'] ?? undefined,
      CCapUnitCd: 'm3',

      // optional
      ExternalMark: normalizedRow['ExternalMark'],
      YrBuilt: normalizedRow['YrBuilt'],
      ShipyNat: normalizedRow['ShipyNat'],
      HomePort: normalizedRow['HomePort'],
      DepthM: normalizedRow['DepthM'] ? Number(normalizedRow['DepthM']) : undefined,
      EngineHP: normalizedRow['EngineHP'] ? Number(normalizedRow['EngineHP']) : undefined,
      VMSSysCd: normalizedRow['VMSSysCd'],
    }

    return vessel
  })
}
