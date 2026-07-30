import type { DataviewInstance } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { DATASET_COMPARISON_SUFFIX } from 'data/map/config'

/**
 * Strips report-only dataview config before a workspace is persisted or parsed.
 *
 * These live in their own leaf module rather than beside the report logic they belong to because their
 * only consumer is features/_map/workspace/workspace.utils.ts, which the workspace and workspaces slices
 * both reach. Importing them from area-reports.utils / reports-activity-timeseries.utils put @turf/turf,
 * match-sorter, simple-statistics and deck-layers in the reducer map, and therefore in the entry chunk
 * of every page — see scripts/check-store-graph.mjs.
 */

export function cleanAggregateByPropertyDataviewFromReport(dataview: UrlDataviewInstance) {
  if (!dataview.config?.aggregateByProperty) {
    return dataview
  }

  return {
    ...dataview,
    config: {
      ...dataview.config,
      aggregateByProperty: undefined,
    },
  }
}

export function cleanDatasetComparisonDataviewInstances(
  dataviewInstances: (UrlDataviewInstance | DataviewInstance)[] = []
) {
  return dataviewInstances?.filter(
    (dataviewInstance) => !dataviewInstance?.id?.includes(DATASET_COMPARISON_SUFFIX)
  )
}
