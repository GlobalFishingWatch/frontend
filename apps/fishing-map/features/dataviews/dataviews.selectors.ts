import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory, Dataset, DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance, getGeneratorConfig } from '@globalfishingwatch/dataviews-client'
import {
  GeneratorType,
  BasemapGeneratorConfig,
  BasemapType,
} from '@globalfishingwatch/layer-composer'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, DEFAULT_DATAVIEW_SLUGS } from 'data/workspaces'
import { RootState } from 'store'
import {
  selectActiveVesselsDataviews,
  selectAllDataviewInstancesResolved,
  selectDataviewInstancesResolved,
  selectAllDataviews,
} from 'features/dataviews/dataviews.slice'
import { TimebarVisualisations } from 'types'
import { selectTimebarSelectedEnvId } from 'features/app/app.selectors'

const defaultBasemapDataview = {
  id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  config: {
    type: GeneratorType.Basemap,
    basemap: BasemapType.Default,
  },
}

export const selectBasemapDataview = createSelector(
  [(state: RootState) => selectAllDataviews(state)],
  (dataviews) => {
    const basemapDataview = dataviews.find((d) => d.config.type === GeneratorType.Basemap)
    return basemapDataview || defaultBasemapDataview
  }
)

export const selectDefaultBasemapGenerator = createSelector(
  [selectBasemapDataview],
  (basemapDataview) => {
    const basemapGenerator = getGeneratorConfig(
      basemapDataview as UrlDataviewInstance<GeneratorType>
    ) as BasemapGeneratorConfig
    return basemapGenerator
  }
)

export const selectDataviewInstancesResolvedVisible = createSelector(
  [selectDataviewInstancesResolved],
  (dataviews = []) => {
    return dataviews.filter((dataview) => dataview.config?.visible)
  }
)

export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
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
    return basemapLabelsDataview || defaultBasemapDataview
  }
)

export const selectContextAreasDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Context)],
  (contextDataviews) => {
    return contextDataviews
  }
)

export const selectActiveContextAreasDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Context)],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActivityDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Activity)],
  (dataviews) => dataviews
)

export const selectDetectionsDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Detections)],
  (dataviews) => dataviews
)

export const selectActiveActivityDataviews = createSelector(
  [selectActivityDataviews],
  (dataviews): UrlDataviewInstance[] => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveDetectionsDataviews = createSelector(
  [selectDetectionsDataviews],
  (dataviews): UrlDataviewInstance[] => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveHeatmapDataviews = createSelector(
  [selectActiveActivityDataviews, selectActiveDetectionsDataviews],
  (activityDataviews = [], detectionsDataviews = []) => [
    ...activityDataviews,
    ...detectionsDataviews,
  ]
)

export const selectActiveHeatmapVesselDatasets = createSelector(
  [selectActiveHeatmapDataviews, (state: RootState) => selectAllDatasets(state)],
  (heatmapDataviews = [], datasets = []) => {
    const vesselDatasetIds = Array.from(
      new Set(
        heatmapDataviews.flatMap((dataview) => {
          const activeDatasets = dataview.config?.datasets
          return dataview.datasets.flatMap((dataset) => {
            if (activeDatasets.includes(dataset.id)) {
              return getRelatedDatasetByType(dataset, DatasetTypes.Vessels)?.id || []
            }
            return []
          })
        })
      )
    )
    return datasets.filter((dataset) => vesselDatasetIds.includes(dataset.id))
  }
)

export const selectEnvironmentalDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Environment)],
  (dataviews) => dataviews
)

export const selectActiveEnvironmentalDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Environment)],
  (dataviews): UrlDataviewInstance[] => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveNonTrackEnvironmentalDataviews = createSelector(
  [selectActiveEnvironmentalDataviews],
  (dataviews) => {
    return dataviews.filter((dv) => dv.datasets.every((ds) => ds.type !== DatasetTypes.UserTracks))
  }
)

export const selectActiveTemporalgridDataviews = createSelector(
  [
    selectActiveActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveEnvironmentalDataviews,
  ],
  (activityDataviews = [], detectionsDataviews = [], environmentalDataviews = []) => {
    return [...activityDataviews, ...detectionsDataviews, ...environmentalDataviews]
  }
)

export const selectEventsDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Events)],
  (dataviews) => dataviews
)
export const selectActiveEventsDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Events)],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveActivityDataviewsByVisualisation = (
  timebarVisualisation: TimebarVisualisations
) =>
  createSelector(
    [
      selectActiveActivityDataviews,
      selectActiveDetectionsDataviews,
      selectActiveNonTrackEnvironmentalDataviews,
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

export const selectHasAnalysisLayersVisible = createSelector(
  [selectActivityDataviews, selectDetectionsDataviews, selectEnvironmentalDataviews],
  (activityDataviews = [], detectionsDataviews = [], environmentalDataviews = []) => {
    const heatmapEnvironmentalDataviews = environmentalDataviews?.filter(
      ({ config }) => config?.type === GeneratorType.HeatmapAnimated
    )
    const visibleDataviews = [
      ...activityDataviews,
      ...detectionsDataviews,
      ...heatmapEnvironmentalDataviews,
    ]?.filter(({ config }) => config?.visible === true)
    return visibleDataviews && visibleDataviews.length > 0
  }
)

export const selectActiveDataviews = createSelector(
  [
    selectActiveActivityDataviews,
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
  [
    (state: RootState) => selectAllDataviews(state),
    selectWorkspaceDataviewInstances,
    (state: RootState) => selectAllDatasets(state),
  ],
  (dataviews = [], workspaceDataviewInstances, datasets) => {
    const allWorkspaceDataviews = dataviews?.filter((dataview) => {
      if (DEFAULT_DATAVIEW_SLUGS.includes(dataview.slug)) {
        return true
      }
      if (workspaceDataviewInstances?.some((d) => d.dataviewId === dataview.id)) {
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
      return { ...dataview, datasets: dataviewDatasets }
    })
  }
)

export const selectAvailableActivityDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter(
      (d) => d.category === DataviewCategory.Activity && d.datasetsConfig?.length > 0
    )
  }
)

export const selectAvailableDetectionsDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter(
      (d) => d.category === DataviewCategory.Detections && d.datasetsConfig?.length > 0
    )
  }
)
