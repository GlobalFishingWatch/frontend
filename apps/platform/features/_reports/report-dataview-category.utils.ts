import type { Dataview } from '@globalfishingwatch/api-types'
import { DatasetCategory, DataviewCategory, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type {
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
} from 'features/_reports/reports.types'
import { ReportCategory } from 'features/_reports/reports.types'
import type { FeatureFlag } from 'features/debug/debug.slice'

/**
 * Pure dataview → report category predicates.
 *
 * Split out of area-reports.utils.ts, which imports @turf/turf and match-sorter for its geometry and
 * vessel-filtering helpers. The dataview selectors need only these predicates, and they are reachable
 * from the always-loaded route graph, so importing them from area-reports.utils put both heavy packages
 * in the entry chunk of every page. area-reports.utils re-exports everything here, so its other
 * consumers are unaffected.
 */

export const isPointsDataviewReportSupported = (dataview: Dataview | UrlDataviewInstance) => {
  return dataview.config?.type === DataviewType.UserPoints
}

export const isPolygonsDataviewReportSupported = (dataview: Dataview | UrlDataviewInstance) => {
  const dataset = dataview.datasets?.[0]
  if (!dataset) {
    return false
  }
  return (
    dataview.config?.type === DataviewType.Polygons ||
    dataview.config?.type === DataviewType.UserContext ||
    dataview.config?.type === DataviewType.Context
  )
}

export const isContextDataviewReportSupported = (dataview: Dataview | UrlDataviewInstance) => {
  return isPointsDataviewReportSupported(dataview) || isPolygonsDataviewReportSupported(dataview)
}

export const getReportCategoryFromDataview = (
  dataview: Dataview | UrlDataviewInstance
): ReportCategory => {
  if (
    isContextDataviewReportSupported(dataview) &&
    dataview.category !== DataviewCategory.Environment
  ) {
    return ReportCategory.Others
  }
  return dataview.category as unknown as ReportCategory
}

export const getReportSubCategoryFromDataview = (
  dataview: Dataview | UrlDataviewInstance
): ReportActivitySubCategory | ReportDetectionsSubCategory => {
  // Workaround to display BQ datasets as fishing ones (e.g. turning-tides)
  if (
    dataview.datasets?.[0]?.category === DatasetCategory.Activity &&
    dataview.datasets?.[0]?.subcategory === 'user'
  ) {
    return 'fishing' as ReportActivitySubCategory
  }

  return dataview.datasets?.[0]?.subcategory as
    | ReportActivitySubCategory
    | ReportDetectionsSubCategory
}

const SUPPORTED_REPORT_CATEGORIES = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.Environment,
  DataviewCategory.VesselGroups,
  DataviewCategory.Events,
  DataviewCategory.Context,
  DataviewCategory.User,
]
const SUPPORTED_REPORT_TYPES = [
  DataviewType.HeatmapAnimated,
  DataviewType.HeatmapStatic,
  DataviewType.FourwingsTileCluster,
  DataviewType.FourwingsVector,
  DataviewType.Context,
  DataviewType.Polygons,
  DataviewType.UserPoints,
  DataviewType.UserContext,
]
const SUPPORTED_COMPARISON_CATEGORIES = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.Environment,
]
const SUPPORTED_COMPARISON_TYPES = [
  DataviewType.HeatmapAnimated,
  DataviewType.FourwingsVector,
  DataviewType.FourwingsTileCluster,
]

export const isSupportedReportDataview = (
  dataview: Dataview | UrlDataviewInstance,
  featureFlags: Record<FeatureFlag, boolean>
) => {
  const { category, config } = dataview
  if (!category || !config?.visible || !config?.type) {
    return false
  }
  let reportTypes = SUPPORTED_REPORT_TYPES
  if (!featureFlags.polygonsReport) {
    reportTypes = reportTypes.filter(
      (t) =>
        t !== DataviewType.Polygons && t !== DataviewType.UserContext && t !== DataviewType.Context
    )
  }
  return SUPPORTED_REPORT_CATEGORIES.includes(category) && reportTypes.includes(config?.type)
}

export const isSupportedComparisonDataview = (dataview: Dataview | UrlDataviewInstance) => {
  const { category, config } = dataview
  if (!category || !config?.type) {
    return false
  }
  return (
    SUPPORTED_COMPARISON_CATEGORIES.includes(category) &&
    SUPPORTED_COMPARISON_TYPES.includes(config?.type)
  )
}
