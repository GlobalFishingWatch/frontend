import { createSelector } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'

import { DataviewCategory } from '@globalfishingwatch/api-types'

import { selectIsGlobalReportsEnabled } from 'features/debug/debug.selectors'
import {
  getReportCategoryFromDataview,
  getReportSubCategoryFromDataview,
  isSupportedReportDataview,
} from 'features/reports/report-area/area-reports.utils'
import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportCategory,
  ReportDetectionsSubCategory,
  ReportEventsSubCategory,
} from 'features/reports/reports.types'
import {
  selectIsPortReportLocation,
  selectIsVesselGroupReportLocation,
} from 'routes/routes.selectors'

import { selectDataviewInstancesResolved } from './dataviews.resolvers.selectors'

export const selectActiveSupportedReportDataviews = createSelector(
  [selectDataviewInstancesResolved, selectIsGlobalReportsEnabled],
  (dataviews, isGlobalReportsEnabled) => {
    return dataviews.filter((dataview) =>
      isSupportedReportDataview(dataview, isGlobalReportsEnabled)
    )
  }
)

export const selectActiveReportCategories = createSelector(
  [selectActiveSupportedReportDataviews],
  (dataviews): ReportCategory[] => {
    return uniq(dataviews.flatMap((d) => getReportCategoryFromDataview(d) || []))
  }
)

export const selectActiveReportSubCategoriesByCategory = <R = AnyReportSubCategory>(
  dataviewCategory: DataviewCategory
) =>
  createSelector([selectActiveSupportedReportDataviews], (dataviews): R[] => {
    return uniq(
      dataviews.flatMap((d) =>
        d.category === dataviewCategory ? getReportSubCategoryFromDataview(d) || [] : []
      ) as R[]
    )
  })

export const selectActiveActivityReportSubCategories = createSelector(
  [
    selectIsVesselGroupReportLocation,
    selectActiveReportSubCategoriesByCategory<ReportActivitySubCategory>(DataviewCategory.Activity),
    selectActiveReportSubCategoriesByCategory<ReportActivitySubCategory>(
      DataviewCategory.VesselGroups
    ),
  ],
  (isVesselGroupReportLocation, activityReportSubCategories, vesselGroupReportSubCategories) => {
    return isVesselGroupReportLocation
      ? vesselGroupReportSubCategories
      : activityReportSubCategories
  }
)

export const selectActiveDetectionsReportSubCategories =
  selectActiveReportSubCategoriesByCategory<ReportDetectionsSubCategory>(
    DataviewCategory.Detections
  )

export const selectActiveEventsReportSubCategories = createSelector(
  [
    selectIsPortReportLocation,
    selectActiveReportSubCategoriesByCategory<ReportEventsSubCategory>(DataviewCategory.Events),
  ],
  (isPortReportLocation, activeEventsReportSubCategories) => {
    return isPortReportLocation
      ? // In ports report only port visit events are available
        ['port_visit' as ReportEventsSubCategory]
      : activeEventsReportSubCategories
  }
)
