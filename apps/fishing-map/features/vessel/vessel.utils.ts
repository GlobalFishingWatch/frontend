import { uniq, uniqBy } from 'es-toolkit'
import get from 'lodash/get'

import type {
  GearType,
  IdentityVessel,
  SelfReportedInfo,
  VesselInfo,
  VesselRegistryInfo,
  VesselRegistryProperty,
  VesselType,
} from '@globalfishingwatch/api-types'
import { API_LOGIN_REQUIRED , VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { DEFAULT_BREAKPOINT } from '@globalfishingwatch/react-hooks'

import type { ExtendedFeatureVessel } from 'features/map/map.slice'
import type { VesselLastIdentity } from 'features/search/search.slice'
import type { TimeRange } from 'features/timebar/timebar.slice'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import type { IdentityVesselData, VesselDataIdentity } from 'features/vessel/vessel.slice'

type VesselsParamsSupported = IdentityVessel | IdentityVesselData | ExtendedFeatureVessel
type GetVesselIdentityParams = { identityId?: string; identitySource?: VesselIdentitySourceEnum }

const getVesselIdentitiesBySource = (
  vessel: IdentityVessel,
  { identitySource } = {} as Pick<GetVesselIdentityParams, 'identitySource'>
): VesselDataIdentity[] => {
  if (!identitySource) {
    return [] as VesselDataIdentity[]
  }
  return (vessel?.[identitySource] || []).map((identity) => {
    if (identitySource === VesselIdentitySourceEnum.Registry) {
      return {
        ...identity,
        identitySource,
        dataset: vessel.dataset,
      } as VesselDataIdentity
    }
    const combinedSourceGearTypes = getVesselCombinedSourceProperty(vessel, {
      vesselId: identity.id,
      property: 'geartypes',
    })?.map((i) => i.name as GearType)
    // Fallback with identity.geartypes as VMS data doesn't contain combinedSourceInfo
    const geartypes = combinedSourceGearTypes?.length ? combinedSourceGearTypes : identity.geartypes
    const combinedSourceShiptypes = getVesselCombinedSourceProperty(vessel, {
      vesselId: identity.id,
      property: 'shiptypes',
    })?.map((i) => i.name as VesselType)
    // Fallback with identity.shiptypes as VMS data doesn't contain combinedSourceInfo
    const shiptypes = combinedSourceShiptypes?.length ? combinedSourceShiptypes : identity.shiptypes
    return {
      ...identity,
      identitySource,
      geartypes,
      shiptypes,
      dataset: vessel.dataset,
    } as VesselDataIdentity
  })
}

export const getVesselIdentities = (
  vessel: VesselsParamsSupported,
  { identitySource } = {} as Pick<GetVesselIdentityParams, 'identitySource'>
): VesselDataIdentity[] => {
  if (!vessel) {
    return [] as VesselDataIdentity[]
  }

  const identities = (vessel as IdentityVesselData).identities?.length
    ? (vessel as IdentityVesselData).identities
    : [
        ...getVesselIdentitiesBySource(vessel as IdentityVessel, {
          identitySource: VesselIdentitySourceEnum.Registry,
        }),
        ...getVesselIdentitiesBySource(vessel as IdentityVessel, {
          identitySource: VesselIdentitySourceEnum.SelfReported,
        }),
      ].sort((a, b) => (a.transmissionDateTo > b.transmissionDateTo ? -1 : 1))

  return identitySource ? identities.filter((i) => i.identitySource === identitySource) : identities
}

export const getVesselIdentity = (
  vessel: VesselsParamsSupported,
  { identityId, identitySource } = {} as GetVesselIdentityParams
) => {
  const allIdentitiesInfo = getVesselIdentities(vessel, { identitySource })
  return (
    allIdentitiesInfo.find((i) => getVesselIdentityId(i) === identityId) || allIdentitiesInfo[0]
  )
}

export type VesselIdentityProperty =
  | keyof SelfReportedInfo
  | keyof VesselRegistryInfo
  | 'owner'
  | 'id'
  | 'image'

export function getLatestIdentityPrioritised(vessel: VesselsParamsSupported) {
  const latestRegistryIdentity = getVesselIdentity(vessel, {
    identitySource: VesselIdentitySourceEnum.Registry,
  })
  const latestSelfReportesIdentity = getVesselIdentity(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  const identity = latestSelfReportesIdentity || latestRegistryIdentity
  const identitySource = latestSelfReportesIdentity
    ? VesselIdentitySourceEnum.SelfReported
    : VesselIdentitySourceEnum.Registry
  const geartypes = getVesselProperty(vessel, 'geartypes', {
    identitySource,
    identityId: identity?.id,
  })
  const shiptypes = getVesselProperty(vessel, 'shiptypes', {
    identitySource,
    identityId: identity?.id,
  })
  return { ...identity, geartypes, shiptypes }
}

function getMatchCriteriaPrioritised(matchCriteria: IdentityVessel['matchCriteria']) {
  const registryMatchCriteria = matchCriteria?.find(
    (m) => m.source === VesselIdentitySourceEnum.Registry
  )
  if (registryMatchCriteria) {
    return registryMatchCriteria
  }
  return matchCriteria?.[0]
}

export function getBestMatchCriteriaIdentity(vessel: VesselsParamsSupported) {
  const identities = getVesselIdentities(vessel)
  const bestMatchCriteria = getMatchCriteriaPrioritised(vessel.matchCriteria)
  if (bestMatchCriteria) {
    const bestIdentityMatch = identities.find((i) => {
      const idToMatch =
        bestMatchCriteria.source === VesselIdentitySourceEnum.Registry
          ? (i as VesselRegistryInfo).vesselInfoReference
          : i.id
      return idToMatch === bestMatchCriteria.reference
    })
    if (bestIdentityMatch) {
      return bestIdentityMatch
    }
  }
}

export function getVesselIdentityId(identity: VesselDataIdentity) {
  return identity.identitySource === VesselIdentitySourceEnum.SelfReported
    ? identity.id
    : (identity as VesselRegistryInfo).vesselInfoReference
}

export function getVesselId(vessel: VesselsParamsSupported | null) {
  const selfReportedId = getVesselProperty(vessel, 'id', {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  const identityId = getVesselProperty(vessel, 'id', {
    identitySource: VesselIdentitySourceEnum.Registry,
  })
  return selfReportedId || identityId
}

function getVesselCombinedSource(
  vessel: VesselsParamsSupported | null,
  { vesselId } = {} as { vesselId: string }
) {
  return vessel?.combinedSourcesInfo?.find((i) => i.vesselId === vesselId)
}

function getVesselCombinedSourceProperty(
  vessel: VesselsParamsSupported | null,
  { vesselId, property } = {} as {
    vesselId: string
    property: keyof Pick<VesselInfo, 'shiptypes' | 'geartypes'>
  }
) {
  const combinedSource = getVesselCombinedSource(vessel, { vesselId })
  const source = combinedSource?.[property]
  if (source) {
    return [...source].sort((a, b) => (a.yearTo < b.yearTo ? 1 : -1))
  }
}

type VesselProperty<P extends VesselIdentityProperty> = P extends 'shiptypes'
  ? VesselType[]
  : P extends 'geartypes'
  ? GearType[]
  : P extends number
  ? number
  : P extends string
  ? string
  : undefined
export function getVesselProperty<P extends VesselIdentityProperty>(
  vessel: VesselsParamsSupported | null,
  property: P,
  { identityId, identitySource } = {} as GetVesselIdentityParams
): VesselProperty<P> {
  if (!vessel) return '' as VesselProperty<P>
  const identity = identitySource
    ? getVesselIdentity(vessel, { identityId, identitySource })
    : getLatestIdentityPrioritised(vessel)
  if (property === 'owner') {
    const ssvid = getVesselProperty(vessel, 'ssvid', { identityId, identitySource })
    return uniq(
      vessel.registryOwners?.filter((owner) => owner.ssvid === ssvid)?.map(({ name }) => name) || []
    ).join(', ') as VesselProperty<P>
  }
  if (
    identitySource !== VesselIdentitySourceEnum.Registry &&
    (property === 'geartypes' || property === 'shiptypes')
  ) {
    const vesselId = getVesselProperty(vessel, 'id', {
      identityId,
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })
    const combinedSourcesInfoData = getVesselCombinedSourceProperty(vessel, {
      vesselId,
      property,
    })?.filter((i) => i !== null)
    if (combinedSourcesInfoData?.length) {
      return combinedSourcesInfoData.map((i) => `${i.name}`) as VesselProperty<P>
    }
  }
  return get<VesselProperty<P>>(identity, property as any)
}
export function getRelatedIdentityVesselIds(vessel: VesselsParamsSupported): string[] {
  if (!vessel) return [] as string[]
  const vesselId = (vessel as IdentityVesselData).id || getVesselId(vessel)
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  return identities
    .filter((i) => i.matchFields === 'SEVERAL_FIELDS' && i.id !== vesselId)
    .flatMap((i) => i.id || [])
}

export function getSearchIdentityResolved(vessel: VesselsParamsSupported) {
  const vesselSelfReportedIdentities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  let vesselData = getLatestIdentityPrioritised(vessel)
  if (vessel?.matchCriteria) {
    const bestMatchIdentity = getBestMatchCriteriaIdentity(vessel)
    if (bestMatchIdentity) {
      vesselData = bestMatchIdentity
    }
  }
  // Get first transmission date from all identity sources
  const transmissionDateFrom = vesselSelfReportedIdentities
    ?.flatMap((r) => r.transmissionDateFrom || [])
    .sort((a, b) => (a < b ? -1 : 1))?.[0]
  // The same with last transmission date
  const transmissionDateTo = vesselSelfReportedIdentities
    ?.flatMap((r) => r.transmissionDateTo || [])
    .sort((a, b) => (a > b ? -1 : 1))?.[0]

  const positionsCounter = vesselSelfReportedIdentities.reduce((acc, identity) => {
    return identity.positionsCounter ? acc + identity.positionsCounter : acc
  }, 0)

  return {
    ...vesselData,
    id: getVesselId(vessel),
    dataset: vessel?.dataset,
    geartypes: getVesselProperty(vessel, 'geartypes'),
    shiptypes: getVesselProperty(vessel, 'shiptypes'),
    transmissionDateFrom,
    transmissionDateTo,
    positionsCounter,
  } as VesselLastIdentity
}

function sortVesselRegistryProperties(properties: VesselRegistryProperty[]) {
  return [...properties].sort((a: any, b: any) => {
    if (a.sourceCode[0] > b.sourceCode[0]) {
      return 1
    }
    if (a.sourceCode[0] < b.sourceCode[0]) {
      return -1
    }
    return a.dateTo > b.dateTo ? -1 : 1
  })
}

export function getCurrentIdentityVessel(
  vessel: VesselsParamsSupported,
  { identityId, identitySource } = {} as GetVesselIdentityParams
) {
  const vesselData = getVesselIdentity(vessel, { identityId, identitySource })
  const { dataset, registryPublicAuthorizations, registryOwners } = vessel
  return {
    ...vesselData,
    // TODO:VV3 review if we could have more than one extra field
    ...(vesselData?.extraFields?.length && vesselData.extraFields[0]),
    dataset,
    shiptypes: getVesselProperty(vessel, 'shiptypes', { identityId, identitySource }),
    geartypes: getVesselProperty(vessel, 'geartypes', { identityId, identitySource }),
    combinedSourcesInfo: getVesselCombinedSource(vessel, { vesselId: vesselData?.id }),
    registryPublicAuthorizations: registryPublicAuthorizations
      ? sortVesselRegistryProperties(registryPublicAuthorizations)
      : [],
    registryOwners: registryOwners ? sortVesselRegistryProperties(registryOwners) : [],
  } as VesselLastIdentity
}

export function getVoyageTimeRange(events: ActivityEvent[]) {
  return { start: events?.[events.length - 1]?.start, end: events?.[0]?.end }
}

export function filterRegistryInfoByDateAndSSVID(
  registryInfo: VesselRegistryProperty[],
  timerange: TimeRange,
  ssvid?: string
): VesselRegistryProperty[] {
  if (!registryInfo?.length) return []
  return sortVesselRegistryProperties(
    registryInfo.filter((info) => {
      let conditions = [info.dateFrom <= timerange.end, info.dateTo >= timerange.start]
      if (ssvid) {
        conditions = [...conditions, info.ssvid === ssvid]
      }
      return conditions.every((c) => Boolean(c))
    })
  )
}

export const getOtherVesselNames = (vessel: VesselsParamsSupported, currentName?: string) => {
  const currentNShipname = currentName || getSearchIdentityResolved(vessel)?.nShipname
  const uniqIdentitiesByNormalisedName = uniqBy(getVesselIdentities(vessel), (i) => i.nShipname)
  const otherIdentities = uniqIdentitiesByNormalisedName.filter(
    (i) => i.nShipname !== currentNShipname
  )

  return otherIdentities?.length ? otherIdentities.map((i) => i.shipname) : ([] as string[])
}

export const getSidebarContentWidth = () => {
  const margins = 92
  return window.innerWidth <= DEFAULT_BREAKPOINT
    ? window.innerWidth - margins
    : window.innerWidth / 2 - margins
}

export const isFieldLoginRequired = (field: string) => {
  return typeof field === 'string' && field.toUpperCase() === API_LOGIN_REQUIRED
}
