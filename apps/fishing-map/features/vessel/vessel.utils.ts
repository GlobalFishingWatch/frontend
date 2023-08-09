import { get, uniq } from 'lodash'
import {
  IdentityVessel,
  SelfReportedInfo,
  VesselRegistryAuthorization,
  VesselRegistryInfo,
  VesselRegistryOwner,
  VesselRegistryProperty,
} from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getUTCDateTime } from 'utils/dates'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import { VesselLastIdentity } from 'features/search/search.slice'
import { IdentityVesselData, VesselDataIdentity } from 'features/vessel/vessel.slice'
import { Range } from 'features/timebar/timebar.slice'

type GetVesselIdentityParams = { identityIndex?: number; identitySource?: VesselIdentitySourceEnum }
export const getVesselIdentities = (
  vessel: IdentityVessel | IdentityVesselData,
  { identitySource } = {} as Pick<GetVesselIdentityParams, 'identitySource'>
): VesselDataIdentity[] => {
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
  { identityIndex = 0, identitySource } = {} as GetVesselIdentityParams
) => {
  const allIdentitiesInfo = getVesselIdentities(vessel, { identitySource })
  return allIdentitiesInfo[identityIndex]
}

type VesselIdentityProperty = keyof SelfReportedInfo | keyof VesselRegistryInfo

export function getVesselProperty<P = string>(
  vessel: IdentityVessel | IdentityVesselData | null,
  property: VesselIdentityProperty,
  { identityIndex = 0, identitySource } = {} as GetVesselIdentityParams
): P {
  if (!vessel) return '' as P
  const identities = getVesselIdentities(vessel, { identitySource })
  return get(identities[identityIndex], property) as P
}

export function getVesselIdentityProperties<P = string>(
  vessel: IdentityVessel | IdentityVesselData,
  property: VesselIdentityProperty,
  { identitySource } = {} as GetVesselIdentityParams
): P[] {
  if (!vessel) return [] as P[]
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

export function getSelfReportedVesselIdentityResolved(vessel: IdentityVessel | IdentityVesselData) {
  const vesselSelfReportedIdentities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })
  const vesselData = vesselSelfReportedIdentities[0]
  // Get first transmission date from all identity sources
  const transmissionDateFrom = vesselSelfReportedIdentities
    ?.flatMap((r) => r.transmissionDateFrom || [])
    .sort((a, b) => (a < b ? -1 : 1))?.[0]
  // The same with last transmission date
  const transmissionDateTo = vesselSelfReportedIdentities
    ?.flatMap((r) => r.transmissionDateTo || [])
    .sort((a, b) => (a > b ? -1 : 1))?.[0]

  const messagesCounter = vesselSelfReportedIdentities.reduce((acc, identity) => {
    return acc + identity.messagesCounter
  }, 0)

  return {
    ...vesselData,
    dataset: vessel.dataset,
    transmissionDateFrom,
    transmissionDateTo,
    messagesCounter,
  } as VesselLastIdentity
}

function sortVesselRegistryProperties(properties: VesselRegistryProperty[]) {
  return [...properties].sort((a: any, b: any) => {
    return a.dateTo > b.dateTo ? -1 : 1
  })
}

export function getCurrentIdentityVessel(
  vessel: IdentityVessel | IdentityVesselData,
  { identityIndex = 0, identitySource } = {} as GetVesselIdentityParams
) {
  const vesselData = getVesselIdentity(vessel, { identityIndex, identitySource })

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

export function filterRegistryInfoByDates(
  registryInfo: VesselRegistryProperty[],
  timerange: Range
): VesselRegistryProperty[] {
  if (!registryInfo?.length) return []
  return sortVesselRegistryProperties(
    registryInfo.filter((info) => info.dateFrom <= timerange.end && info.dateTo >= timerange.start)
  )
}

export type CsvConfig = {
  label: string
  accessor: string
  transform?: (value: any) => any
}

const parseCSVString = (string: string | number) => {
  return string?.toString()?.replaceAll(',', '-')
}
const parseCSVDate = (date: number) => getUTCDateTime(date).toISO()
const parseCSVList = (value: string[]) => value?.join('|')

const parseRegistryOwners = (owners: VesselRegistryOwner[]) => {
  return parseCSVList(
    owners?.map((owner) => {
      return `${owner.name}-${owner.flag} (${owner.dateFrom}-${owner.dateTo})`
    })
  )
}

const parseRegistryAuthorizations = (authorizations: VesselRegistryAuthorization[]) => {
  return parseCSVList(
    authorizations?.map((authorization) => {
      return `${authorization.sourceCode} (${authorization.dateFrom}-${authorization.dateTo})`
    })
  )
}

export const objectArrayToCSV = (
  data: unknown[],
  csvConfig: CsvConfig[],
  getter = get as (any, path: string) => any
) => {
  const keys = csvConfig.map((c) => c.label).join(',')
  const values = data.map((d) => {
    return csvConfig
      .map(({ accessor, transform }) => {
        const value = getter(d, accessor)
        const transformedValue = transform ? transform(value) : value
        return transformedValue ? parseCSVString(transformedValue) : ''
      })
      .join(',')
  })
  return [keys, values.join('\n')].join('\n')
}

export const VESSEL_CSV_CONFIG: CsvConfig[] = [
  // TODO translate labels
  { label: 'id', accessor: 'id' },
  { label: 'flag', accessor: 'flag' },
  { label: 'ssvid', accessor: 'imo' },
  { label: 'shipname', accessor: 'nShipname' },
  { label: 'shiptype', accessor: 'shiptype' },
  { label: 'geartype', accessor: 'geartype', transform: parseCSVList },
  { label: 'callsign', accessor: 'callsign' },
  { label: 'lengthM', accessor: 'lengthM' },
  { label: 'tonnageGt', accessor: 'tonnageGt' },
  { label: 'transmissionStart', accessor: 'transmissionDateFrom', transform: parseCSVDate },
  { label: 'transmissionEnd', accessor: 'transmissionDateTo', transform: parseCSVDate },
  { label: 'identitySource', accessor: 'identitySource' },
  { label: 'sourceCode', accessor: 'sourceCode', transform: parseCSVList },
  { label: 'owner', accessor: 'registryOwners', transform: parseRegistryOwners },
  {
    label: 'authorization',
    accessor: 'registryAuthorizations',
    transform: parseRegistryAuthorizations,
  },
]

export const parseVesselToCSV = (vessel: VesselLastIdentity) => {
  return objectArrayToCSV([vessel], VESSEL_CSV_CONFIG)
}

export const EVENTS_CSV_CONFIG: CsvConfig[] = [
  { label: 'type', accessor: 'type' },
  {
    label: 'start',
    accessor: 'start',
    transform: parseCSVDate,
  },
  {
    label: 'end',
    accessor: 'end',
    transform: parseCSVDate,
  },
  { label: 'voyage', accessor: 'voyage' },
  { label: 'latitude', accessor: 'position.lat' },
  { label: 'longitude', accessor: 'position.lon' },
  { label: 'portVisitName', accessor: 'port_visit.intermediateAnchorage.name' },
  { label: 'portVisitFlag', accessor: 'port_visit.intermediateAnchorage.flag' },
  { label: 'encounterAuthorization', accessor: 'encounter.mainVesselAuthorizationStatus' },
  { label: 'encounteredVesselId', accessor: 'encounter.vessel.id' },
  { label: 'encounteredVesselName', accessor: 'encounter.vessel.name' },
  { label: 'encounteredVesselFlag', accessor: 'encounter.vessel.flag' },
  {
    label: 'encounteredVesselAuthorization',
    accessor: 'encounter.encounteredVesselAuthorizationStatus',
  },
]

export const parseEventsToCSV = (events: ActivityEvent[]) => {
  return objectArrayToCSV(events, EVENTS_CSV_CONFIG)
}
