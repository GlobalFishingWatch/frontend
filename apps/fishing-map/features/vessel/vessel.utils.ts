import { get, uniq, uniqBy } from 'lodash'
import {
  IdentityVessel,
  SelfReportedInfo,
  VesselRegistryInfo,
  VesselRegistryProperty,
} from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { t } from 'features/i18n/i18n'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { VesselLastIdentity } from 'features/search/search.slice'
import { IdentityVesselData, VesselDataIdentity } from 'features/vessel/vessel.slice'
import { Range } from 'features/timebar/timebar.slice'
import { formatInfoField } from 'utils/info'

type GetVesselIdentityParams = { identityId?: string; identitySource?: VesselIdentitySourceEnum }
export const getVesselIdentities = (
  vessel: IdentityVessel | IdentityVesselData,
  { identitySource } = {} as Pick<GetVesselIdentityParams, 'identitySource'>
): VesselDataIdentity[] => {
  if (!vessel) {
    return [] as VesselDataIdentity[]
  }
  const identities = (vessel as IdentityVesselData).identities?.length
    ? (vessel as IdentityVesselData).identities
    : [
        ...((vessel as IdentityVessel).registryInfo || []).map((i) => ({
          ...i,
          identitySource: VesselIdentitySourceEnum.Registry,
        })),
        ...((vessel as IdentityVessel).selfReportedInfo || []).map((i) => ({
          ...i,
          identitySource: VesselIdentitySourceEnum.SelfReported,
        })),
      ].sort((a, b) => (a.transmissionDateTo > b.transmissionDateTo ? -1 : 1))
  return identitySource ? identities.filter((i) => i.identitySource === identitySource) : identities
}

export const getVesselIdentity = (
  vessel: IdentityVessel | IdentityVesselData,
  { identityId, identitySource } = {} as GetVesselIdentityParams
) => {
  const allIdentitiesInfo = getVesselIdentities(vessel, { identitySource })
  return (
    allIdentitiesInfo.find((i) => getVesselIdentityId(i) === identityId) || allIdentitiesInfo[0]
  )
}

export type VesselIdentityProperty = keyof SelfReportedInfo | keyof VesselRegistryInfo | 'owner'

function getLatestIdentityPrioritised(vessel: IdentityVessel | IdentityVesselData) {
  const latestRegistryIdentity = getVesselIdentity(vessel, {
    identitySource: VesselIdentitySourceEnum.Registry,
  })
  const latestSelfReportesIdentity = getVesselIdentity(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  return latestRegistryIdentity || latestSelfReportesIdentity
}

export function getMatchCriteriaPrioritised(matchCriteria: IdentityVessel['matchCriteria']) {
  const registryMatchCriteria = matchCriteria?.find(
    (m) => m.source === VesselIdentitySourceEnum.Registry
  )
  if (registryMatchCriteria) {
    return registryMatchCriteria
  }
  return matchCriteria?.[0]
}

export function getBestMatchCriteriaIdentity(vessel: IdentityVessel | IdentityVesselData) {
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

export function getVesselId(vessel: IdentityVessel | IdentityVesselData | null) {
  const selfReportedId = getVesselProperty(vessel, 'id', {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  const identityId = getVesselProperty(vessel, 'id', {
    identitySource: VesselIdentitySourceEnum.Registry,
  })
  return selfReportedId || identityId
}

export function getVesselProperty<P = string>(
  vessel: IdentityVessel | IdentityVesselData | null,
  property: VesselIdentityProperty,
  { identityId, identitySource } = {} as GetVesselIdentityParams
): P {
  if (!vessel) return '' as P
  if (property === 'owner') {
    const ssvid = getVesselProperty(vessel, 'ssvid', { identityId, identitySource })
    return uniq(
      vessel.registryOwners?.filter((owner) => owner.ssvid === ssvid)?.map(({ name }) => name)
    ).join(', ') as P
  }
  if (!identitySource) {
    return get(getLatestIdentityPrioritised(vessel), property) as P
  }
  const identity = getVesselIdentity(vessel, { identityId, identitySource })
  return get(identity, property) as P
}

export function getVesselIdentityProperties<P = string>(
  vessel: IdentityVessel | IdentityVesselData,
  property: VesselIdentityProperty,
  { identitySource } = {} as GetVesselIdentityParams
): P[] {
  if (!vessel) return [] as P[]
  if (property === 'owner') {
    return uniq(vessel.registryOwners?.map(({ name }) => name)) as P[]
  }
  const identities = getVesselIdentities(vessel, { identitySource })
  return uniq(identities.flatMap((i) => i[property] || [])) as P[]
}

export function getRelatedIdentityVesselIds(vessel: IdentityVessel | IdentityVesselData): string[] {
  if (!vessel) return [] as string[]
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  return identities
    .filter((i) => i.matchFields === 'SEVERAL_FIELDS' && i.id !== identities[0].id)
    .flatMap((i) => i.id || [])
}

export function getSearchIdentityResolved(vessel: IdentityVessel | IdentityVesselData) {
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
    transmissionDateFrom,
    transmissionDateTo,
    positionsCounter,
  } as VesselLastIdentity
}

function sortVesselRegistryProperties(properties: VesselRegistryProperty[]) {
  return [...properties].sort((a: any, b: any) => {
    return a.dateTo > b.dateTo ? -1 : 1
  })
}

export function getCurrentIdentityVessel(
  vessel: IdentityVessel | IdentityVesselData,
  { identityId, identitySource } = {} as GetVesselIdentityParams
) {
  const vesselData = getVesselIdentity(vessel, { identityId, identitySource })

  return {
    ...vesselData,
    dataset: vessel.dataset,
    registryAuthorizations: vessel.registryAuthorizations
      ? sortVesselRegistryProperties(vessel.registryAuthorizations)
      : [],
    registryOwners: vessel.registryOwners
      ? sortVesselRegistryProperties(vessel.registryOwners)
      : [],
  } as VesselLastIdentity
}

export function getVoyageTimeRange(events: ActivityEvent[]) {
  return { start: events?.[events.length - 1]?.start, end: events?.[0]?.end }
}

export function filterRegistryInfoByDateAndSSVID(
  registryInfo: VesselRegistryProperty[],
  timerange: Range,
  ssvid: string
): VesselRegistryProperty[] {
  if (!registryInfo?.length) return []
  return sortVesselRegistryProperties(
    registryInfo.filter(
      (info) =>
        info.dateFrom <= timerange.end && info.dateTo >= timerange.start && info.ssvid === ssvid
    )
  )
}

export const getOtherVesselNames = (vessel, currentNShipname) => {
  const uniqIdentitiesByNormalisedName = uniqBy(getVesselIdentities(vessel), 'nShipname')
  const otherIdentities = uniqIdentitiesByNormalisedName.filter(
    (i) => i.nShipname !== currentNShipname
  )

  return otherIdentities?.length
    ? `, ${t('common.aka', 'a.k.a.')} ${otherIdentities
        .map((i) => formatInfoField(i.shipname, 'name'))
        .join(', ')}`
    : ''
}
