import { notFound } from '@tanstack/react-router'
import ExcelJS from 'exceljs'

import type { ExportableVessel, ICCATOwner, ICCATVessel, Vessel } from '@/types/vessel.types'
import type { UserData } from '@globalfishingwatch/api-types'

import type gearTypes from 'data/iccat/gearType'
import type vesselType from 'data/iccat/vesselType'

import { identifySourceSystem } from './source'

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
  'HOLD CAPACITY (M3) / CAPACIDAD DE BODEGA (M 3 )': 'CarCapacity',
}

const convertVesselType = (type: string) => {
  // Implement conversion logic
  return ''
}

const convertGearType = (type: string) => {
  // Implement conversion logic
  return ''
}

const generateOwnerList = (data: Vessel[]): ICCATOwner[] => {
  const ownerField = Object.keys(data[0]).find(
    (key) => key.toLowerCase().includes('owner') || key.toLowerCase().includes('proprietario')
  )

  if (!ownerField) return []

  const owners = data.reduce((acc: ICCATOwner[], vessel) => {
    const existingOwner = acc.find((owner) => owner.OwOpName === vessel[ownerField])
    if (!existingOwner) {
      acc.push({
        OwOpEntityID: String(acc.length + 1),
        OwOpName: vessel[ownerField],
      })
    }
    return acc
  }, [])
  return owners
}

export const parseVessels = async (data: Vessel[]) => {
  if (!data.length) return null

  const sourceSystem = identifySourceSystem(data[0])
  if (!sourceSystem) throw new Error('Unable to identify source system')
  const sourceMap = sourceSystem === 'brazil' ? brazilToICCAT : panamaToICCAT
  const ownerList = generateOwnerList(data)
  const prevVesselList = await fetchPrevICCATVessels(sourceSystem)

  const iccatVessels = data.map((row) => {
    const normalizedRow: Record<string, any> = {}
    for (const [key, value] of Object.entries(row)) {
      const mappedKey = sourceMap[key] ?? key
      normalizedRow[mappedKey] = value
    }

    const flag = sourceSystem === 'brazil' ? 'BRA' : 'PAN'
    const prevVessel = prevVesselList.find((vessel) => vessel.IntRegNo === String(row.IMO))

    const vessel: ICCATVessel = {
      ICCATSerialNo: prevVessel?.ICCATSerialNo ?? '',
      NatRegNo: normalizedRow['NatRegNo'] ?? undefined,
      IntRegNo: normalizedRow['IntRegNo'] ?? undefined,
      IRNoType: 'IMO',
      IRCS: normalizedRow['IRCS'] ?? undefined,
      VesselNameCur: normalizedRow['VesselNameCur'] ?? undefined,
      VesselNamePrv: prevVessel?.VesselName || undefined,
      FlagCurCd: flag,
      FlagPrvCd: prevVessel?.FlagVesCode || prevVessel?.FlagRepCode || undefined,
      OwnerID: ownerList.find((owner) => owner.OwOpName === row['OwOpName'])?.OwOpEntityID ?? '',
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
      VMSSysCd: normalizedRow['VMSSysCd'] ?? 'NO-VMS',
    }

    return vessel
  })
  return { iccatVessels, ownerList }
}

enum AuthorizationCategories {
  P20m = 'Positive list (LOA >= 20 meters)',
  SWO = 'sworfish',
  ALB = 'albacore',
  TROP = 'BET/YFT/SKJ', // authorized to fish for any of the three major tropical species: bigeye, yellowfin, skipjack
  Carr = 'carrier',
  BFEo = 'E-BFT Other', // towing, support, auxiliary vessels, regardless of size
}

type Authorization = {
  category: AuthorizationCategories
  DtFrom: string // YYYY-MON-DD
  DtTo: string // YYYY-MON-DD
  RM: 'AUTO' | 'EXPL' // Renewal(auto/explicit)
  fishType?: 'SWO' | 'ALB' | 'TROP'
}

const generateAuthorizations = (data: Vessel[]) => {
  // check if all vessels are greater than 20m, if not, let user know which ones are <20m
  const under20mVessels = data.filter((vessel) => vessel.LengthM < 20)
  if (under20mVessels.length) {
    alert(
      'The following vessels are under 20m:' +
        under20mVessels.map((v) => v.VesselNameCur).join(', ')
    )
    // remove? btn
  }
  // Start date cannot be more than 45 days before submission of form.
  const startDate = new Date() // permission date from
  startDate.setDate(startDate.getDate() - 45)

  // separate vessels into categories
  // Implement logic to generate authorizations
  return []
}

const writeToSheet = (
  worksheet: ExcelJS.Worksheet,
  rowStart: number,
  vessels: ExportableVessel[]
) => {
  const headerRow = worksheet.getRow(rowStart)
  const headers: { [key: string]: number } = {}

  headerRow.eachCell((cell, colNumber) => {
    if (cell.value) {
      headers[String(cell.value)] = colNumber
    }
  })

  vessels.forEach((vessel: { [key: string]: any }, index: number) => {
    const row = worksheet.getRow(rowStart + 1 + index)

    Object.keys(vessel).forEach((field: string) => {
      const colIndex = headers[field]
      if (colIndex) {
        const cell = row.getCell(colIndex)
        cell.value = vessel[field]
      }
    })
  })
}

const fillInUserInfo = (worksheet: ExcelJS.Worksheet, user: UserData) => {
  worksheet.getCell('B5').value = user.firstName + ' ' + user.lastName
  worksheet.getCell('B6').value = user.organization //reportingAgency
  // worksheet.getCell('B7').value = user.address
  worksheet.getCell('B10').value = user.country // reportingFlag
  worksheet.getCell('G5').value = user.email
  // worksheet.getCell('G6').value = user.phone
  worksheet.getCell('B12').value = '3. Full revision of vessel record'
}

export const handleExportICCATVessels = async (
  vessels: ExportableVessel[],
  owners: ICCATOwner[],
  user: UserData
) => {
  try {
    const templateResponse = await fetch('./data/templates/iccat-template.xlsx')
    const templateBuffer = await templateResponse.arrayBuffer()

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(templateBuffer)
    const vesselWorksheet = workbook.getWorksheet(workbook.worksheets[0]?.name)
    const authorizationsWorksheet = workbook.getWorksheet(workbook.worksheets[1]?.name)
    const ownersWorksheet = workbook.getWorksheet(workbook.worksheets[2]?.name)
    console.log('🚀 ~ handleExportICCATVessels ~ workbook.worksheets:', workbook.worksheets)

    if (!vesselWorksheet || !ownersWorksheet || !authorizationsWorksheet) {
      throw new Error('Worksheet not found')
    }

    fillInUserInfo(vesselWorksheet, user)

    writeToSheet(vesselWorksheet, 23, vessels) // fill in vessel information
    writeToSheet(ownersWorksheet, 20, owners) // fill in owner sheet

    //fill in authorization sheet

    const outputBuffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob([outputBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'iccat-vessels.xlsx'
    link.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting ICCAT vessels from buffer:', error)
    throw error
  }
}

export const fetchPrevICCATVessels = async (source: string) => {
  const res = await fetch(`/api/iccat/${source}`)
  if (!res.ok) {
    if (res.status === 404) {
      throw notFound()
    }

    throw new Error('Failed to fetch post')
  }

  const vessels = (await res.json()) as ICCATVessel[]
  return vessels
}
