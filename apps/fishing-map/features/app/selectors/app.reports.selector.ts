import { createSelector } from '@reduxjs/toolkit'

import { selectActiveReportCategories } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import {
  selectReportActivitySubCategory,
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
  selectReportCategory as selectReportCategorySelector,
  selectReportVesselGraph as selectReportVesselGraphSelector,
} from 'features/reports/reports.config.selectors'
import { selectReportById } from 'features/reports/reports.slice'
import type { ReportVesselGraph } from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import { WORLD_REGION_ID } from 'features/reports/tabs/activity/reports-activity.slice'
import {
  selectIsVesselGroupReportLocation,
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'
import type { BufferOperation, BufferUnit } from 'types'

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
  [selectLocationAreaId, selectCurrentReport, selectIsVesselGroupReportLocation],
  (locationAreaId, report, isVesselGroupReportLocation) => {
    if (isVesselGroupReportLocation) {
      return WORLD_REGION_ID
    }
    return locationAreaId || report?.areaId || ''
  }
)

export const selectReportActiveCategories = createSelector(
  [selectActiveReportCategories],
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

// TODO:CVP merge with selectReportCategory from reports.config.selectors
export const selectReportCategory = createSelector(
  [
    selectReportCategorySelector,
    selectReportActiveCategories,
    selectIsVesselGroupReportLocation,
    selectReportActivitySubCategory,
  ],
  (
    reportCategory,
    activeCategories,
    isVesselGroupReportLocation,
    vGRActivitySubsection
  ): ReportCategory => {
    if (isVesselGroupReportLocation) {
      return vGRActivitySubsection as ReportCategory
    }
    if (activeCategories.some((category) => category === reportCategory)) {
      return reportCategory
    }
    return activeCategories[0]
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
