import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import type { VesselGroupReportState } from 'features/vessel-groups/vessel-groups.types'
import { FILTER_PROPERTIES } from '../areas/area-reports.utils'
import type { FilterProperty } from '../areas/area-reports.utils'

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

type ReportFilterProperty = FilterProperty | 'source'
export const REPORT_FILTER_PROPERTIES: Record<ReportFilterProperty, string[]> = {
  ...FILTER_PROPERTIES,
  source: ['source'],
}
