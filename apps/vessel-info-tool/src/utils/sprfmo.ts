import ExcelJS from 'exceljs'

import type { ExportableVessel, SPRFMOVessel, Vessel } from '@/types/vessel.types'

import { identifySourceSystem } from './source'

// requisits: https://www.sprfmo.int/assets/Fisheries/Conservation-and-Management-Measures/2023-CMMs/CMM-05-2023-Record-of-Vessels_29Mar23.pdf page3

export const brazilToSPRFMO: Record<string, string> = {
  'Nome da Embarcação': 'vesselName',
  'Número de Inscrição no RGP (PPP ou RAEP)': '', // vesselRegistrationNumber?
  'Número de Inscrição na Marinha do Brasil': 'vesselRegistrationNumber',
  AB: 'grossTonnageGt', // grossRegisterTonnageGrt?
  Comprimento: 'lengthMeters',
  HP: 'enginePowerKw',
  'Capacidade do Porão': 'holdCapacityM3', // or is carCapacity Volume do Tanque?
  //Status 'cancelado' - use for mapping vessel name prev and flag prev

  UF: 'ownerAddress',

  // these need conversion functions
  //   "Número da Frota": "IsscfvID",
  //   "Código IN": "",
  //   "Petrecho": "",
}

export const panamaToSPRFMO: Record<string, string> = {
  'VESSEL NAME / NOMBRE DE LA NAVE': 'vesselName',
  'SHIPOWNER / PROPIETARIO': 'ownerName',
  //LICENSE / LICENCIA,LICENSE TYPE/ TIPO DE LICENCIA /VALID LICENSE DATE / FECHA DE VENCIMIENTO DE LA LICENCIA
  'VESSEL TYPE / TIPO DE EMBARCACIÓN - FISHING GEAR / ARTE DE PESCA': 'vesselTypeCode',
  IMO: 'uviOrImoNumber',
  'IRCS / LETRAS DE RADIO': 'internationalRadioCallSign',
  'NATIONAL REGISTER NUMBER / PATENTE DE NAVEGACION': 'vesselRegistrationNumber',
  'LENGHT / ESLORA': 'lengthMeters',
  'GROSS TONNAGE / TONELAJE DE REGISTRO BRUTO (TRB)': 'grossTonnageGt',
  'HOLD CAPACITY (M3) / CAPACIDAD DE BODEGA (M 3 )': 'holdCapacityM3',
}

export const parseVessels = (data: Vessel[]): SPRFMOVessel[] | null => {
  if (!data.length) return null

  const sourceSystem = identifySourceSystem(data[0])
  if (!sourceSystem) throw new Error('Unable to identify source system')
  const sourceMap = sourceSystem === 'brazil' ? brazilToSPRFMO : panamaToSPRFMO

  return data.map((row) => {
    const normalizedRow: Record<string, any> = {}
    for (const [key, value] of Object.entries(row)) {
      const mappedKey = sourceMap[key] ?? key
      normalizedRow[mappedKey] = value
    }

    const flag = sourceSystem === 'brazil' ? 'BRA' : 'PAN'

    const recentPhotosValue = normalizedRow['recentPhotographsSupplied']
    const recentPhotographsSupplied =
      typeof recentPhotosValue === 'string'
        ? ['true', 'yes', 'y', '1'].includes(recentPhotosValue.trim().toLowerCase())
        : Boolean(recentPhotosValue)

    const vessel = {
      currentVesselFlag: flag,
      vesselName: normalizedRow['vesselName'] ?? '',
      vesselRegistrationNumber: normalizedRow['vesselRegistrationNumber'] ?? '',
      internationalRadioCallSign: normalizedRow['internationalRadioCallSign'] ?? undefined,
      uviOrImoNumber: normalizedRow['uviOrImoNumber'] ?? undefined,
      //   previousNames: prevVessel?.VesselName || normalizedRow['previousNames'] || undefined,
      portOfRegistry: normalizedRow['portOfRegistry'] ?? undefined,
      //   previousFlag:normalizedRow['previousFlag'] || undefined,
      vesselTypeCode: normalizedRow['vesselTypeCode'] ?? undefined,
      fishingMethodCode: normalizedRow['fishingMethodCode'] ?? undefined,
      yearBuilt:
        normalizedRow['yearBuilt'] !== undefined && normalizedRow['yearBuilt'] !== ''
          ? Number(normalizedRow['yearBuilt'])
          : undefined,
      placeBuilt: normalizedRow['placeBuilt'] ?? undefined,
      lengthMeters:
        normalizedRow['lengthMeters'] !== undefined && normalizedRow['lengthMeters'] !== ''
          ? Number(normalizedRow['lengthMeters'])
          : undefined,
      lengthType: normalizedRow['lengthType'] ?? 'LOA',
      mouldedDepthMeters:
        normalizedRow['mouldedDepthMeters'] !== undefined &&
        normalizedRow['mouldedDepthMeters'] !== ''
          ? Number(normalizedRow['mouldedDepthMeters'])
          : undefined,
      beamMeters:
        normalizedRow['beamMeters'] !== undefined && normalizedRow['beamMeters'] !== ''
          ? Number(normalizedRow['beamMeters'])
          : undefined,
      grossTonnageGt:
        normalizedRow['grossTonnageGt'] !== undefined && normalizedRow['grossTonnageGt'] !== ''
          ? Number(normalizedRow['grossTonnageGt'])
          : undefined,
      grossRegisterTonnageGrt:
        normalizedRow['grossRegisterTonnageGrt'] !== undefined &&
        normalizedRow['grossRegisterTonnageGrt'] !== ''
          ? Number(normalizedRow['grossRegisterTonnageGrt'])
          : undefined,
      enginePowerKw:
        normalizedRow['enginePowerKw'] !== undefined && normalizedRow['enginePowerKw'] !== ''
          ? Number(normalizedRow['enginePowerKw'])
          : undefined,
      holdCapacityM3:
        normalizedRow['holdCapacityM3'] !== undefined && normalizedRow['holdCapacityM3'] !== ''
          ? Number(normalizedRow['holdCapacityM3'])
          : undefined,
      ownerName: normalizedRow['ownerName'] ?? undefined,
      ownerAddress: normalizedRow['ownerAddress'] ?? undefined,
      operatorName: normalizedRow['operatorName'] ?? undefined,
      operatorAddress: normalizedRow['operatorAddress'] ?? undefined,
      flagAuthStartDate: normalizedRow['flagAuthStartDate'] ?? undefined,
      flagAuthEndDate: normalizedRow['flagAuthEndDate'] ?? undefined,
      recentPhotographsSupplied,
      freezerType: normalizedRow['freezerType'] ?? undefined,
      numberOfFreezerUnits:
        normalizedRow['numberOfFreezerUnits'] !== undefined &&
        normalizedRow['numberOfFreezerUnits'] !== ''
          ? Number(normalizedRow['numberOfFreezerUnits'])
          : undefined,
      freezingCapacityTonsPerDay:
        normalizedRow['freezingCapacityTonsPerDay'] !== undefined &&
        normalizedRow['freezingCapacityTonsPerDay'] !== ''
          ? Number(normalizedRow['freezingCapacityTonsPerDay'])
          : undefined,
      communicationTypes: normalizedRow['communicationTypes'] ?? undefined,
      vmsSystem: normalizedRow['vmsSystem'] ?? 'NO-VMS',
      externalMarkings: normalizedRow['externalMarkings'] ?? undefined,
      fishProcessingTypes: normalizedRow['fishProcessingTypes'] ?? undefined,
      electronics: normalizedRow['electronics'] ?? undefined,
      licenseOwner: normalizedRow['licenseOwner'] ?? undefined,
      licenseOwnerAddress: normalizedRow['licenseOwnerAddress'] ?? undefined,
      vesselMaster: normalizedRow['vesselMaster'] ?? undefined,
      vesselMasterNationality: normalizedRow['vesselMasterNationality'] ?? undefined,
      fishingMaster: normalizedRow['fishingMaster'] ?? undefined,
      fishingMasterNationality: normalizedRow['fishingMasterNationality'] ?? undefined,
    }

    return vessel
  })
}

export const handleExportSPRFMOVessels = async (vessels: ExportableVessel[]) => {
  try {
    const templateResponse = await fetch('./data/templates/sprfmo-template.xlsx')
    const templateBuffer = await templateResponse.arrayBuffer()

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(templateBuffer)
    const vesselWorksheet = workbook.getWorksheet(workbook.worksheets[0]?.name)

    if (!vesselWorksheet) {
      throw new Error('Worksheet not found')
    }

    const vesselKeys = Object.keys(vessels[0])

    vessels.forEach((vessel, vesselIndex) => {
      const row = vesselIndex + 2
      vesselKeys.forEach((key, colIndex) => {
        const col = colIndex + 1
        vesselWorksheet.getCell(row, col).value = vessel[key as keyof ExportableVessel] ?? ''
      })
    })

    const outputBuffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob([outputBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'sprfmo-vessels.xlsx'
    link.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting SPRFMO vessels from buffer:', error)
    throw error
  }
}
