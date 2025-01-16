import { createSelector } from '@reduxjs/toolkit'
import type { BufferOperation, BufferUnit } from 'types'

import { selectActiveReportCategories } from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import {
  selectReportBufferOperationSelector,
  selectReportBufferUnitSelector,
  selectReportBufferValueSelector,
  selectReportCategorySelector,
  selectReportVesselGraphSelector,
} from 'features/reports/areas/area-reports.config.selectors'
import { selectReportById } from 'features/reports/areas/area-reports.slice'
import type { ReportVesselGraph } from 'features/reports/areas/area-reports.types'
import { ReportCategory } from 'features/reports/areas/area-reports.types'
import { WORLD_REGION_ID } from 'features/reports/shared/activity/reports-activity.slice'
import { selectVGRActivitySubsection } from 'features/reports/vessel-groups/vessel-group.config.selectors'
import {
  selectIsVesselGroupReportLocation,
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
  selectUrlBufferOperationQuery,
  selectUrlBufferUnitQuery,
  selectUrlBufferValueQuery,
} from 'routes/routes.selectors'

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

export const selectReportCategory = createSelector(
  [
    selectReportCategorySelector,
    selectReportActiveCategories,
    selectIsVesselGroupReportLocation,
    selectVGRActivitySubsection,
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
