import { createSelector } from '@reduxjs/toolkit'
import { uniq } from 'es-toolkit'
import {
  DataviewCategory,
  Dataset,
  DatasetTypes,
  Dataview,
  DataviewType,
} from '@globalfishingwatch/api-types'
import { UrlDataviewInstance, getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  getActiveDatasetsInDataview,
  getDatasetsInDataviews,
  getRelatedDatasetByType,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceStateProperty,
} from 'features/workspace/workspace.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, DEFAULT_DATAVIEW_SLUGS } from 'data/workspaces'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { ReportCategory, TimebarVisualisations } from 'types'
import { createDeepEqualSelector } from 'utils/selectors'
import {
  selectIsAnyVesselLocation,
  selectVesselId,
  selectIsAnyReportLocation,
  selectIsVesselGroupReportLocation,
  selectReportVesselGroupId,
} from 'routes/routes.selectors'
import { getReportCategoryFromDataview } from 'features/area-report/reports.utils'
import { selectViewOnlyVessel } from 'features/vessel/vessel.config.selectors'
import { selectTimebarSelectedEnvId } from 'features/app/selectors/app.timebar.selectors'
import {
  selectActiveVesselsDataviews,
  selectAllDataviewInstancesResolved,
  selectDataviewInstancesMergedOrdered,
  selectDataviewInstancesResolved,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { isBathymetryDataview } from 'features/dataviews/dataviews.utils'
import { selectDownloadActiveTabId } from 'features/download/downloadActivity.slice'
import { HeatmapDownloadTab } from 'features/download/downloadActivity.config'
import { selectViewOnlyVesselGroup } from 'features/vessel-group-report/vessel-group.config.selectors'
import {
  selectContextAreasDataviews,
  selectActivityDataviews,
  selectDetectionsDataviews,
  selectEnvironmentalDataviews,
  selectEventsDataviews,
} from './dataviews.categories.selectors'

const REPORT_ONLY_VISIBLE_LAYERS = [
  DataviewType.Basemap,
  DataviewType.Context,
  DataviewType.UserContext,
  DataviewType.UserPoints,
]

const selectActiveDataviewsCategories = createSelector(
  [selectDataviewInstancesResolved],
  (dataviews): ReportCategory[] => {
    return uniq(
      dataviews.flatMap((d) => (d.config?.visible ? getReportCategoryFromDataview(d) : []))
    )
  }
)

export const selectReportActiveCategories = createSelector(
  [selectActiveDataviewsCategories],
  (activeCategories): ReportCategory[] => {
    const orderedCategories = [
      ReportCategory.Fishing,
      ReportCategory.Presence,
      ReportCategory.Detections,
      ReportCategory.Environment,
    ]
    return orderedCategories.flatMap((category) =>
      activeCategories.some((a) => a === category) ? category : []
    )
  }
)

const selectReportCategorySelector = selectWorkspaceStateProperty('reportCategory')
const selectReportCategory = createSelector(
  [selectReportCategorySelector, selectReportActiveCategories],
  (reportCategory, activeCategories): ReportCategory => {
    return activeCategories.some((category) => category === reportCategory)
      ? reportCategory
      : activeCategories[0]
  }
)

export const selectDataviewInstancesResolvedVisible = createSelector(
  [
    selectDataviewInstancesResolved,
    selectIsAnyReportLocation,
    selectReportCategory,
    selectIsAnyVesselLocation,
    selectViewOnlyVessel,
    selectVesselId,
    selectIsVesselGroupReportLocation,
    selectReportVesselGroupId,
    selectViewOnlyVesselGroup,
  ],
  (
    dataviews = [],
    isReportLocation,
    reportCategory,
    isVesselLocation,
    viewOnlyVessel,
    vesselId,
    isVesselGroupReportLocation,
    reportVesselGroupId,
    viewOnlyVesselGroup
  ) => {
    if (isReportLocation) {
      return dataviews.filter((dataview) => {
        if (
          dataview.category === DataviewCategory.Activity ||
          dataview.category === DataviewCategory.Detections
        ) {
          return (
            dataview.config?.visible && getReportCategoryFromDataview(dataview) === reportCategory
          )
        }
        return dataview.config?.visible
      })
    }
    if (isVesselLocation && viewOnlyVessel && vesselId !== undefined) {
      return dataviews.filter(({ id, config }) => {
        if (REPORT_ONLY_VISIBLE_LAYERS.includes(config?.type as DataviewType)) {
          return config?.visible
        }
        return config?.type === DataviewType.Track && id.includes(vesselId)
      })
    }

    if (isVesselGroupReportLocation && viewOnlyVesselGroup && reportVesselGroupId !== undefined) {
      return getReportVesselGroupVisibleDataviews(dataviews, reportVesselGroupId)
    }

    return dataviews.filter((dataview) => dataview.config?.visible)
  }
)

function getReportVesselGroupVisibleDataviews(
  dataviews: UrlDataviewInstance[],
  reportVesselGroupId: string
) {
  return dataviews.filter(({ category, config }) => {
    if (REPORT_ONLY_VISIBLE_LAYERS.includes(config?.type as DataviewType)) {
      return config?.visible
    }
    return (
      category === DataviewCategory.VesselGroups &&
      config?.filters?.['vessel-groups'].includes(reportVesselGroupId)
    )
  })
}

export const selectHasOtherVesselGroupDataviews = createSelector(
  [selectDataviewInstancesResolved, selectReportVesselGroupId],
  (dataviews, reportVesselGroupId) => {
    if (!dataviews?.length) return false
    const vesselGroupReportDataviews = getReportVesselGroupVisibleDataviews(
      dataviews,
      reportVesselGroupId
    )
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

const selectActiveContextAreasDataviews = createSelector(
  [selectContextAreasDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveActivityDataviews = createSelector(
  [selectActivityDataviews],
  (dataviews): UrlDataviewInstance[] => {
    return dataviews?.filter((d) => d.config?.visible)
  }
)

export const selectActivityMergedDataviewId = createSelector(
  [selectActiveActivityDataviews],
  (dataviews): string => {
    return dataviews?.length ? getMergedDataviewId(dataviews) : ''
  }
)

export const selectActiveReportActivityDataviews = createSelector(
  [selectActiveActivityDataviews, selectIsAnyReportLocation, selectReportCategory],
  (dataviews, isReportLocation, reportCategory): UrlDataviewInstance[] => {
    if (isReportLocation) {
      return dataviews.filter((dataview) => {
        return getReportCategoryFromDataview(dataview) === reportCategory
      })
    }
    return dataviews
  }
)

export const selectActiveDetectionsDataviews = createSelector(
  [selectDetectionsDataviews],
  (dataviews): UrlDataviewInstance[] => dataviews?.filter((d) => d.config?.visible)
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

export const selectActiveEnvironmentalDataviews = createSelector(
  [selectEnvironmentalDataviews],
  (dataviews): UrlDataviewInstance[] => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveHeatmapEnvironmentalDataviews = createSelector(
  [selectActiveEnvironmentalDataviews],
  (dataviews) => {
    return dataviews.filter((dv) => dv.datasets?.every((ds) => ds.type === DatasetTypes.Fourwings))
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

const selectActiveEventsDataviews = createSelector([selectEventsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveActivityDataviewsByVisualisation = (
  timebarVisualisation: TimebarVisualisations
) =>
  createSelector(
    [
      selectActiveReportActivityDataviews,
      selectActiveDetectionsDataviews,
      selectActiveHeatmapEnvironmentalDataviewsWithoutStatic,
      selectTimebarSelectedEnvId,
    ],
    (activityDataviews, detectionsDataviews, environmentDataviews, timebarSelectedEnvId) => {
      if (timebarVisualisation === TimebarVisualisations.HeatmapActivity) {
        return activityDataviews
      }
      if (timebarVisualisation === TimebarVisualisations.HeatmapDetections) {
        return detectionsDataviews
      }
      const selectedEnvDataview =
        timebarSelectedEnvId && environmentDataviews.find((d) => d.id === timebarSelectedEnvId)

      if (selectedEnvDataview) return [selectedEnvDataview]
      else if (environmentDataviews[0]) return [environmentDataviews[0]]
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
