import { createSelector } from '@reduxjs/toolkit'

import {
  selectActiveActivityReportSubCategories,
  selectActiveDetectionsReportSubCategories,
  selectActiveReportCategories,
} from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import {
  selectReportActivitySubCategory,
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
  selectReportCategorySelector,
  selectReportDetectionsSubCategory,
  selectReportEventsSubCategory,
  selectReportVesselGraphSelector,
  selectReportVesselsSubCategory,
} from 'features/reports/reports.config.selectors'
import { selectReportById } from 'features/reports/reports.slice'
import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportEventsSubCategory,
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
    // TODO:CVP ensure ports report doesn't need something similar
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

// TODO:CVP merge with selectReportCategory from reports.config.selectors
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
    selectActiveActivityReportSubCategories,
    selectReportActivitySubCategory,
    selectReportDetectionsSubCategory,
    selectActiveDetectionsReportSubCategories,
    selectReportVesselsSubCategory,
    selectReportEventsSubCategory,
  ],
  (
    reportCategory,
    activeActivityReportSubCategories,
    reportActivitySubCategory,
    reportDetectionsSubCategory,
    activeDetectionsReportSubCategories,
    reportVesselsSubCategory,
    reportEventsSubCategory
  ): AnyReportSubCategory | undefined => {
    if (
      reportCategory === ReportCategory.Activity ||
      reportCategory === ReportCategory.Detections
    ) {
      const subCategory =
        reportCategory === ReportCategory.Activity
          ? reportActivitySubCategory
          : reportDetectionsSubCategory
      if (
        (reportCategory === ReportCategory.Activity
          ? activeActivityReportSubCategories
          : activeDetectionsReportSubCategories
        ).some((category) => category === subCategory)
      ) {
        return subCategory as ReportActivitySubCategory
      }
      return activeActivityReportSubCategories[0] as ReportActivitySubCategory
    }
    if (reportCategory === ReportCategory.VesselGroup) {
      return reportVesselsSubCategory as ReportVesselsSubCategory
    }
    if (reportCategory === ReportCategory.Events) {
      return reportEventsSubCategory as ReportEventsSubCategory
    }
    return undefined
  }
)

export const selectReportVesselGraph = createSelector(
  [selectReportVesselGraphSelector, selectReportCategory, selectReportActivitySubCategory],
  (reportVesselGraph, reportCategory, reportActivitySubCategory): ReportVesselGraph => {
    if (
      reportCategory === ReportCategory.Activity &&
      reportActivitySubCategory === 'fishing' &&
      reportVesselGraph === 'vesselType'
    ) {
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
