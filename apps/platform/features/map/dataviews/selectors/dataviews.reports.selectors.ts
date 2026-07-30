import { createSelector } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'

import { DataviewCategory } from '@globalfishingwatch/api-types'

import { DATASET_COMPARISON_SUFFIX } from 'data/map/config'
import { selectFeatureFlags } from 'features/debug/debug.slice'
import { selectAllDatasets } from 'features/map/datasets/datasets.slice'
import {
  getReportCategoryFromDataview,
  getReportSubCategoryFromDataview,
  isSupportedReportDataview,
} from 'features/reports/report-dataview-category.utils'
import { getVesselGroupActivityDatasets } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectVGRDatasets } from 'features/reports/report-vessel-group/vessel-group-report.slice'
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
} from 'router/routes.selectors'

import { selectDataviewInstancesResolved } from './dataviews.resolvers.selectors'
import { selectPresenceDataview } from './dataviews.static.selectors'

export const selectActiveSupportedReportDataviews = createSelector(
  [selectDataviewInstancesResolved, selectFeatureFlags],
  (dataviews, featureFlags) => {
    return dataviews.filter((dataview) => isSupportedReportDataview(dataview, featureFlags))
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
      dataviews
        .filter((dv) => !dv.id.includes(DATASET_COMPARISON_SUFFIX))
        .flatMap((d) =>
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
    selectVGRDatasets,
    selectPresenceDataview,
    selectAllDatasets,
  ],
  (
    isVesselGroupReportLocation,
    activityReportSubCategories,
    vesselGroupReportSubCategories,
    vesselGroupDatasets,
    presenceDataview,
    allDatasets
  ) => {
    if (!isVesselGroupReportLocation) {
      return activityReportSubCategories
    }
    const supportsPresence =
      getVesselGroupActivityDatasets({
        vesselGroupDatasets,
        activityDatasetIds:
          presenceDataview?.datasetsConfig?.map((dataset) => dataset.datasetId) || [],
        allDatasets,
      }).length > 0
    return supportsPresence
      ? vesselGroupReportSubCategories
      : vesselGroupReportSubCategories.filter((subCategory) => subCategory !== 'presence')
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
