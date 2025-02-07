import { createSelector } from '@reduxjs/toolkit'

import { selectActiveReportCategories } from 'features/dataviews/selectors/dataviews.reports.selectors'
import {
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
  selectReportCategorySelector,
  selectReportVesselGraphSelector,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import {
  selectReportActivitySubCategory,
  selectReportDetectionsSubCategory,
  selectReportEventsSubCategory,
} from 'features/reports/reports.selectors'
import { selectReportById } from 'features/reports/reports.slice'
import type {
  AnyReportSubCategory,
  ReportVesselGraph,
  ReportVesselsSubCategory,
} from 'features/reports/reports.types'
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

// TODO:CVP move this selectors to reports.selectors
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
  [selectActiveReportCategories, selectIsVesselGroupReportLocation],
  (activeCategories, isVesselGroupReportLocation): ReportCategory[] => {
    if (isVesselGroupReportLocation) {
      return [
        ReportCategory.VesselGroup,
        ReportCategory.VesselGroupInsights,
        ReportCategory.Activity,
        ReportCategory.Events,
      ]
    }
    const orderedCategories = [
      ReportCategory.Activity,
      ReportCategory.Detections,
      ReportCategory.Environment,
      ReportCategory.Events,
    ]
    return orderedCategories.flatMap((category) =>
      activeCategories.some((a) => a === category) ? category : []
    )
  }
)

export const selectReportCategory = createSelector(
  [selectReportCategorySelector, selectReportActiveCategories],
  (reportCategory, activeCategories): ReportCategory => {
    if (activeCategories.some((category) => category === reportCategory)) {
      return reportCategory as ReportCategory
    }
    return activeCategories[0]
  }
)

export const selectReportSubCategory = createSelector(
  [
    selectReportCategory,
    selectReportActivitySubCategory,
    selectReportDetectionsSubCategory,
    selectReportEventsSubCategory,
    selectReportVesselsSubCategory,
  ],
  (
    reportCategory,
    reportActivitySubCategory,
    reportDetectionsSubCategory,
    reportEventsSubCategory,
    reportVesselsSubCategory
  ): AnyReportSubCategory | undefined => {
    if (reportCategory === ReportCategory.VesselGroup) {
      return reportVesselsSubCategory
    }
    if (reportCategory === ReportCategory.Events) {
      return reportEventsSubCategory
    }
    if (reportCategory === ReportCategory.Activity) {
      return reportActivitySubCategory
    }
    if (reportCategory === ReportCategory.Detections) {
      return reportDetectionsSubCategory
    }
    return undefined
  }
)

export const selectReportVesselGraph = createSelector(
  [selectReportVesselGraphSelector, selectReportCategory, selectReportVesselsSubCategory],
  (
    reportVesselGraph,
    reportCategory,
    reportVesselsSubCategory
  ): ReportVesselGraph | ReportVesselsSubCategory => {
    if (reportCategory === ReportCategory.VesselGroup) {
      return reportVesselsSubCategory as ReportVesselsSubCategory
    }
    return reportVesselGraph
  }
)

// TODO:CVP move this selectors to reports.area.selectors
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
