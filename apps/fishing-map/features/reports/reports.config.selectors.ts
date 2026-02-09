import { createSelector } from '@reduxjs/toolkit'

import { selectWorkspaceState } from 'features/workspace/workspace.selectors'
import { selectLocationQuery } from 'routes/routes.selectors'

import { DEFAULT_REPORT_STATE } from './reports.config'
import type { ReportState, ReportStateProperty } from './reports.types'

type AreaReportProperty<P extends ReportStateProperty> = Required<ReportState>[P]
function selectReportStateProperty<P extends ReportStateProperty>(property: P) {
  return createSelector(
    [selectLocationQuery, selectWorkspaceState],
    (locationQuery, workspaceState): AreaReportProperty<P> => {
      const urlProperty = locationQuery?.[property as keyof typeof locationQuery]
      if (urlProperty !== undefined) return urlProperty as AreaReportProperty<P>
      if (property in workspaceState && workspaceState[property as keyof typeof workspaceState]) {
        return workspaceState[property as keyof typeof workspaceState] as AreaReportProperty<P>
      }
      return DEFAULT_REPORT_STATE[property] as AreaReportProperty<P>
    }
  )
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
export const selectReportComparisonDataviewIds = selectReportStateProperty(
  'reportComparisonDataviewIds'
)

// Events
export const selectReportEventsGraph = selectReportStateProperty('reportEventsGraph')
export const selectReportEventsPortsFilter = selectReportStateProperty('reportEventsPortsFilter')
export const selectReportEventsPortsPage = selectReportStateProperty('reportEventsPortsPage')
export const selectReportEventsPortsResultsPerPage = selectReportStateProperty(
  'reportEventsPortsResultsPerPage'
)
