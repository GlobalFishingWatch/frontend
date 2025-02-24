import { createSelector } from '@reduxjs/toolkit'

import {
  selectActiveActivityReportSubCategories,
  selectActiveDetectionsReportSubCategories,
  selectActiveEventsReportSubCategories,
  selectActiveReportCategories,
} from 'features/dataviews/selectors/dataviews.reports.selectors'
import {
  selectIsVesselGroupReportLocation,
  selectLocationAreaId,
  selectLocationDatasetId,
  selectReportId,
} from 'routes/routes.selectors'

import { WORLD_REGION_ID } from './tabs/activity/reports-activity.slice'
import {
  selectReportActivitySubCategorySelector,
  selectReportCategorySelector,
  selectReportDetectionsSubCategorySelector,
  selectReportEventsSubCategorySelector,
  selectReportVesselGraphSelector,
  selectReportVesselsSubCategory,
} from './reports.config.selectors'
import { selectReportById } from './reports.slice'
import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
  ReportEventsSubCategory,
  ReportVesselGraph,
  ReportVesselsSubCategory,
} from './reports.types'
import { ReportCategory } from './reports.types'

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

export const selectActiveReportSubCategories = createSelector(
  [
    selectReportCategory,
    selectActiveActivityReportSubCategories,
    selectActiveDetectionsReportSubCategories,
    selectActiveEventsReportSubCategories,
  ],
  (
    reportCategory,
    activeActivityReportSubCategories,
    activeDetectionsReportSubCategories,
    activeEventsReportSubCategories
  ):
    | (ReportActivitySubCategory | ReportDetectionsSubCategory | ReportEventsSubCategory)[]
    | undefined => {
    if (reportCategory === ReportCategory.Events) {
      return activeEventsReportSubCategories
    }
    if (reportCategory === ReportCategory.Activity) {
      return activeActivityReportSubCategories
    }
    if (reportCategory === ReportCategory.Detections) {
      return activeDetectionsReportSubCategories
    }
  }
)

export const selectReportActivitySubCategory = createSelector(
  [selectReportActivitySubCategorySelector, selectActiveActivityReportSubCategories],
  (reportActivitySubCategory, activeActivityReportSubCategories): ReportActivitySubCategory => {
    if (
      activeActivityReportSubCategories.some((category) => category === reportActivitySubCategory)
    ) {
      return reportActivitySubCategory as ReportActivitySubCategory
    }
    return activeActivityReportSubCategories[0] as ReportActivitySubCategory
  }
)

export const selectReportDetectionsSubCategory = createSelector(
  [selectReportDetectionsSubCategorySelector, selectActiveDetectionsReportSubCategories],
  (
    reportDetectionsSubCategory,
    activeDetectionsReportSubCategories
  ): ReportDetectionsSubCategory => {
    if (
      activeDetectionsReportSubCategories.some(
        (category) => category === reportDetectionsSubCategory
      )
    ) {
      return reportDetectionsSubCategory as ReportDetectionsSubCategory
    }
    return activeDetectionsReportSubCategories[0] as ReportDetectionsSubCategory
  }
)

export const selectReportEventsSubCategory = createSelector(
  [selectReportEventsSubCategorySelector, selectActiveEventsReportSubCategories],
  (reportEventsSubCategory, activeEventsReportSubCategories): ReportEventsSubCategory => {
    if (activeEventsReportSubCategories.some((category) => category === reportEventsSubCategory)) {
      return reportEventsSubCategory as ReportEventsSubCategory
    }
    return activeEventsReportSubCategories[0] as ReportEventsSubCategory
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
  [selectReportCategory, selectReportVesselGraphSelector, selectReportVesselsSubCategory],
  (
    reportCategory,
    reportVesselGraph,
    reportVesselsSubCategory
  ): ReportVesselGraph | ReportVesselsSubCategory => {
    if (reportCategory === ReportCategory.VesselGroup) {
      return reportVesselsSubCategory as ReportVesselsSubCategory
    }
    return reportVesselGraph
  }
)
