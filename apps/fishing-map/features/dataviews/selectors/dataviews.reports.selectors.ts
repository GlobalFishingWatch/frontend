import { createSelector } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'

import { DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'

import {
  getReportCategoryFromDataview,
  getReportSubCategoryFromDataview,
} from 'features/reports/report-area/area-reports.utils'
import type {
  AnyReportSubCategory,
  ReportActivitySubCategory,
  ReportCategory,
  ReportDetectionsSubCategory,
  ReportEventsSubCategory,
} from 'features/reports/reports.types'
import { selectIsVesselGroupReportLocation } from 'routes/routes.selectors'

import { selectDataviewInstancesResolved } from './dataviews.resolvers.selectors'

const SUPPORTED_REPORT_CATEGORIES = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.Environment,
  DataviewCategory.VesselGroups,
  DataviewCategory.Events,
]
const SUPPORTED_REPORT_TYPES = [
  DataviewType.HeatmapAnimated,
  DataviewType.HeatmapStatic,
  DataviewType.FourwingsTileCluster,
]
export const selectActiveSupportedReportDataviews = createSelector(
  [selectDataviewInstancesResolved],
  (dataviews) => {
    return dataviews.filter(
      (d) =>
        d.config?.visible &&
        d.category &&
        d.config?.type &&
        SUPPORTED_REPORT_CATEGORIES.includes(d.category) &&
        SUPPORTED_REPORT_TYPES.includes(d.config?.type)
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

export const selectActiveEventsReportSubCategories =
  selectActiveReportSubCategoriesByCategory<ReportEventsSubCategory>(DataviewCategory.Events)
