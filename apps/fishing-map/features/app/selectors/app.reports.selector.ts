import { createSelector } from '@reduxjs/toolkit'
import { selectActiveDataviewsCategories } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { selectReportById } from 'features/reports/areas/reports.slice'
import {
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import { BufferOperation, BufferUnit } from 'types'
import {
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
  selectReportCategorySelector,
  selectReportVesselGraphSelector,
} from 'features/reports/areas/reports.config.selectors'
import { ReportCategory, ReportVesselGraph } from 'features/reports/areas/reports.types'

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

export const selectReportActiveCategories = createSelector(
  [selectActiveDataviewsCategories],
  (activeCategories): ReportCategory[] => {
    const orderedCategories = [
      ReportCategory.Fishing,
      ReportCategory.Presence,
      ReportCategory.Detections,
      ReportCategory.Environment,
    ]
    return orderedCategories.flatMap((category) =>
      activeCategories.some((a) => a === category) ? category : []
    )
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
