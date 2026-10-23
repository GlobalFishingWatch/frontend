import { createSelector } from '@reduxjs/toolkit'

import { ENTIRE_WORLD_REPORT_AREA_ID } from 'features/_reports/report-area/area-reports.config'
import {
  selectIsVesselGroupReportLocation,
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
} from 'router/routes.selectors'

import { selectReportById } from './reports.slice'

// Kept apart from reports.selectors and area-reports.selectors, which pull the dataview selector graph
// and deck.gl. NavigationHistoryButton renders outside /map and only needs these ids.
// Guarded by apps/platform/scripts/load-boundaries.

export const selectCurrentReport = createSelector(
  [selectReportId, (state) => state.reports],
  (reportId, reports) => {
    const report = reportId ? selectReportById(reportId)({ reports }) : undefined
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
      return ENTIRE_WORLD_REPORT_AREA_ID
    }
    return locationAreaId || report?.areaId || ''
  }
)

export const selectReportAreaIds = createSelector(
  [selectReportAreaId, selectReportDatasetId],
  (areaId, datasetId) => {
    return { datasetId, areaId }
  }
)
