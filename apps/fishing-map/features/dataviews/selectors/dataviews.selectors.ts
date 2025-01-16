import { createSelector } from '@reduxjs/toolkit'

import type { Dataset, Dataview } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, DEFAULT_DATAVIEW_SLUGS } from 'data/workspaces'
import { selectReportCategory } from 'features/app/selectors/app.reports.selector'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  getActiveDatasetsInDataview,
  getDatasetsInDataviews,
  getRelatedDatasetByType,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import {
  isBathymetryDataview,
  VESSEL_DATAVIEW_INSTANCE_PREFIX,
} from 'features/dataviews/dataviews.utils'
import {
  selectActiveActivityDataviews,
  selectActiveContextAreasDataviews,
  selectActiveDetectionsDataviews,
  selectActiveEnvironmentalDataviews,
  selectActiveEventsDataviews,
  selectActiveVesselGroupDataviews,
  selectActiveVesselsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectAllDataviewInstancesResolved,
  selectDataviewInstancesMergedOrdered,
  selectDataviewInstancesResolved,
} from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { HeatmapDownloadTab } from 'features/download/downloadActivity.config'
import { selectDownloadActiveTabId } from 'features/download/downloadActivity.slice'
import { ReportCategory } from 'features/reports/areas/area-reports.types'
import { getReportCategoryFromDataview } from 'features/reports/areas/area-reports.utils'
import {
  selectVGRSection,
  selectVGRSubsection,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import {
  getReportVesselGroupVisibleDataviews,
  isVesselGroupActivityDataview,
} from 'features/reports/vessel-groups/vessel-group-report.dataviews'
import { selectVGRActivityDataview } from 'features/reports/vessel-groups/vessel-group-report.selectors'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import {
  selectIsAnyAreaReportLocation,
  selectIsVesselGroupReportLocation,
  selectReportVesselGroupId,
  selectUrlDataviewInstances,
  selectVesselId,
} from 'routes/routes.selectors'
import { createDeepEqualSelector } from 'utils/selectors'

export const selectHasOtherVesselGroupDataviews = createSelector(
  [
    selectDataviewInstancesResolved,
    selectReportVesselGroupId,
    selectVGRSection,
    selectVGRSubsection,
  ],
  (dataviews, reportVesselGroupId, vGRSection, vGRSubsection) => {
    if (!dataviews?.length) return false
    const vesselGroupReportDataviews = getReportVesselGroupVisibleDataviews({
      dataviews,
      reportVesselGroupId,
      vesselGroupReportSection: vGRSection,
      vesselGroupReportSubSection: vGRSubsection,
    })
    const workspaceVisibleDataviews = dataviews.filter(({ config }) => config?.visible === true)
    return workspaceVisibleDataviews.length > vesselGroupReportDataviews.length
  }
)

export const selectBasemapLabelsDataviewInstance = createSelector(
  [selectAllDataviewInstancesResolved],
  (dataviews) => {
    const basemapLabelsDataview = dataviews?.find(
      (d) => d.config?.type === DataviewType.BasemapLabels
    )
    return basemapLabelsDataview || DEFAULT_BASEMAP_DATAVIEW_INSTANCE
  }
)

export const selectActivityMergedDataviewId = createSelector(
  [selectActiveActivityDataviews, selectVGRActivityDataview],
  (dataviews, vGRActivityDataview): string => {
    if (vGRActivityDataview) {
      return vGRActivityDataview.id
    }
    return dataviews?.length ? getMergedDataviewId(dataviews) : ''
  }
)

export const selectActiveReportActivityDataviews = createSelector(
  [
    selectActiveActivityDataviews,
    selectActiveVesselGroupDataviews,
    selectIsVesselGroupReportLocation,
    selectIsAnyAreaReportLocation,
    selectReportCategory,
  ],
  (
    activityDataviews,
    vesselGroupDataviews,
    isVGRLocation,
    isAreaReportLocation,
    reportCategory
  ): UrlDataviewInstance[] => {
    if (isVGRLocation) {
      return vesselGroupDataviews.filter((d) => isVesselGroupActivityDataview(d.id))
    }
    if (isAreaReportLocation) {
      return activityDataviews.filter((dataview) => {
        return getReportCategoryFromDataview(dataview) === reportCategory
      })
    }
    return activityDataviews
  }
)

export const selectDetectionsMergedDataviewId = createSelector(
  [selectActiveDetectionsDataviews],
  (dataviews): string => {
    return dataviews?.length ? getMergedDataviewId(dataviews) : ''
  }
)

export const selectActiveActivityAndDetectionsDataviews = createSelector(
  [selectActiveReportActivityDataviews, selectActiveDetectionsDataviews],
  (activityDataviews = [], detectionsDataviews = []) => [
    ...activityDataviews,
    ...detectionsDataviews,
  ]
)

export const selectActiveHeatmapEnvironmentalDataviews = createSelector(
  [selectActiveEnvironmentalDataviews],
  (dataviews) => {
    return dataviews.filter((dv) => dv.datasets?.every((ds) => ds.type === DatasetTypes.Fourwings))
  }
)

export function isActivityReport(reportCategory: ReportCategory) {
  return reportCategory === ReportCategory.Fishing || reportCategory === ReportCategory.Presence
}

export const selectActiveReportDataviews = createDeepEqualSelector(
  [
    selectReportCategory,
    selectActiveReportActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveHeatmapEnvironmentalDataviews,
    selectIsVesselGroupReportLocation,
  ],
  (
    reportCategory,
    activityDataviews = [],
    detectionsDataviews = [],
    environmentalDataviews = [],
    isVesselGroupReportLocation
  ) => {
    if (isVesselGroupReportLocation) {
      return activityDataviews
    }
    if (isActivityReport(reportCategory)) {
      return activityDataviews
    }
    if (reportCategory === ReportCategory.Detections) {
      return detectionsDataviews
    }
    return environmentalDataviews
  }
)

export const selectActiveHeatmapAnimatedEnvironmentalDataviews = createSelector(
  [selectActiveHeatmapEnvironmentalDataviews],
  (dataviews) => {
    return dataviews.filter((dv) => dv.config?.type === DataviewType.HeatmapAnimated)
  }
)

export const selectActiveHeatmapDowloadDataviews = createSelector(
  [selectActiveActivityAndDetectionsDataviews, selectActiveHeatmapEnvironmentalDataviews],
  (activityAndDetectionsDataviews = [], environmentalDataviews = []) => {
    return [...activityAndDetectionsDataviews, ...environmentalDataviews]
  }
)

export const selectActiveHeatmapDowloadDataviewsByTab = createSelector(
  [
    selectActiveActivityAndDetectionsDataviews,
    selectActiveHeatmapEnvironmentalDataviews,
    selectDownloadActiveTabId,
  ],
  (activityAndDetectionsDataviews = [], environmentalDataviews = [], downloadTabId) => {
    if (downloadTabId === HeatmapDownloadTab.Environment) {
      return environmentalDataviews
    }
    return activityAndDetectionsDataviews
  }
)

export const selectActiveHeatmapVesselDatasets = createSelector(
  [selectActiveActivityAndDetectionsDataviews, selectAllDatasets],
  (heatmapDataviews = [], datasets = []) => {
    const vesselDatasetIds = Array.from(
      new Set(
        heatmapDataviews.flatMap((dataview) => {
          const activeDatasets = getActiveDatasetsInDataview(dataview)
          return activeDatasets?.flatMap((dataset) => {
            return getRelatedDatasetByType(dataset, DatasetTypes.Vessels)?.id || []
          })
        })
      )
    )
    return datasets.filter((dataset) => vesselDatasetIds.includes(dataset.id))
  }
)

export const selectActiveHeatmapEnvironmentalDataviewsWithoutStatic = createSelector(
  [selectActiveHeatmapEnvironmentalDataviews],
  (dataviews) => {
    return dataviews.filter(
      (dv) => !isBathymetryDataview(dv) && dv.config?.type === DataviewType.HeatmapAnimated
    )
  }
)

export const selectActiveTemporalgridDataviews: (
  state: any
) => UrlDataviewInstance<DataviewType>[] = createDeepEqualSelector(
  [
    selectActiveActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveHeatmapEnvironmentalDataviews,
  ],
  (activityDataviews = [], detectionsDataviews = [], environmentalDataviews = []) => {
    return [...activityDataviews, ...detectionsDataviews, ...environmentalDataviews]
  }
)

export const selectHasReportLayersVisible = createSelector(
  [selectActiveHeatmapDowloadDataviews],
  (reportDataviews) => {
    const visibleDataviews = reportDataviews?.filter(({ config }) => config?.visible === true)
    return visibleDataviews && visibleDataviews.length > 0
  }
)

export const selectActiveDataviews = createSelector(
  [
    selectActiveActivityAndDetectionsDataviews,
    selectActiveVesselsDataviews,
    selectActiveEventsDataviews,
    selectActiveEnvironmentalDataviews,
    selectActiveContextAreasDataviews,
  ],
  (
    activeTemporalgridDataviews,
    activeVesselsDataviews,
    activeEventsDataviews,
    activeEnvironmentalDataviews,
    activeContextAreasDataviews
  ) => [
    ...(activeTemporalgridDataviews || []),
    ...(activeVesselsDataviews || []),
    ...(activeEventsDataviews || []),
    ...(activeEnvironmentalDataviews || []),
    ...(activeContextAreasDataviews || []),
  ]
)

export const selectAllDataviewsInWorkspace = createSelector(
  [selectAllDataviews, selectWorkspaceDataviewInstances, selectAllDatasets],
  (dataviews = [], workspaceDataviewInstances, datasets) => {
    const allWorkspaceDataviews = dataviews?.filter((dataview) => {
      if (DEFAULT_DATAVIEW_SLUGS.includes(dataview.slug)) {
        return true
      }
      if (workspaceDataviewInstances?.some((d) => d.dataviewId === dataview.slug)) {
        return true
      }
      return false
    })
    return allWorkspaceDataviews.map((dataview) => {
      const dataviewDatasets: Dataset[] = (dataview.datasetsConfig || [])?.flatMap(
        (datasetConfig) => {
          const dataset = datasets.find((dataset) => dataset.id === datasetConfig.datasetId)
          return dataset || []
        }
      )
      return { ...dataview, datasets: dataviewDatasets } as Dataview
    })
  }
)

export const selectPrivateDatasetsInWorkspace = createSelector(
  [selectDataviewInstancesMergedOrdered],
  (dataviews) => {
    const workspaceDatasets = getDatasetsInDataviews(dataviews || [])
    return workspaceDatasets.filter((dataset) => isPrivateDataset({ id: dataset }))
  }
)

export const selectHasVesselProfileInstancePinned = createSelector(
  [selectWorkspaceDataviewInstances, selectUrlDataviewInstances, selectVesselId],
  (workspaceDataviewInstances = [], urlDataviewInstances = [], vesselId) => {
    const dataviews = [...workspaceDataviewInstances, ...urlDataviewInstances]
    return dataviews?.some(({ config, id }) => {
      return id === `${VESSEL_DATAVIEW_INSTANCE_PREFIX}${vesselId}` && config?.visible
    })
  }
)
