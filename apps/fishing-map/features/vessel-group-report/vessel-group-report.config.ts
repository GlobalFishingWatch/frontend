import { REPORT_VESSELS_PER_PAGE } from 'data/config'
import { VesselGroupReportState } from 'features/vessel-groups/vessel-groups.types'

export const OTHER_CATEGORY_LABEL = 'OTHER'

export const DEFAULT_VESSEL_GROUP_REPORT_STATE: VesselGroupReportState = {
  viewOnlyVesselGroup: true,
  vesselGroupReportSection: 'vessels',
  vesselGroupReportVesselsSubsection: 'flag',
  vesselGroupReportActivitySubsection: 'fishing-effort',
  vGREventsSubsection: 'encounter-events',
  vGREventsVesselsProperty: 'flag',
  vesselGroupReportVesselPage: 0,
  vesselGroupReportResultsPerPage: REPORT_VESSELS_PER_PAGE,
  vGREventsVesselPage: 0,
  vGREventsResultsPerPage: REPORT_VESSELS_PER_PAGE,
  vesselGroupReportVesselsOrderProperty: 'shipname',
  vesselGroupReportVesselsOrderDirection: 'asc',
}
