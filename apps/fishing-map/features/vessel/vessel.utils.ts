import { get, uniq } from 'lodash'
import {
  IdentityVessel,
  SelfReportedInfo,
  VesselRegistryAuthorization,
  VesselRegistryInfo,
  VesselRegistryOwner,
} from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getUTCDateTime } from 'utils/dates'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import { VesselLastIdentity } from 'features/search/search.slice'
import { IdentityVesselData, VesselDataIdentity } from 'features/vessel/vessel.slice'
import { Range } from 'features/timebar/timebar.slice'

export const getVesselIdentities = (
  vessel: IdentityVessel | IdentityVesselData
): VesselDataIdentity[] => {
  if ((vessel as IdentityVesselData).identities?.length) {
    return (vessel as IdentityVesselData).identities
  }
  return [
    ...((vessel as IdentityVessel).registryInfo || []).map((i) => ({
      ...i,
      identitySource: VesselIdentitySourceEnum.Registry,
    })),
    ...((vessel as IdentityVessel).selfReportedInfo || []).map((i) => ({
      ...i,
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })),
  ].sort((a, b) => (a.transmissionDateTo > b.transmissionDateTo ? -1 : 1))
}

export const getVesselIdentity = (
  vessel: IdentityVessel | IdentityVesselData,
  { identityIndex = 0 } = {}
) => {
  const allIdentitiesInfo = getVesselIdentities(vessel)
  return allIdentitiesInfo[identityIndex]
}

type VesselIdentityProperty = keyof SelfReportedInfo | keyof VesselRegistryInfo

export function getVesselProperty<P = string>(
  vessel: IdentityVessel | IdentityVesselData | null,
  property: VesselIdentityProperty,
  { identityIndex = 0 }: { identityIndex?: number } = {}
): P {
  if (!vessel) return '' as P
  const identities = getVesselIdentities(vessel)
  return get(identities[identityIndex], property) as P
}

export function getVesselIdentityProperties<P = string>(
  vessel: IdentityVessel | IdentityVesselData,
  property: VesselIdentityProperty
): P[] {
  if (!vessel) return [] as P[]
  const identities = getVesselIdentities(vessel)
  return uniq(identities.flatMap((i) => i[property] || [])) as P[]
}

export function getIdentityVesselMerged(vessel: IdentityVessel | IdentityVesselData) {
  const vesselData = getVesselIdentity(vessel)
  const identities = getVesselIdentities(vessel)
  // Get first transmission date from all identity sources
  const transmissionDateFrom = identities
    .map((i) => i.transmissionDateFrom)
    .sort((a, b) => (a < b ? -1 : 1))?.[0]
  const transmissionDateTo = identities
    .map((i) => i.transmissionDateTo)
    .sort((a, b) => (a > b ? -1 : 1))?.[0]

  return {
    ...vesselData,
    dataset: vessel.dataset,
    transmissionDateFrom,
    transmissionDateTo,
  } as VesselLastIdentity
}

type GetCurrentIdentityVesselParams = { identityIndex?: number; timerange?: Range }
export function getCurrentIdentityVessel(
  vessel: IdentityVessel | IdentityVesselData,
  { identityIndex = 0 } = {} as GetCurrentIdentityVesselParams
) {
  const vesselData = getVesselIdentity(vessel, { identityIndex })
  const timerange = {
    start: vesselData.transmissionDateFrom,
    end: vesselData.transmissionDateTo,
  }
  return {
    ...vesselData,
    dataset: vessel.dataset,
    registryAuthorizations: vessel.registryAuthorizations
      ? filterRegistryInfoByDates(vessel.registryAuthorizations, timerange)
      : [],
    registryOwners: vessel.registryOwners
      ? filterRegistryInfoByDates(vessel.registryOwners, timerange)
      : [],
  } as VesselLastIdentity
}

export function getVoyageTimeRange(events: ActivityEvent[]) {
  return { start: events?.[events.length - 1]?.start, end: events?.[0]?.end }
}

export function filterRegistryInfoByDates<I = VesselRegistryAuthorization | VesselRegistryOwner>(
  registryInfo: I[],
  timerange: Range
): I[] {
  if (!registryInfo?.length) return []
  const info = registryInfo
    ?.filter((info: any) => info.dateFrom <= timerange.end && info.dateTo >= timerange.start)
    ?.sort((a: any, b: any) => {
      return a.dateTo > b.dateTo ? -1 : 1
    })
  return info
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
