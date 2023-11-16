import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { DataviewCategory, Dataset, DatasetTypes, Dataview } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance, getGeneratorConfig } from '@globalfishingwatch/dataviews-client'
import { GeneratorType, BasemapGeneratorConfig } from '@globalfishingwatch/layer-composer'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  getDatasetsInDataviews,
  getRelatedDatasetByType,
  isPrivateDataset,
} from 'features/datasets/datasets.utils'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE, DEFAULT_DATAVIEW_SLUGS } from 'data/workspaces'
import {
  selectActiveVesselsDataviews,
  selectAllDataviewInstancesResolved,
  selectDataviewInstancesResolved,
  selectAllDataviews,
  selectDataviewInstancesMergedOrdered,
} from 'features/dataviews/dataviews.slice'
import { TimebarVisualisations } from 'types'
import { selectReportCategory, selectTimebarSelectedEnvId } from 'features/app/app.selectors'
import { createDeepEqualSelector } from 'utils/selectors'
import {
  selectIsAnyVesselLocation,
  selectVesselId,
  selectIsAnyReportLocation,
} from 'routes/routes.selectors'
import { getReportCategoryFromDataview } from 'features/reports/reports.utils'
import { selectViewOnlyVessel } from 'features/vessel/vessel.config.selectors'

const VESSEL_ONLY_VISIBLE_LAYERS = [
  GeneratorType.Basemap,
  GeneratorType.Context,
  GeneratorType.UserContext,
  GeneratorType.UserPoints,
]

export const selectBasemapDataview = createSelector(
  [(state: RootState) => selectAllDataviews(state)],
  (dataviews) => {
    const basemapDataview = dataviews.find((d) => d.config?.type === GeneratorType.Basemap)
    return basemapDataview || DEFAULT_BASEMAP_DATAVIEW_INSTANCE
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
  [
    (state) => selectDataviewInstancesResolved(state),
    (state) => selectIsAnyReportLocation(state),
    (state) => selectReportCategory(state),
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
  return createSelector([(state) => selectDataviewInstancesResolved(state)], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
}

export const selectDataviewInstancesByIds = (ids: string[]) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => ids.includes(dataview.id))
  })
}

export const selectBasemapLabelsDataviewInstance = createSelector(
  [(state) => selectAllDataviewInstancesResolved(state)],
  (dataviews) => {
    const basemapLabelsDataview = dataviews?.find(
      (d) => d.config?.type === GeneratorType.BasemapLabels
    )
    return basemapLabelsDataview || DEFAULT_BASEMAP_DATAVIEW_INSTANCE
  }
)

export const selectContextAreasDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Context)],
  (contextDataviews) => {
    return contextDataviews
  }
)

export const selectCustomUserDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.User)],
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
  (dataviews): UrlDataviewInstance[] => {
    return dataviews?.filter((d) => d.config?.visible)
  }
)

export const selectActiveReportActivityDataviews = createSelector(
  [
    selectActiveActivityDataviews,
    (state) => selectIsAnyReportLocation(state),
    (state) => selectReportCategory(state),
  ],
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

export const selectActiveHeatmapDataviews = createSelector(
  [selectActiveReportActivityDataviews, selectActiveDetectionsDataviews],
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
          return dataview.datasets?.flatMap((dataset) => {
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
    return dataviews.filter((dv) => dv.datasets?.every((ds) => ds.type !== DatasetTypes.UserTracks))
  }
)

export const selectActiveTemporalgridDataviews: (
  state: any
) => UrlDataviewInstance<GeneratorType>[] = createDeepEqualSelector(
  [
    selectActiveActivityDataviews,
    selectActiveDetectionsDataviews,
    selectActiveEnvironmentalDataviews,
  ],
  (activityDataviews = [], detectionsDataviews = [], environmentalDataviews = []) => {
    return [...activityDataviews, ...detectionsDataviews, ...environmentalDataviews]
  }
)

export const selectEventsDataviews: (state: any) => UrlDataviewInstance<GeneratorType>[] =
  createSelector(
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
      selectActiveReportActivityDataviews,
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

export const selectHasReportLayersVisible = createSelector(
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
    selectActiveHeatmapDataviews,
    (state) => selectActiveVesselsDataviews(state),
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
    (state: RootState) => selectWorkspaceDataviewInstances(state),
    (state: RootState) => selectAllDatasets(state),
  ],
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
  [(state) => selectDataviewInstancesMergedOrdered(state)],
  (dataviews) => {
    const workspaceDatasets = getDatasetsInDataviews(dataviews || [])
    return workspaceDatasets.filter((dataset) => isPrivateDataset({ id: dataset }))
  }
)
