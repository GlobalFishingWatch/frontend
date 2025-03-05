import { uniq } from 'es-toolkit'
import type { TFunction } from 'i18next'

import type {
  GearType,
  IdentityVessel,
  RegistryLoginMessage,
  SelfReportedInfo,
  VesselType,
} from '@globalfishingwatch/api-types'
import { API_LOGIN_REQUIRED } from '@globalfishingwatch/api-types'

import { formatI18nNumber } from 'features/i18n/i18nNumber'
import type { ExtendedFeatureVessel } from 'features/map/map.slice'
import type { VesselDataIdentity } from 'features/vessel/vessel.slice'
import { getLatestIdentityPrioritised } from 'features/vessel/vessel.utils'

import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const upperFirst = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''
}

export const formatInfoField = (
  fieldValue: string | string[] | number | undefined,
  type:
    | 'shipname'
    | 'flag'
    | 'ownerFlag'
    | 'shiptypes'
    | 'geartypes'
    | 'owner'
    | 'authorization'
    | 'vesselType'
    | 'port'
    | 'fleet',
  {
    translationFn = t,
    fallbackValue,
  }: {
    translationFn?: TFunction
    fallbackValue?: string
  } = {}
) => {
  if (!fieldValue && type === 'shipname') {
    return translationFn('common.unknownVessel', 'Unknown Vessel')
  }
  if (typeof fieldValue === 'string') {
    if (type === 'flag' || type === 'ownerFlag') {
      return translationFn(`flags:${fieldValue}` as any, fieldValue)
    }
    if (type === 'shiptypes' || type === 'vesselType') {
      return getVesselShipTypeLabel({ shiptypes: fieldValue }, { translationFn }) || fallbackValue
    }
    if (type === 'geartypes') {
      return getVesselGearTypeLabel({ geartypes: fieldValue }, { translationFn }) || fallbackValue
    }
    if (type === 'shipname' || type === 'owner' || type === 'port') {
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
      return (
        getVesselGearTypeLabel({ geartypes: fieldValue as GearType[] }, { translationFn }) ||
        fallbackValue
      )
    } else if (type === 'shiptypes') {
      return (
        getVesselShipTypeLabel({ shiptypes: fieldValue as VesselType[] }, { translationFn }) ||
        fallbackValue
      )
    }
  } else if (fieldValue) {
    return formatI18nNumber(fieldValue)
  }
  return fieldValue || fallbackValue || EMPTY_FIELD_PLACEHOLDER
}

export const formatNumber = (num: string | number, maximumFractionDigits?: number) => {
  const number = typeof num === 'string' ? parseFloat(num) : num
  return number.toLocaleString(undefined, {
    maximumFractionDigits: maximumFractionDigits || (number < 10 ? 2 : 0),
  })
}

export const getVesselShipTypeLabel = (
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
    .toSorted((a, b) => a.localeCompare(b))
    .join(joinCharacter) as VesselType
}

export const getVesselGearTypeLabel = (
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
    .toSorted((a, b) => a.localeCompare(b))
    .join(joinCharacter) as GearType
}

export const getVesselShipNameLabel = (
  vessel: ExtendedFeatureVessel | IdentityVessel,
  withGearType = false
): string => {
  const vesselInfo = getLatestIdentityPrioritised(vessel)
  if (!vesselInfo) return t('common.unknownVessel', 'Unknown vessel')
  if (vesselInfo.shipname && vesselInfo.geartypes && vesselInfo.flag && withGearType) {
    const gearTypes = getVesselGearTypeLabel(vesselInfo)
    return `${formatInfoField(vesselInfo.shipname, 'shipname')}
    (${t(`flags:${vesselInfo.flag}`, vesselInfo.flag)}, ${gearTypes || EMPTY_FIELD_PLACEHOLDER})`
  }
  if (vesselInfo.shipname) {
    return formatInfoField(vesselInfo.shipname, 'shipname') as string
  }
  if (vesselInfo.geartypes) {
    return `${t('vessel.unkwownVesselByGeartype', {
      gearType: getVesselGearTypeLabel({ geartypes: vesselInfo.geartypes }),
    })}`
  }
  return t('common.unknownVessel', 'Unknown vessel')
}

export const getVesselOtherNamesLabel = (otherVesselsNames: string[]) => {
  return otherVesselsNames?.length
    ? `, ${t('common.aka', 'a.k.a.')} ${otherVesselsNames
        .map((i) => formatInfoField(i, 'shipname'))
        .join(', ')}`
    : ''
}

// 'any' is used here as timestamp is not declared in Vessel anyways
export const getDetectionsTimestamps = (vessel: any) => {
  return vessel?.timestamp?.split(',').sort()
}
