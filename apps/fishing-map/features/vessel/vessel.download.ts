import get from 'lodash/get'

import type {
  RegistryExtraFieldValue,
  VesselRegistryAuthorization,
  VesselRegistryOperator,
  VesselRegistryOwner,
} from '@globalfishingwatch/api-types'

import type { VesselLastIdentity } from 'features/search/search.slice'
import type { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'
import { getUTCDateTime } from 'utils/dates'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

type CsvConfig = {
  label: string
  accessor: string | string[]
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

const objectArrayToCSV = (
  data: unknown[],
  csvConfig: CsvConfig[],
  getter = get as (any: any, path: string) => any
) => {
  const keys = csvConfig.map((c) => c.label).join(',')
  const values = data.map((d) => {
    return csvConfig
      .map(({ accessor, transform }) => {
        const value = Array.isArray(accessor)
          ? accessor.map((a) => getter(d, a)).filter(Boolean)[0]
          : getter(d, accessor)
        const transformedValue = transform ? transform(value) : value
        return transformedValue ? parseCSVString(transformedValue) : ''
      })
      .join(',')
  })
  return [keys, values.join('\n')].join('\n')
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
