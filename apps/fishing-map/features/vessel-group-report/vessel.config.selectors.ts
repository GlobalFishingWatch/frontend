import { createSelector } from '@reduxjs/toolkit'
import { VesselGroupReportState, VesselGroupReportStateProperty } from 'types'
import { selectQueryParam } from 'routes/routes.selectors'
import { DEFAULT_VESSEL_GROUP_REPORT_STATE } from 'features/vessel/vessel.config'

type VesselGroupReportProperty<P extends VesselGroupReportStateProperty> =
  Required<VesselGroupReportState>[P]
export function selectVesselProfileStateProperty<P extends VesselGroupReportStateProperty>(
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

export const selectViewOnlyVesselGroup = selectVesselProfileStateProperty('viewOnlyVesselGroup')
export const selectVesselGroupReportSection = selectVesselProfileStateProperty(
  'vesselGroupReportSection'
)
export const selectVesselGroupReportVesselsSubsection = selectVesselProfileStateProperty(
  'vesselGroupReportVesselsSubsection'
)
export const selectVesselGroupReportActivitySubsection = selectVesselProfileStateProperty(
  'vesselGroupReportActivitySubsection'
)
export const selectVesselGroupReportEventsSubsection = selectVesselProfileStateProperty(
  'vesselGroupReportEventsSubsection'
)
