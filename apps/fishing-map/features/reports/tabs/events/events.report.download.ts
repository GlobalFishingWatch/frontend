import { type ApiEvent, type EventType, EventTypes } from '@globalfishingwatch/api-types'

import type { CsvConfig } from 'utils/csv'
import { objectArrayToCSV, parseCSVDate } from 'utils/csv'

const BASE_REPORT_EVENTS_CSV_CONFIG: CsvConfig[] = [
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
  { label: 'latitude', accessor: 'position.lat' },
  { label: 'longitude', accessor: 'position.lon' },
  { label: 'vesselId', accessor: 'vessel.id' },
  { label: 'vesselName', accessor: 'vessel.name' },
  { label: 'vesselFlag', accessor: 'vessel.flag' },
  { label: 'vesselType', accessor: 'vessel.type' },
]

export const ENCOUNTER_REPORT_EVENTS_CSV_CONFIG = [
  ...BASE_REPORT_EVENTS_CSV_CONFIG,
  { label: 'encounteredVesselName', accessor: 'encounter.vessel.name' },
  { label: 'encounteredVesselFlag', accessor: 'encounter.vessel.flag' },
  { label: 'encounteredVesselType', accessor: 'encounter.vessel.type' },
]

export const PORT_VISIT_REPORT_EVENTS_CSV_CONFIG = [
  ...BASE_REPORT_EVENTS_CSV_CONFIG,
  {
    label: 'portVisitId',
    accessor: 'port_visit.intermediateAnchorage.id',
  },
  { label: 'portVisitFlag', accessor: 'port_visit.intermediateAnchorage.flag' },
  {
    label: 'portVisitName',
    accessor: 'port_visit.intermediateAnchorage.name',
  },
]

export const parseReportEventsToCSV = (events: ApiEvent[], eventType?: EventType) => {
  const type = eventType || events[0].type
  const config =
    type === EventTypes.Encounter
      ? ENCOUNTER_REPORT_EVENTS_CSV_CONFIG
      : type === EventTypes.Port
        ? PORT_VISIT_REPORT_EVENTS_CSV_CONFIG
        : BASE_REPORT_EVENTS_CSV_CONFIG
  return objectArrayToCSV(events, config)
}
