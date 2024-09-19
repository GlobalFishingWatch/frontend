import { createSelector } from '@reduxjs/toolkit'
import {
  selectActiveDetectionsDataviews,
  selectActiveHeatmapEnvironmentalDataviews,
  selectActiveReportActivityDataviews,
  selectReportActiveCategories,
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportById } from 'features/area-report/reports.slice'
import {
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import { BufferOperation, BufferUnit } from 'types'
import { createDeepEqualSelector } from 'utils/selectors'
import {
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
  selectReportCategorySelector,
  selectReportVesselGraphSelector,
} from 'features/area-report/reports.config.selectors'
import { ReportCategory, ReportVesselGraph } from 'features/area-report/reports.types'

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

export const selectReportCategory = createSelector(
  [selectReportCategorySelector, selectReportActiveCategories],
  (reportCategory, activeCategories): ReportCategory => {
    return activeCategories.some((category) => category === reportCategory)
      ? reportCategory
      : activeCategories[0]
  }
)

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

export const selectReportVesselGraph = createSelector(
  [selectReportVesselGraphSelector, selectReportCategory],
  (reportVesselGraph, reportCategory): ReportVesselGraph => {
    if (reportCategory === ReportCategory.Fishing && reportVesselGraph === 'vesselType') {
      return 'geartype'
    }
    return reportVesselGraph
  }
)

export const selectReportBufferValue = createSelector(
  [selectReportBufferValueSelector, selectUrlBufferValueQuery],
  (workspaceBufferValue, urlBufferValue): number => {
    return workspaceBufferValue || urlBufferValue
  }
)

export const selectReportBufferUnit = createSelector(
  [selectReportBufferUnitSelector, selectUrlBufferUnitQuery],
  (workspaceBufferUnit, urlBufferUnit): BufferUnit => {
    return workspaceBufferUnit || urlBufferUnit
  }
)

export const selectReportBufferOperation = createSelector(
  [selectReportBufferOperationSelector, selectUrlBufferOperationQuery],
  (workspaceBufferOperation, urlBufferOperation): BufferOperation => {
    return workspaceBufferOperation || urlBufferOperation
  }
)
