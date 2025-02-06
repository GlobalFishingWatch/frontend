import { createSelector } from '@reduxjs/toolkit'

import { selectLocationQuery } from 'routes/routes.selectors'

import { DEFAULT_REPORT_STATE } from './reports.config'
import type { ReportState, ReportStateProperty } from './reports.types'

type AreaReportProperty<P extends ReportStateProperty> = Required<ReportState>[P]
function selectReportStateProperty<P extends ReportStateProperty>(property: P) {
  return createSelector([selectLocationQuery], (locationQuery): AreaReportProperty<P> => {
    const urlProperty = locationQuery?.[property]
    if (urlProperty !== undefined) return urlProperty
    return DEFAULT_REPORT_STATE[property] as AreaReportProperty<P>
  })
}

// Category
export const selectReportCategorySelector = selectReportStateProperty('reportCategory')

// Subcategory
export const selectReportActivitySubCategorySelector = selectReportStateProperty(
  'reportActivitySubCategory'
)
export const selectReportDetectionsSubCategorySelector = selectReportStateProperty(
  'reportDetectionsSubCategory'
)
export const selectReportEventsSubCategorySelector =
  selectReportStateProperty('reportEventsSubCategory')

// This doesn't need to be suffixed by Selector as the value can be used directly and doesn't depend of the active dataviews
export const selectReportVesselsSubCategory = selectReportStateProperty('reportVesselsSubCategory')

// Area
export const selectReportAreaBounds = selectReportStateProperty('reportAreaBounds')
export const selectReportBufferValueSelector = selectReportStateProperty('reportBufferValue')
export const selectReportBufferUnitSelector = selectReportStateProperty('reportBufferUnit')
export const selectReportBufferOperationSelector =
  selectReportStateProperty('reportBufferOperation')

// Ports
export const selectPortReportName = selectReportStateProperty('portsReportName')
export const selectPortReportCountry = selectReportStateProperty('portsReportCountry')
export const selectPortReportDatasetId = selectReportStateProperty('portsReportDatasetId')

// Vessel Group
export const selectViewOnlyVesselGroup = selectReportStateProperty('viewOnlyVesselGroup')

// Vessels
export const selectReportVesselGraphSelector = selectReportStateProperty('reportVesselGraph')
export const selectReportVesselFilter = selectReportStateProperty('reportVesselFilter')
export const selectReportVesselPage = selectReportStateProperty('reportVesselPage')
export const selectReportVesselResultsPerPage = selectReportStateProperty(
  'reportVesselResultsPerPage'
)
export const selectReportVesselsOrderProperty = selectReportStateProperty(
  'reportVesselOrderProperty'
)
export const selectReportVesselsOrderDirection = selectReportStateProperty(
  'reportVesselOrderDirection'
)

// Activity
export const selectReportActivityGraph = selectReportStateProperty('reportActivityGraph')
export const selectReportTimeComparison = selectReportStateProperty('reportTimeComparison')
