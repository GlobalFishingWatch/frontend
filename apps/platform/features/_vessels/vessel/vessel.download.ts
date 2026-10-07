import type { DateTime } from 'luxon'

import type {
  ApiEvents,
  RegistryExtraFieldValue,
  VesselRegistryAuthorization,
  VesselRegistryOperator,
  VesselRegistryOwner,
} from '@globalfishingwatch/api-types'
import type { LonglineCategory } from '@globalfishingwatch/deck-loaders'
import { getLonglineCategory } from '@globalfishingwatch/deck-loaders'

import type { VesselLastIdentity } from 'features/_vessels/search/search.slice'
import type { ActivityEvent } from 'features/_vessels/vessel/activity/vessels-activity.selectors'
import type { VesselDataIdentity } from 'features/_vessels/vessel/vessel.slice'
import { type CsvConfig, objectArrayToCSV, parseCSVDate, parseCSVList } from 'utils/csv'
import { getSolarTimeZone, getUTCDateTime } from 'utils/dates'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

const parseRegistryOwners = (owners: VesselRegistryOwner[]) => {
  return parseCSVList(
    owners?.map((owner) => {
      return `${owner.name}-${owner.flag} (${owner.dateFrom}-${owner.dateTo})`
    })
  )
}

const parseRegistryExtraField = (extraField: RegistryExtraFieldValue) => {
  return extraField?.value || EMPTY_FIELD_PLACEHOLDER
}

const parseRegistryOperator = (operator: VesselRegistryOperator) => {
  return operator ? `${operator.name}-${operator.flag}` : EMPTY_FIELD_PLACEHOLDER
}

const parseRegistryAuthorizations = (authorizations: VesselRegistryAuthorization[]) => {
  return parseCSVList(
    authorizations?.map((authorization) => {
      return `${authorization.sourceCode} (${authorization.dateFrom}-${authorization.dateTo})`
    })
  )
}

const VESSEL_CSV_CONFIG: CsvConfig[] = [
  // TODO translate labels
  { label: 'id', accessor: 'id' },
  { label: 'flag', accessor: 'flag' },
  { label: 'mmsi', accessor: 'ssvid' },
  { label: 'imo', accessor: 'imo' },
  { label: 'shipname', accessor: 'nShipname' },
  { label: 'shiptypes', accessor: 'shiptypes' },
  { label: 'geartypes', accessor: 'geartypes' },
  { label: 'callsign', accessor: 'callsign' },
  { label: 'lengthM', accessor: 'lengthM' },
  { label: 'tonnageGt', accessor: 'tonnageGt' },
  { label: 'builtYear', accessor: 'builtYear', transform: parseRegistryExtraField },
  { label: 'transmissionStart', accessor: 'transmissionDateFrom', transform: parseCSVDate },
  { label: 'transmissionEnd', accessor: 'transmissionDateTo', transform: parseCSVDate },
  { label: 'identitySource', accessor: 'identitySource' },
  { label: 'sourceCode', accessor: 'sourceCode', transform: parseCSVList },
  { label: 'owner', accessor: 'registryOwners', transform: parseRegistryOwners },
  { label: 'operator', accessor: 'operator', transform: parseRegistryOperator },
  {
    label: 'authorization',
    accessor: 'registryPublicAuthorizations',
    transform: parseRegistryAuthorizations,
  },
]

type IdentityVesselCSVDownload = Omit<VesselLastIdentity, 'geartypes' | 'shiptypes'> & {
  geartypes: string
  shiptypes: string
}

export const parseVesselToCSV = (vessel: IdentityVesselCSVDownload) => {
  return objectArrayToCSV([vessel], VESSEL_CSV_CONFIG)
}

const EVENTS_CSV_CONFIG: CsvConfig[] = [
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
  { label: 'latitude', accessor: 'coordinates[1]' },
  { label: 'longitude', accessor: 'coordinates[0]' },
  {
    label: 'portVisitId',
    accessor: 'port_visit.intermediateAnchorage.id',
  },
  {
    label: 'portVisitName',
    accessor: 'port_visit.intermediateAnchorage.name',
  },
  { label: 'portVisitFlag', accessor: 'port_visit.intermediateAnchorage.flag' },
  // { label: 'encounterAuthorization', accessor: 'encounter.mainVesselAuthorizationStatus' },
  { label: 'encounteredVesselId', accessor: 'encounter.vessel.id' },
  { label: 'encounteredVesselName', accessor: 'encounter.vessel.name' },
  { label: 'encounteredVesselFlag', accessor: 'encounter.vessel.flag' },
  // {
  //   label: 'encounteredVesselAuthorization',
  //   accessor: 'encounter.encounteredVesselAuthorizationStatus',
  // },
]

export const parseEventsToCSV = (events: ActivityEvent[]) => {
  return objectArrayToCSV(events, EVENTS_CSV_CONFIG)
}

const LONGLINE_CATEGORY_LABELS: Record<LonglineCategory, string> = {
  entirelyDay: 'Entirely day',
  dayAndNight: 'Outside or overlapping with dawn and dusk',
  entirelyNight: 'Entirely night',
}

const LONGLINE_SETS_CSV_CONFIG: CsvConfig[] = [
  { label: 'Vessel id', accessor: 'vessel.id' },
  { label: 'Vessel name', accessor: 'vessel.name' },
  { label: 'Vessel flag', accessor: 'vessel.flag' },
  { label: 'MMSI', accessor: 'vessel.ssvid' },
  { label: 'IMO', accessor: 'imo' },
  { label: 'Callsign', accessor: 'callsign' },
  { label: 'Longline set type category', accessor: 'category' },
  { label: 'Start date/time UTC', accessor: 'start', transform: parseCSVDate },
  { label: 'End date/time UTC', accessor: 'end', transform: parseCSVDate },
  { label: 'Start date/time local solar', accessor: 'localStart' },
  { label: 'End date/time local solar', accessor: 'localEnd' },
  { label: 'Duration hours', accessor: 'durationHours' },
  { label: 'Latitude', accessor: 'position.lat' },
  { label: 'Longitude', accessor: 'position.lon' },
  { label: 'EEZ', accessor: 'regions.eez', transform: parseCSVList },
  { label: 'RFMO', accessor: 'regions.rfmo', transform: parseCSVList },
]

export const parseLonglineSetsToCSV = (
  events: ApiEvents['entries'],
  identities: Pick<VesselDataIdentity, 'id' | 'imo' | 'callsign'>[] = []
) => {
  const identitiesById = Object.fromEntries(identities.map((identity) => [identity.id, identity]))
  const sets = events.map((event) => {
    const start = getUTCDateTime(event.start)
    const end = getUTCDateTime(event.end)
    const lon = event.position?.lon
    // same local solar time the UI shows, as a full date instead of the pipeline's
    // fractional fishing.localStartHours (5.25 reads as 5:25 but means 5:15)
    const toLocal = (date: DateTime) =>
      lon !== undefined
        ? date.setZone(getSolarTimeZone(lon)).toISO({ suppressMilliseconds: true })
        : ''
    const identity = identitiesById[event.vessel?.id]
    return {
      ...event,
      category: LONGLINE_CATEGORY_LABELS[getLonglineCategory(event)],
      imo: identity?.imo,
      callsign: identity?.callsign,
      durationHours: Math.round(end.diff(start, 'hours').hours * 100) / 100,
      localStart: toLocal(start),
      localEnd: toLocal(end),
    }
  })
  return objectArrayToCSV(sets, LONGLINE_SETS_CSV_CONFIG)
}
