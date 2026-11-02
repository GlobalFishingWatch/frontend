import { createSelector } from '@reduxjs/toolkit'

import {
  selectActiveActivityReportSubCategories,
  selectActiveDetectionsReportSubCategories,
  selectActiveEventsReportSubCategories,
  selectActiveReportCategories,
} from 'features/_map/dataviews/selectors/dataviews.reports.selectors'
import { selectIsVesselGroupReportLocation } from 'router/routes.selectors'

import {
  selectReportActivitySubCategorySelector,
  selectReportCategorySelector,
  selectReportDetectionsSubCategorySelector,
  selectReportEventsSubCategorySelector,
  selectReportVesselGraphSelector,
  selectReportVesselsSubCategory,
} from './reports.config.selectors'
import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
  ReportEventsSubCategory,
  ReportVesselGraph,
  ReportVesselsSubCategory,
} from './reports.types'
import { ReportCategory } from './reports.types'

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
      ReportCategory.Others,
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

export const selectReportUnit = createSelector(
  [selectReportCategory, selectReportVesselsSubCategory],
  (reportCategory, reportVesselsSubCategory): 'hour' | 'detection' | 'event' | '%' | undefined => {
    if (reportCategory === ReportCategory.Activity) {
      return 'hour'
    } else if (reportCategory === ReportCategory.Detections) {
      return 'detection'
    } else if (reportCategory === ReportCategory.Events) {
      return 'event'
    } else if (
      (reportCategory === ReportCategory.VesselGroup && reportVesselsSubCategory === 'coverage') ||
      reportCategory === ReportCategory.VesselGroupInsights
    ) {
      // Used for VGR insights coverage graph
      return '%'
    }
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
