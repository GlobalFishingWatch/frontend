import { createSelector } from '@reduxjs/toolkit'
import {
  selectActiveDetectionsDataviews,
  selectActiveHeatmapEnvironmentalDataviews,
  selectActiveReportActivityDataviews,
  selectReportActiveCategories,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportById } from 'features/reports/reports.slice'
import { selectWorkspaceStateProperty } from 'features/workspace/workspace.selectors'
import {
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import { BufferOperation, BufferUnit, ReportCategory, ReportVesselGraph } from 'types'
import { createDeepEqualSelector } from 'utils/selectors'

export function isActivityReport(reportCategory: ReportCategory) {
  return reportCategory === ReportCategory.Fishing || reportCategory === ReportCategory.Presence
}

export const selectCurrentReport = createSelector(
  [selectReportId, (state) => state.reports],
  (reportId, reports) => {
    const report = selectReportById(reportId)({ reports })
    return report
  }
)

export const selectReportDatasetId = createSelector(
  [selectLocationDatasetId, selectCurrentReport],
  (locationDatasetId, report) => {
    return locationDatasetId || report?.datasetId || ''
  }
)

export const selectReportAreaId = createSelector(
  [selectLocationAreaId, selectCurrentReport],
  (locationAreaId, report) => {
    return locationAreaId || report?.areaId || ''
  }
)

const selectReportCategorySelector = selectWorkspaceStateProperty('reportCategory')
export const selectReportCategory = createSelector(
  [selectReportCategorySelector, selectReportActiveCategories],
  (reportCategory, activeCategories): ReportCategory => {
    return activeCategories.some((category) => category === reportCategory)
      ? reportCategory
      : activeCategories[0]
  }
)

export const selectReportAreaBounds = selectWorkspaceStateProperty('reportAreaBounds')

export const selectActiveReportDataviews = createDeepEqualSelector(
  [
    selectReportCategory,
    selectActiveReportActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveHeatmapEnvironmentalDataviews,
  ],
  (
    reportCategory,
    activityDataviews = [],
    detectionsDataviews = [],
    environmentalDataviews = []
  ) => {
    if (isActivityReport(reportCategory)) {
      return activityDataviews
    }
    if (reportCategory === ReportCategory.Detections) {
      return detectionsDataviews
    }
    return environmentalDataviews
  }
)

export const selectReportActivityGraph = selectWorkspaceStateProperty('reportActivityGraph')
const selectReportVesselGraphSelector = selectWorkspaceStateProperty('reportVesselGraph')

export const selectReportVesselGraph = createSelector(
  [selectReportVesselGraphSelector, selectReportCategory],
  (reportVesselGraph, reportCategory): ReportVesselGraph => {
    if (reportCategory === ReportCategory.Fishing && reportVesselGraph === 'vesselType') {
      return 'geartype'
    }
    return reportVesselGraph
  }
)

export const selectReportVesselPage = createSelector(
  [selectWorkspaceStateProperty('reportVesselPage')],
  (reportVesselPage): number => {
    return typeof reportVesselPage === 'string' ? parseInt(reportVesselPage) : reportVesselPage
  }
)

export const selectReportResultsPerPage = createSelector(
  [selectWorkspaceStateProperty('reportResultsPerPage')],
  (reportResultsPerPage): number => {
    return typeof reportResultsPerPage === 'string'
      ? parseInt(reportResultsPerPage)
      : reportResultsPerPage
  }
)

export const selectReportVesselFilter = selectWorkspaceStateProperty('reportVesselFilter')
export const selectReportTimeComparison = selectWorkspaceStateProperty('reportTimeComparison')

const selectReportBufferValueSelector = selectWorkspaceStateProperty('reportBufferValue')
export const selectReportBufferValue = createSelector(
  [selectReportBufferValueSelector, selectUrlBufferValueQuery],
  (workspaceBufferValue, urlBufferValue): number => {
    return workspaceBufferValue || urlBufferValue
  }
)

const selectReportBufferUnitSelector = selectWorkspaceStateProperty('reportBufferUnit')
export const selectReportBufferUnit = createSelector(
  [selectReportBufferUnitSelector, selectUrlBufferUnitQuery],
  (workspaceBufferUnit, urlBufferUnit): BufferUnit => {
    return workspaceBufferUnit || urlBufferUnit
  }
)

const selectReportBufferOperationSelector = selectWorkspaceStateProperty('reportBufferOperation')
export const selectReportBufferOperation = createSelector(
  [selectReportBufferOperationSelector, selectUrlBufferOperationQuery],
  (workspaceBufferOperation, urlBufferOperation): BufferOperation => {
    return workspaceBufferOperation || urlBufferOperation
  }
)
