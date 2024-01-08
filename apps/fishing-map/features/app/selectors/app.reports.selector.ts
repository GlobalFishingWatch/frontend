import { createSelector } from '@reduxjs/toolkit'
import {
  selectActiveDetectionsDataviews,
  selectActiveEnvironmentalDataviews,
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
import {
  Bbox,
  BufferOperation,
  BufferUnit,
  ReportActivityGraph,
  ReportActivityTimeComparison,
  ReportCategory,
  ReportVesselGraph,
} from 'types'
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
  (locationDatasetId, report) => (locationDatasetId || report?.datasetId) as string
)

export const selectReportAreaId = createSelector(
  [selectLocationAreaId, selectCurrentReport],
  (locationAreaId, report) => (locationAreaId || report?.areaId) as number
)

export const selectReportCategory = createSelector(
  [selectWorkspaceStateProperty('reportCategory'), selectReportActiveCategories],
  (reportCategory, activeCategories): ReportCategory => {
    return activeCategories.some((category) => category === reportCategory)
      ? reportCategory
      : activeCategories[0]
  }
)

export const selectReportAreaBounds = createSelector(
  [selectWorkspaceStateProperty('reportAreaBounds')],
  (reportAreaBounds): Bbox => {
    return reportAreaBounds
  }
)

export const selectReportAreaSource = createSelector(
  [selectWorkspaceStateProperty('reportAreaSource')],
  (reportAreaSource): string => {
    return reportAreaSource
  }
)

export const selectActiveReportDataviews = createDeepEqualSelector(
  [
    selectReportCategory,
    selectActiveReportActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveEnvironmentalDataviews,
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

export const selectReportActivityGraph = createSelector(
  [selectWorkspaceStateProperty('reportActivityGraph')],
  (reportActivityGraph): ReportActivityGraph => {
    return reportActivityGraph
  }
)

export const selectReportVesselGraph = createSelector(
  [selectWorkspaceStateProperty('reportVesselGraph'), selectReportCategory],
  (reportVesselGraph, reportCategory): ReportVesselGraph => {
    if (reportCategory === ReportCategory.Fishing && reportVesselGraph === 'vesselType') {
      return 'geartype'
    }
    return reportVesselGraph
  }
)

export const selectReportVesselFilter = createSelector(
  [selectWorkspaceStateProperty('reportVesselFilter')],
  (reportVesselFilter): string => {
    return reportVesselFilter
  }
)

export const selectReportVesselPage = createSelector(
  [selectWorkspaceStateProperty('reportVesselPage')],
  (reportVesselPage): number => {
    return parseInt(reportVesselPage)
  }
)

export const selectReportResultsPerPage = createSelector(
  [selectWorkspaceStateProperty('reportResultsPerPage')],
  (reportVesselPage): number => {
    return parseInt(reportVesselPage)
  }
)

export const selectReportTimeComparison = createSelector(
  [selectWorkspaceStateProperty('reportTimeComparison')],
  (reportTimeComparison): ReportActivityTimeComparison => {
    return reportTimeComparison
  }
)

export const selectReportBufferValue = createSelector(
  [selectWorkspaceStateProperty('reportBufferValue'), selectUrlBufferValueQuery],
  (workspaceBufferValue, urlBufferValue): number => {
    return workspaceBufferValue || urlBufferValue
  }
)

export const selectReportBufferUnit = createSelector(
  [selectWorkspaceStateProperty('reportBufferUnit'), selectUrlBufferUnitQuery],
  (workspaceBufferUnit, urlBufferUnit): BufferUnit => {
    return workspaceBufferUnit || urlBufferUnit
  }
)

export const selectReportBufferOperation = createSelector(
  [selectWorkspaceStateProperty('reportBufferOperation'), selectUrlBufferOperationQuery],
  (workspaceBufferOperation, urlBufferOperation): BufferOperation => {
    return workspaceBufferOperation || urlBufferOperation
  }
)
