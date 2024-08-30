import { createSelector } from '@reduxjs/toolkit'
import { selectQueryParam } from 'routes/routes.selectors'
import {
  VesselGroupReportState,
  VesselGroupReportStateProperty,
} from 'features/vessel-groups/vessel-groups.types'
import { DEFAULT_VESSEL_GROUP_REPORT_STATE } from './vessel-group-report.config'

type VesselGroupReportProperty<P extends VesselGroupReportStateProperty> =
  Required<VesselGroupReportState>[P]
function selectVesselGroupReportStateProperty<P extends VesselGroupReportStateProperty>(
  property: P
) {
  return createSelector(
    [selectQueryParam(property)],
    (urlProperty): VesselGroupReportProperty<P> => {
      if (urlProperty !== undefined) return urlProperty
      return DEFAULT_VESSEL_GROUP_REPORT_STATE[property] as VesselGroupReportProperty<P>
    }
  )
}

export const selectViewOnlyVesselGroup = selectVesselGroupReportStateProperty('viewOnlyVesselGroup')
export const selectVesselGroupReportSection = selectVesselGroupReportStateProperty(
  'vesselGroupReportSection'
)
export const selectVesselGroupReportVesselsSubsection = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselsSubsection'
)
export const selectVesselGroupReportActivitySubsection = selectVesselGroupReportStateProperty(
  'vesselGroupReportActivitySubsection'
)
export const selectVesselGroupReportEventsSubsection = selectVesselGroupReportStateProperty(
  'vesselGroupReportEventsSubsection'
)

export const selectVesselGroupReportVesselFilter = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselFilter'
)
export const selectVesselGroupReportVesselPage = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselPage'
)
export const selectVesselGroupReportResultsPerPage = selectVesselGroupReportStateProperty(
  'vesselGroupReportResultsPerPage'
)
export const selectVesselGroupReportVesselsOrderProperty = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselsOrderProperty'
)
export const selectVesselGroupReportVesselsOrderDirection = selectVesselGroupReportStateProperty(
  'vesselGroupReportVesselsOrderDirection'
)
