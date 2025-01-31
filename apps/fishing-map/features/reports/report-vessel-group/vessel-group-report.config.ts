import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import type { VesselGroupReportState } from 'features/vessel-groups/vessel-groups.types'

export const OTHER_CATEGORY_LABEL = 'OTHER'

export const DEFAULT_VESSEL_GROUP_REPORT_STATE: VesselGroupReportState = {
  viewOnlyVesselGroup: true,
  vGRSection: 'vessels',
  vGRVesselsSubsection: 'flag',
  vGRActivitySubsection: 'fishing',
  vGREventsSubsection: 'encounter',
  vGREventsVesselsProperty: 'flag',
  vGRVesselPage: 0,
  vGRVesselsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  vGREventsVesselPage: 0,
  vGREventsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  vGRVesselsOrderProperty: 'shipname',
  vGRVesselsOrderDirection: 'asc',
}

export type FilterProperty = 'name' | 'flag' | 'mmsi' | 'gear' | 'type'
export const FILTER_PROPERTIES: Record<FilterProperty, string[]> = {
  name: ['shipName'],
  flag: ['flag', 'flagTranslated', 'flagTranslatedClean'],
  mmsi: ['mmsi'],
  gear: ['geartype'],
  type: ['vesselType', 'shiptype'],
}

type ReportFilterProperty = FilterProperty | 'source'
export const REPORT_FILTER_PROPERTIES: Record<ReportFilterProperty, string[]> = {
  ...FILTER_PROPERTIES,
  source: ['source'],
}
