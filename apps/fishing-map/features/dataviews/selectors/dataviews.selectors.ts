import { createSelector } from '@reduxjs/toolkit'
import { uniq } from 'lodash'
import { DataviewCategory, Dataset, DatasetTypes, Dataview } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance, getGeneratorConfig } from '@globalfishingwatch/dataviews-client'
import { GeneratorType, BasemapGeneratorConfig } from '@globalfishingwatch/layer-composer'
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
} from 'routes/routes.selectors'
import { getReportCategoryFromDataview } from 'features/reports/reports.utils'
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

const VESSEL_ONLY_VISIBLE_LAYERS = [
  GeneratorType.Basemap,
  GeneratorType.Context,
  GeneratorType.UserContext,
  GeneratorType.UserPoints,
]

export const selectBasemapDataview = createSelector([selectAllDataviews], (dataviews) => {
  const basemapDataview = dataviews.find((d) => d.config?.type === GeneratorType.Basemap)
  return basemapDataview || DEFAULT_BASEMAP_DATAVIEW_INSTANCE
})

export const selectDefaultBasemapGenerator = createSelector(
  [selectBasemapDataview],
  (basemapDataview) => {
    const basemapGenerator = getGeneratorConfig(
      basemapDataview as UrlDataviewInstance<GeneratorType>
    ) as BasemapGeneratorConfig
    return basemapGenerator
  }
)

export const selectActiveDataviewsCategories = createSelector(
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

export const selectReportCategorySelector = selectWorkspaceStateProperty('reportCategory')
export const selectReportCategory = createSelector(
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
  ],
  (
    dataviews = [],
    isReportLocation,
    reportCategory,
    isVesselLocation,
    viewOnlyVessel,
    vesselId
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
        if (VESSEL_ONLY_VISIBLE_LAYERS.includes(config?.type as GeneratorType)) {
          return config?.visible
        }
        return config?.type === GeneratorType.Track && id.includes(vesselId)
      })
    }
    return dataviews.filter((dataview) => dataview.config?.visible)
  }
)

export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector(
    [selectDataviewInstancesResolved],
    (dataviews): UrlDataviewInstance<GeneratorType>[] => {
      return dataviews?.filter((dataview) => dataview.category === category)
    }
  )
}

export const selectDataviewInstancesByIds = (ids: string[]) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => ids.includes(dataview.id))
  })
}

export const selectBasemapLabelsDataviewInstance = createSelector(
  [selectAllDataviewInstancesResolved],
  (dataviews) => {
    const basemapLabelsDataview = dataviews?.find(
      (d) => d.config?.type === GeneratorType.BasemapLabels
    )
    return basemapLabelsDataview || DEFAULT_BASEMAP_DATAVIEW_INSTANCE
  }
)

export const selectContextAreasDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Context
)

export const selectCustomUserDataviews = selectDataviewInstancesByCategory(DataviewCategory.User)

export const selectActiveContextAreasDataviews = createSelector(
  [selectContextAreasDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActivityDataviews = selectDataviewInstancesByCategory(DataviewCategory.Activity)
export const selectDetectionsDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Detections
)

export const selectActiveActivityDataviews = createSelector(
  [selectActivityDataviews],
  (dataviews): UrlDataviewInstance[] => {
    return dataviews?.filter((d) => d.config?.visible)
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

export const selectActiveActivityAndDetectionsDataviews = createSelector(
  [selectActiveReportActivityDataviews, selectActiveDetectionsDataviews],
  (activityDataviews = [], detectionsDataviews = []) => [
    ...activityDataviews,
    ...detectionsDataviews,
  ]
)

export const selectEnvironmentalDataviews = selectDataviewInstancesByCategory(
  DataviewCategory.Environment
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
    return dataviews.filter((dv) => dv.config?.type === GeneratorType.HeatmapAnimated)
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
      (dv) => !isBathymetryDataview(dv) && dv.config?.type !== GeneratorType.HeatmapStatic
    )
  }
)

export const selectActiveTemporalgridDataviews: (
  state: any
) => UrlDataviewInstance<GeneratorType>[] = createDeepEqualSelector(
  [
    selectActiveActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveHeatmapEnvironmentalDataviews,
  ],
  (activityDataviews = [], detectionsDataviews = [], environmentalDataviews = []) => {
    return [...activityDataviews, ...detectionsDataviews, ...environmentalDataviews]
  }
)

export const selectEventsDataviews = selectDataviewInstancesByCategory(DataviewCategory.Events)

export const selectActiveEventsDataviews = createSelector([selectEventsDataviews], (dataviews) =>
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

export const selectAvailableActivityDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter(
      (d) => d.category === DataviewCategory.Activity && d.datasetsConfig!?.length > 0
    )
  }
)

export const selectAvailableDetectionsDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter(
      (d) => d.category === DataviewCategory.Detections && d.datasetsConfig!?.length > 0
    )
  }
)

export const selectPrivateDatasetsInWorkspace = createSelector(
  [selectDataviewInstancesMergedOrdered],
  (dataviews) => {
    const workspaceDatasets = getDatasetsInDataviews(dataviews || [])
    return workspaceDatasets.filter((dataset) => isPrivateDataset({ id: dataset }))
  }
)
