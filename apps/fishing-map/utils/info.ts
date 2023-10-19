import { get } from 'lodash'
import { IdentityVessel, Vessel } from '@globalfishingwatch/api-types'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { VesselRenderField } from 'features/vessel/vessel.config'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getLatestIdentityPrioritised } from 'features/vessel/vessel.utils'
import { VesselDataIdentity } from 'features/vessel/vessel.slice'
import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const upperFirst = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

export const formatInfoField = (
  fieldValue: string | string[] | number,
  type: string,
  translationFn = t
) => {
  if (fieldValue) {
    if (typeof fieldValue === 'string') {
      if (type === 'flag' || type === 'ownerFlag') {
        return translationFn(`flags:${fieldValue}` as any, fieldValue)
      }
      if (type === 'shiptype' || type === 'vesselType') {
        return translationFn(`vessel.vesselTypes.${fieldValue?.toLowerCase()}` as any, fieldValue)
      }
      if (!fieldValue && (type === 'name' || type === 'shipname')) {
        return translationFn('common.unknownVessel', 'Unknown Vessel')
      }
      if (type === 'name' || type === 'shipname' || type === 'owner' || type === 'port') {
        return fieldValue.replace(
          /\b(?![LXIVCDM]+\b)([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ]+)\b/g,
          upperFirst
        )
      }
      if (type === 'fleet') {
        const fleetClean = fieldValue.replaceAll('_', ' ')
        return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
      }
    } else if (Array.isArray(fieldValue)) {
      if (type === 'geartype') {
        return getVesselGearType({ geartype: fieldValue })
      }
    } else {
      return formatI18nNumber(fieldValue)
    }
    return fieldValue
  }
  return EMPTY_FIELD_PLACEHOLDER
}

export const formatAdvancedInfoField = (
  vessel: Vessel,
  field: VesselRenderField,
  translationFn = t
) => {
  const key = field.key.includes('.') ? field.key.split('.')[1] : field.key
  return formatInfoField(get(vessel, field.key), key, translationFn)
}

export const formatNumber = (num: string | number, maximumFractionDigits?: number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits || (number < 10 ? 2 : 0),
  })
}

export const getVesselGearType = (
  { geartype } = {} as Pick<VesselDataIdentity, 'geartype'> | { geartype: string }
): string => {
  const gearTypes = Array.isArray(geartype) ? geartype : [geartype]
  return gearTypes
    .filter(Boolean)
    ?.map((gear) => t(`vessel.gearTypes.${gear?.toLowerCase()}`, gear))
    .join(',')
}

export const getVesselLabel = (
  vessel: ExtendedFeatureVessel | IdentityVessel,
  withGearType = false
): string => {
  const vesselInfo = getLatestIdentityPrioritised(vessel)
  if (!vesselInfo) return t('common.unknownVessel', 'Unknown vessel')
  if (vesselInfo.shipname && vesselInfo.geartype && vesselInfo.flag && withGearType) {
    const gearTypes = getVesselGearType(vesselInfo)
    return `${formatInfoField(vesselInfo.shipname, 'name')}
    (${t(`flags:${vesselInfo.flag}`, vesselInfo.flag)}, ${gearTypes || EMPTY_FIELD_PLACEHOLDER})`
  }
  if (vesselInfo.shipname) {
    return formatInfoField(vesselInfo.shipname, 'name') as string
  }
  if (vesselInfo.geartype) {
    return `${t('vessel.unkwownVesselByGeartype', {
      gearType: getVesselGearType({ geartype: vesselInfo.geartype }),
    })}`
  }
  return t('common.unknownVessel', 'Unknown vessel')
}

// 'any' is used here as timestamp is not declared in Vessel anyways
export const getDetectionsTimestamps = (vessel: any) => {
  return vessel?.timestamp?.split(',').sort()
}
