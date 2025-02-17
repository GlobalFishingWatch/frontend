import { createSelector } from '@reduxjs/toolkit'

import type { Dataset, Dataview, DataviewInstance } from '@globalfishingwatch/api-types'
import { DatasetTypes, DataviewType } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'

import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, DEFAULT_DATAVIEW_SLUGS } from 'data/workspaces'
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
  selectActiveVesselsDataviews,
  selectVGReportActivityDataviews,
  selectVGRFootprintDataview,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import {
  selectAllDataviewInstancesResolved,
  selectDataviewInstancesMergedOrdered,
  selectDataviewInstancesResolved,
} from 'features/dataviews/selectors/dataviews.resolvers.selectors'
import { HeatmapDownloadTab } from 'features/download/downloadActivity.config'
import { selectDownloadActiveTabId } from 'features/download/downloadActivity.slice'
import { getReportVesselGroupVisibleDataviews } from 'features/reports/report-vessel-group/vessel-group-report.dataviews'
import { selectReportVesselsSubCategory } from 'features/reports/reports.config.selectors'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import {
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
    selectReportCategory,
    selectReportVesselsSubCategory,
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
  [selectActiveActivityDataviews, selectVGReportActivityDataviews],
  (dataviews, vGRActivityDataviews): string => {
    if (vGRActivityDataviews?.length) {
      return vGRActivityDataviews[0]?.id
    }
    return dataviews?.length ? getMergedDataviewId(dataviews) : ''
  }
)

export const selectDetectionsMergedDataviewId = createSelector(
  [selectActiveDetectionsDataviews],
  (dataviews): string => {
    return dataviews?.length ? getMergedDataviewId(dataviews) : ''
  }
)

export const selectActiveActivityAndDetectionsDataviews = createSelector(
  [selectActiveActivityDataviews, selectActiveDetectionsDataviews],
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

const EMPTY_ARRAY = [] as DataviewInstance[]
export const selectActiveReportDataviews = createDeepEqualSelector(
  [
    selectReportCategory,
    selectActiveActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveHeatmapEnvironmentalDataviews,
    selectVGRFootprintDataview,
    selectActiveEventsDataviews,
    selectVGReportActivityDataviews,
    selectIsVesselGroupReportLocation,
  ],
  (
    reportCategory,
    activityDataviews = EMPTY_ARRAY,
    detectionsDataviews = EMPTY_ARRAY,
    environmentalDataviews = EMPTY_ARRAY,
    vGRFootprintDataview,
    eventsDataviews = EMPTY_ARRAY,
    vesselGroupDataviews = EMPTY_ARRAY,
    isVesselGroupReportLocation
  ) => {
    if (reportCategory === ReportCategory.Activity) {
      return isVesselGroupReportLocation ? vesselGroupDataviews : activityDataviews
    }
    if (reportCategory === ReportCategory.Detections) {
      return detectionsDataviews
    }
    if (reportCategory === ReportCategory.Events) {
      return eventsDataviews
    }
    if (reportCategory === ReportCategory.VesselGroup) {
      return vGRFootprintDataview ? [vGRFootprintDataview] : EMPTY_ARRAY
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
