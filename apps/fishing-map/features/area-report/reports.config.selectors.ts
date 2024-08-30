import { createSelector } from '@reduxjs/toolkit'
import { selectQueryParam } from 'routes/routes.selectors'
import { AreaReportState, AreaReportStateProperty } from './reports.types'
import { DEFAULT_AREA_REPORT_STATE } from './reports.config'

type AreaReportProperty<P extends AreaReportStateProperty> = Required<AreaReportState>[P]
function selectAreaReportStateProperty<P extends AreaReportStateProperty>(property: P) {
  return createSelector([selectQueryParam(property)], (urlProperty): AreaReportProperty<P> => {
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_AREA_REPORT_STATE[property] as AreaReportProperty<P>
  })
}

export const selectReportCategorySelector = selectAreaReportStateProperty('reportCategory')
export const selectReportAreaBounds = selectAreaReportStateProperty('reportAreaBounds')
export const selectReportActivityGraph = selectAreaReportStateProperty('reportActivityGraph')
export const selectReportVesselGraphSelector = selectAreaReportStateProperty('reportVesselGraph')
export const selectReportVesselFilter = selectAreaReportStateProperty('reportVesselFilter')
export const selectReportVesselPage = selectAreaReportStateProperty('reportVesselPage')
export const selectReportResultsPerPage = selectAreaReportStateProperty('reportResultsPerPage')
export const selectReportTimeComparison = selectAreaReportStateProperty('reportTimeComparison')
export const selectReportBufferValueSelector = selectAreaReportStateProperty('reportBufferValue')
export const selectReportBufferUnitSelector = selectAreaReportStateProperty('reportBufferUnit')
export const selectReportBufferOperationSelector =
  selectAreaReportStateProperty('reportBufferOperation')
