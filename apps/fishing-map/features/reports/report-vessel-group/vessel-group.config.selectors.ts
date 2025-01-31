import { createSelector } from '@reduxjs/toolkit'

import type {
  VesselGroupReportState,
  VesselGroupReportStateProperty,
  VGRSubsection,
} from 'features/vessel-groups/vessel-groups.types'
import { selectLocationQuery } from 'routes/routes.selectors'

import { DEFAULT_VESSEL_GROUP_REPORT_STATE } from './vessel-group-report.config'

type VesselGroupReportProperty<P extends VesselGroupReportStateProperty> =
  Required<VesselGroupReportState>[P]
function selectVGRStateProperty<P extends VesselGroupReportStateProperty>(property: P) {
  return createSelector([selectLocationQuery], (locationQuery): VesselGroupReportProperty<P> => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_VESSEL_GROUP_REPORT_STATE[property] as VesselGroupReportProperty<P>
  })
}

export const selectViewOnlyVesselGroup = selectVGRStateProperty('viewOnlyVesselGroup')
export const selectVGRSection = selectVGRStateProperty('vGRSection')
export const selectVGRVesselsSubsection = selectVGRStateProperty('vGRVesselsSubsection')
export const selectVGRActivitySubsection = selectVGRStateProperty('vGRActivitySubsection')

export const selectVGRVesselFilter = selectVGRStateProperty('vGRVesselFilter')
export const selectVGRVesselPage = selectVGRStateProperty('vGRVesselPage')
export const selectVGRVesselsResultsPerPage = selectVGRStateProperty('vGRVesselsResultsPerPage')
export const selectVGRVesselsOrderProperty = selectVGRStateProperty('vGRVesselsOrderProperty')
export const selectVGRVesselsOrderDirection = selectVGRStateProperty('vGRVesselsOrderDirection')

export const selectVGREventsSubsection = selectVGRStateProperty('vGREventsSubsection')
export const selectVGREventsVesselsProperty = selectVGRStateProperty('vGREventsVesselsProperty')
export const selectVGREventsVesselFilter = selectVGRStateProperty('vGREventsVesselFilter')
export const selectVGREventsVesselPage = selectVGRStateProperty('vGREventsVesselPage')
export const selectVGREventsResultsPerPage = selectVGRStateProperty('vGREventsResultsPerPage')

export const selectVGRSubsection = createSelector(
  [
    selectVGRSection,
    selectVGRVesselsSubsection,
    selectVGRActivitySubsection,
    selectVGREventsSubsection,
  ],
  (section, vesselsSubsection, activitySubsection, eventsSubsection): VGRSubsection | undefined => {
    if (section === 'activity') {
      return activitySubsection
    }
    if (section === 'events') {
      return eventsSubsection
    }
    if (section === 'vessels') {
      return vesselsSubsection
    }
  }
)
