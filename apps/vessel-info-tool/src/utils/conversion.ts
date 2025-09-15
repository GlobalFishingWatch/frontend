import type { RFMO, Vessel } from '@/types/vessel.types'

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

export function convertOutput(
  mapping: Record<string, string>,
  data: Record<string, any>[]
): Record<string, any>[] {
  return data.map((row) => {
    const newRow: Record<string, any> = {}
    for (const [sourceKey, targetKey] of Object.entries(mapping)) {
      if (row[sourceKey] !== undefined) {
        newRow[targetKey] = row[sourceKey]
      }
    }
    return newRow
  })
}

export const parseVessels = (
  data: Vessel[],
  sourceSystem: 'brazil' | 'panama',
  targetSystem: RFMO
) => {
  if (!data.length) return []
  const sourceMap = sourceSystem === 'brazil' ? brazilToICCAT : panamaToICCAT

  const normalizedData = data.map((row) => {
    const normalizedRow: Record<string, any> = {}
    for (const [key, value] of Object.entries(row)) {
      const mappedKey = sourceMap[key] ?? key
      normalizedRow[mappedKey] = value
    }
    return normalizedRow
  })

  return normalizedData
}
