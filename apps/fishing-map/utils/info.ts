import { Vessel } from '@globalfishingwatch/api-types'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const upperFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()

export const formatInfoField = (fieldValue: string, type: string) => {
  if (!fieldValue && type === 'name') return t('common.unknownVessel', 'Unknown Vessel')
  if (!fieldValue) return EMPTY_FIELD_PLACEHOLDER
  if (type === 'name') return fieldValue.replace(/\b(?![LXIVCDM]+\b)([A-Z,Ñ]+)\b/g, upperFirst)
  if (type === 'fleet') {
    const fleetClean = fieldValue.replaceAll('_', ' ')
    return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
  }
  return fieldValue
}

export const formatNumber = (num: string | number, maximumFractionDigits?: number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits || (number < 10 ? 2 : 0),
  })
}

export const getVesselLabel = (vessel: ExtendedFeatureVessel | Vessel, withGearType = false) => {
  if (!vessel) return t('common.unknownVessel', 'Unknown vessel')
  if (vessel.shipname && vessel.geartype && vessel.flag && withGearType) {
    return `${formatInfoField(vessel.shipname, 'name')}
    (${t(`flags:${vessel.flag}`)}, ${t(
      `vessel.gearTypes.${vessel.geartype}` as any,
      EMPTY_FIELD_PLACEHOLDER
    )})`
  }
  if (vessel.shipname) return formatInfoField(vessel.shipname, 'name')
  if (vessel.registeredGearType) {
    return `${t('vessel.unkwownVesselByGeartype', {
      gearType: vessel.registeredGearType,
    })}`
  }
  return t('common.unknownVessel', 'Unknown vessel')
}

// 'any' is used here as timestamp is not declared in Vessel anyways
export const getDetectionsTimestamps = (vessel: any) => {
  return vessel?.timestamp?.split(',').sort()
}
