import { createSelector } from '@reduxjs/toolkit'

import {
  selectActiveActivityReportSubCategories,
  selectActiveDetectionsReportSubCategories,
  selectActiveEventsReportSubCategories,
} from 'features/dataviews/selectors/dataviews.reports.selectors'

import {
  selectReportActivitySubCategorySelector,
  selectReportCategorySelector,
  selectReportDetectionsSubCategorySelector,
  selectReportEventsSubCategorySelector,
} from './reports.config.selectors'
import type {
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
  ReportEventsSubCategory,
} from './reports.types'
import { ReportCategory } from './reports.types'

export const selectActiveReportSubCategories = createSelector(
  [
    selectReportCategorySelector,
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
