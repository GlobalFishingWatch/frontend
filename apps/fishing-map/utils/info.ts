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

import { formatI18nDate } from 'features/i18n/i18nDate'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import type { ExtendedFeatureVessel } from 'features/map/map.slice'
import type { VesselDataIdentity } from 'features/vessel/vessel.slice'
import { getLatestIdentityPrioritised } from 'features/vessel/vessel.utils'

import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'

export const upperFirst = (text: string) => {
  return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : ''
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
  {
    translationFn = t,
    withGearType = false,
  }: {
    translationFn?: TFunction
    withGearType?: boolean
  } = {}
): string => {
  const vesselInfo = getLatestIdentityPrioritised(vessel)
  if (!vesselInfo) return t('common.unknownVessel')
  if (vesselInfo.shipname && vesselInfo.geartypes && vesselInfo.flag && withGearType) {
    const gearTypes = getVesselGearTypeLabel(vesselInfo, { translationFn })
    return `${formatInfoField(vesselInfo.shipname, 'shipname')}
    (${translationFn(`flags:${vesselInfo.flag}`, vesselInfo.flag)}, ${gearTypes || EMPTY_FIELD_PLACEHOLDER})`
  }
  if (vesselInfo.shipname) {
    return formatInfoField(vesselInfo.shipname, 'shipname', { translationFn }) as string
  }
  if (vesselInfo.geartypes) {
    return `${translationFn('vessel.unkwownVesselByGeartype', {
      gearType: getVesselGearTypeLabel({ geartypes: vesselInfo.geartypes }, { translationFn }),
    })}`
  }
  return translationFn('common.unknownVessel', 'Unknown vessel')
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
    | 'operator'
    | 'authorization'
    | 'vesselType'
    | 'mmsi'
    | 'port'
    | 'name'
    | 'fleet'
    | 'transmissionDateFrom'
    | 'transmissionDateTo',
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
    if (
      type === 'shipname' ||
      type === 'owner' ||
      type === 'operator' ||
      type === 'port' ||
      type === 'name'
    ) {
      return fieldValue.replace(
        /\b(?![LXIVCDM]+\b)(\d*)([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ]+)\b|\b([A-Z,ÁÉÍÓÚÑÜÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÇÅÆØ]+)(\d+)\b/g,
        (match, num, name, nameFirst, numLast) => {
          if (num && name) {
            return num + upperFirst(name)
          }
          if (nameFirst && numLast) {
            return upperFirst(nameFirst) + numLast
          }
          return upperFirst(match)
        }
      )
    }
    if (type === 'fleet') {
      const fleetClean = fieldValue.replaceAll('_', ' ')
      return fleetClean.charAt(0).toUpperCase() + fleetClean.slice(1)
    }
    if (type === 'transmissionDateFrom' || type === 'transmissionDateTo') {
      return formatI18nDate(fieldValue)
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

export const getVesselOtherNamesLabel = (otherVesselsNames: string[]) => {
  return otherVesselsNames?.length
    ? `, ${t('common.aka')} ${otherVesselsNames
        .map((i) => formatInfoField(i, 'shipname'))
        .join(', ')}`
    : ''
}

// 'any' is used here as timestamp is not declared in Vessel anyways
export const getDetectionsTimestamps = (vessel: any) => {
  return vessel?.timestamp?.split(',').sort()
}

export function sortOptionsAlphabetically<T extends { label: string; id: string }>(
  options: T[]
): T[] {
  return [...options].sort((a, b) => a.label.localeCompare(b.label))
}
