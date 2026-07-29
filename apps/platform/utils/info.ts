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

import { formatI18nDate } from 'features/i18n/i18nDate.utils'
import { formatI18nNumber } from 'features/i18n/i18nNumber.utils'
import type { ExtendedFeatureVessel } from 'features/map/map/map.slice'
import type { VesselDataIdentity } from 'features/vessels/vessel/vessel.slice'

import { t } from '../features/i18n/i18n'

export const EMPTY_FIELD_PLACEHOLDER = '---'
export const MULTI_VALUE_SEPARATOR = ', '

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
  { joinCharacter = MULTI_VALUE_SEPARATOR, translationFn = t } = {} as {
    joinCharacter?: string
    translationFn?: TFunction
  }
): VesselType => {
  const shipTypes = uniq(
    (Array.isArray(shiptype) ? shiptype : [shiptype]).flatMap((type) => type?.split('|') ?? type)
  ).filter((shiptype) => shiptype !== undefined)
  if (!shipTypes?.length) {
    return EMPTY_FIELD_PLACEHOLDER as VesselType
  }
  return shipTypes
    .toSorted((a, b) => a.localeCompare(b))
    ?.map((shiptype) =>
      translationFn((t: any) => t.vessel.vesselTypes[shiptype?.toLowerCase()], {
        defaultValue: upperFirst(shiptype),
      })
    )
    .join(joinCharacter) as VesselType
}

export const getVesselGearTypeLabel = (
  { geartypes: geartype } = {} as Pick<VesselDataIdentity, 'geartypes'> | { geartypes: string },
  { joinCharacter = MULTI_VALUE_SEPARATOR, translationFn = t } = {} as {
    joinCharacter?: string
    translationFn?: TFunction
  }
): GearType | RegistryLoginMessage => {
  if (geartype === API_LOGIN_REQUIRED) {
    return geartype as RegistryLoginMessage
  }
  const gearTypes = uniq(
    (Array.isArray(geartype) ? geartype : [geartype]).flatMap((gear) => gear?.split('|') ?? gear)
  )
  if (gearTypes.every((geartype) => geartype === undefined)) {
    return EMPTY_FIELD_PLACEHOLDER as GearType
  }
  return (
    gearTypes
      .filter(Boolean)
      // sort raw codes, not labels, to keep the order (graph groups) identical in every language
      .toSorted((a, b) => a.localeCompare(b))
      ?.map((gear) =>
        translationFn((t: any) => t.vessel.gearTypes[gear?.toLowerCase()], {
          defaultValue: upperFirst(gear),
        })
      )
      .join(joinCharacter) as GearType
  )
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
    | 'builtYear'
    | 'transmissionDateFrom'
    | 'transmissionDateTo'
    | 'fleetCode'
    | 'fishingLicenseStatus',
  {
    translationFn = t,
    fallbackValue,
  }: {
    translationFn?: TFunction
    fallbackValue?: string
  } = {}
) => {
  if (!fieldValue && type === 'shipname') {
    return translationFn((t) => t.common.unknownVessel, { defaultValue: 'Unknown Vessel' })
  }
  if (typeof fieldValue === 'string') {
    if (type === 'flag' || type === 'ownerFlag') {
      return translationFn((t) => t[fieldValue], { ns: 'flags', defaultValue: fieldValue })
    }
    if (type === 'shiptypes' || type === 'vesselType') {
      return getVesselShipTypeLabel({ shiptypes: fieldValue }, { translationFn }) || fallbackValue
    }
    if (type === 'geartypes') {
      return getVesselGearTypeLabel({ geartypes: fieldValue }, { translationFn }) || fallbackValue
    }
    // fleetcode & fishingLicenseStatus only exists in VMS Brazil
    if (type === 'fleetCode') {
      return (
        translationFn((t: any) => t.vessel.fleetCodes[fieldValue.replaceAll('.', '_')], {
          defaultValue: fieldValue,
        }) || fallbackValue
      )
    }
    if (type === 'fishingLicenseStatus') {
      const normalized = fieldValue.trim().toLowerCase()
      return translationFn(
        (t) => t.vessel.licenseStatus[normalized as keyof typeof t.vessel.licenseStatus],
        {
          defaultValue: fieldValue,
        }
      ).toUpperCase()
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
    if (type === 'builtYear') {
      return fieldValue
    }
    return formatI18nNumber(fieldValue)
  }
  return fieldValue || fallbackValue || EMPTY_FIELD_PLACEHOLDER
}

export const getVesselOtherNamesLabel = (otherVesselsNames: string[]) => {
  return otherVesselsNames?.length
    ? `, ${t((t) => t.common.aka)} ${otherVesselsNames
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
