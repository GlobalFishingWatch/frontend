import { get } from 'lodash'
import {
  IdentityVessel,
  SelfReportedInfo,
  VesselRegistryAuthorization,
  VesselRegistryInfo,
  VesselRegistryOwner,
} from '@globalfishingwatch/api-types'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getUTCDateTime } from 'utils/dates'

type VesselIdentityProperty = keyof SelfReportedInfo | keyof VesselRegistryInfo
export function getVesselProperty<P = string>(
  vessel: IdentityVessel | null,
  property: VesselIdentityProperty,
  { registryIndex = 0 }: { registryIndex?: number } = {}
): P {
  if (!vessel) return '' as P
  if (vessel.registryInfo?.length) {
    const registryData = get(vessel.registryInfo[registryIndex], property) as P
    if (registryData) {
      return registryData
    }
  }
  return get(vessel.selfReportedInfo?.[0], property) as P
}

export const getVoyageTimeRange = (events: ActivityEvent[]) => {
  return { start: events?.[events.length - 1]?.start, end: events?.[0]?.end }
}

export function filterRegistryInfoByDates<I = VesselRegistryAuthorization | VesselRegistryOwner>(
  registryInfo: I[],
  dates: { start: string; end: string }
): I[] {
  if (!registryInfo?.length) return []
  const info = registryInfo
    ?.filter((info: any) => info.dateFrom <= dates.end && info.dateTo >= dates.start)
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

export const objectArrayToCSV = (
  data: unknown[],
  csvConfig: CsvConfig[],
  getter = get as (any, path: string) => any
) => {
  const keys = csvConfig.map((c) => c.label).join(',')
  const values = data.map((event) => {
    return csvConfig
      .map(({ accessor, transform }) => {
        const value = getter(event, accessor)
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
  { label: 'infoSource', accessor: 'sourceCode', transform: parseCSVList },
  // TODO think how to access vessel root properties
  // { label: 'owner', accessor: 'owner.owner' },
  // { label: 'ownerFlag', accessor: 'owner.ownerFlag' },
  // {
  //   label: 'authorization',
  //   accessor: 'authorization.sourceCode',
  //   transform: parseCSVList,
  // },
  // {
  //   label: 'authorizationStart',
  //   accessor: 'authorization.authorizedFrom',
  //   transform: parseCSVDate,
  // },
  // { label: 'authorizationEnd', accessor: 'authorization.authorizedTo', transform: parseCSVDate },
]

export const parseVesselToCSV = (vessel: IdentityVessel) => {
  return objectArrayToCSV([vessel], VESSEL_CSV_CONFIG, getVesselProperty)
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
