import { uniq } from 'lodash'
import { TFunction } from 'i18next'
import {
  API_LOGIN_REQUIRED,
  GearType,
  IdentityVessel,
  RegistryLoginMessage,
  SelfReportedInfo,
  VesselType,
} from '@globalfishingwatch/api-types'
import { ExtendedFeatureVessel } from 'features/map/map.slice'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getLatestIdentityPrioritised } from 'features/vessel/vessel.utils'
import { VesselDataIdentity } from 'features/vessel/vessel.slice'
import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const upperFirst = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''
}

export const formatInfoField = (
  fieldValue: string | string[] | number | undefined,
  type: string,
  translationFn = t
) => {
  if (!fieldValue && (type === 'name' || type === 'shipname')) {
    return translationFn('common.unknownVessel', 'Unknown Vessel')
  }
  if (typeof fieldValue === 'string') {
    if (type === 'flag' || type === 'ownerFlag') {
      return translationFn(`flags:${fieldValue}` as any, fieldValue)
    }
    if (type === 'shiptypes' || type === 'vesselType') {
      return getVesselShipType({ shiptypes: fieldValue }, { translationFn })
    }
    if (type === 'geartypes') {
      return getVesselGearType({ geartypes: fieldValue }, { translationFn })
    }
    if (type === 'name' || type === 'shipname' || type === 'owner' || type === 'port') {
      return fieldValue
        .replace('_', ' ')
        .replace(/\b(?![LXIVCDM]+\b)([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ,0-9]+)\b/g, upperFirst)
    }
    if (type === 'fleet') {
      const fleetClean = fieldValue.replaceAll('_', ' ')
      return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
    }
  } else if (Array.isArray(fieldValue)) {
    if (type === 'geartypes') {
      return getVesselGearType({ geartypes: fieldValue as GearType[] }, { translationFn })
    } else if (type === 'shiptypes') {
      return getVesselShipType({ shiptypes: fieldValue as VesselType[] }, { translationFn })
    }
  } else if (fieldValue) {
    return formatI18nNumber(fieldValue)
  }
  return fieldValue || EMPTY_FIELD_PLACEHOLDER
}

export const formatNumber = (num: string | number, maximumFractionDigits?: number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits || (number < 10 ? 2 : 0),
  })
}

export const getVesselShipType = (
  { shiptypes: shiptype } = {} as Pick<SelfReportedInfo, 'shiptypes'> | { shiptypes: string },
  { joinCharacter = ', ', translationFn = t } = {} as {
    joinCharacter?: string
    translationFn?: TFunction
  }
): VesselType => {
  const shipTypes = uniq(Array.isArray(shiptype) ? shiptype : [shiptype])
  if (shipTypes.every((shiptype) => shiptype === undefined)) {
    return EMPTY_FIELD_PLACEHOLDER as VesselType
  }
  return shipTypes
    .filter(Boolean)
    ?.map((shiptype) =>
      translationFn(`vessel.vesselTypes.${shiptype?.toLowerCase()}`, upperFirst(shiptype))
    )
    .join(joinCharacter) as VesselType
}

export const getVesselGearType = (
  { geartypes: geartype } = {} as Pick<VesselDataIdentity, 'geartypes'> | { geartypes: string },
  { joinCharacter = ', ', translationFn = t } = {} as {
    joinCharacter?: string
    translationFn?: TFunction
  }
): GearType | RegistryLoginMessage => {
  if (geartype === API_LOGIN_REQUIRED) {
    return geartype as RegistryLoginMessage
  }
  const gearTypes = uniq(Array.isArray(geartype) ? geartype : [geartype])
  if (gearTypes.every((geartype) => geartype === undefined)) {
    return EMPTY_FIELD_PLACEHOLDER as GearType
  }
  return gearTypes
    .filter(Boolean)
    ?.map((gear) => translationFn(`vessel.gearTypes.${gear?.toLowerCase()}`, upperFirst(gear)))
    .join(joinCharacter) as GearType
}

export const getVesselLabel = (
  vessel: ExtendedFeatureVessel | IdentityVessel,
  withGearType = false
): string => {
  const vesselInfo = getLatestIdentityPrioritised(vessel)
  if (!vesselInfo) return t('common.unknownVessel', 'Unknown vessel')
  if (vesselInfo.shipname && vesselInfo.geartypes && vesselInfo.flag && withGearType) {
    const gearTypes = getVesselGearType(vesselInfo)
    return `${formatInfoField(vesselInfo.shipname, 'name')}
    (${t(`flags:${vesselInfo.flag}`, vesselInfo.flag)}, ${gearTypes || EMPTY_FIELD_PLACEHOLDER})`
  }
  if (vesselInfo.shipname) {
    return formatInfoField(vesselInfo.shipname, 'name') as string
  }
  if (vesselInfo.geartypes) {
    return `${t('vessel.unkwownVesselByGeartype', {
      gearType: getVesselGearType({ geartypes: vesselInfo.geartypes }),
    })}`
  }
  return t('common.unknownVessel', 'Unknown vessel')
}

export const getVesselOtherNamesLabel = (otherVesselsNames: string[]) => {
  return otherVesselsNames?.length
    ? `, ${t('common.aka', 'a.k.a.')} ${otherVesselsNames
        .map((i) => formatInfoField(i, 'name'))
        .join(', ')}`
    : ''
}

// 'any' is used here as timestamp is not declared in Vessel anyways
export const getDetectionsTimestamps = (vessel: any) => {
  return vessel?.timestamp?.split(',').sort()
}
