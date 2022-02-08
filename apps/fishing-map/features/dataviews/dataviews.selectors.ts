import { createSelector } from '@reduxjs/toolkit'
import { DataviewCategory, Dataset } from '@globalfishingwatch/api-types'
import {
  UrlDataviewInstance,
  getGeneratorConfig,
  resolveResourcesFromDatasetConfigs,
} from '@globalfishingwatch/dataviews-client'
import {
  GeneratorType,
  BasemapGeneratorConfig,
  BasemapType,
} from '@globalfishingwatch/layer-composer'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import {
  selectWorkspaceStateProperty,
  selectWorkspaceDataviewInstances,
  selectWorkspaceDataviews,
} from 'features/workspace/workspace.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, DEFAULT_DATAVIEW_IDS } from 'data/workspaces'
import { RootState } from 'store'
import {
  selectActiveVesselsDataviews,
  selectDataviewInstancesResolved,
  selectDataviewsForResourceQuerying,
} from 'features/dataviews/dataviews.slice'
import { selectAllDataviews } from './dataviews.slice'

const defaultBasemapDataview = {
  id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  config: {
    type: GeneratorType.Basemap,
    basemap: BasemapType.Default,
    labels: false,
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

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved],
  (dataviews) => {
    return resolveResourcesFromDatasetConfigs(dataviews)
  }
)

export const selectDataviewInstancesResolvedVisible = createSelector(
  [selectDataviewInstancesResolved, selectWorkspaceStateProperty('activityCategory')],
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

export const selectBasemapDataviewInstance = createSelector(
  [selectDataviewsForResourceQuerying],
  (dataviews) => {
    const basemapDataview = dataviews?.find((d) => d.config?.type === GeneratorType.Basemap)
    return basemapDataview || defaultBasemapDataview
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

export const selectFishingDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Fishing)],
  (dataviews) => dataviews
)

export const selectPresenceDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Presence)],
  (dataviews) => dataviews
)

export const selectActivityDataviews = createSelector(
  [
    selectFishingDataviews,
    selectPresenceDataviews,
    selectWorkspaceStateProperty('activityCategory'),
  ],
  (fishingDataviews = [], presenceDataviews = [], activityCategory) => {
    return activityCategory === 'presence' ? presenceDataviews : fishingDataviews
  }
)

export const selectActiveActivityDataviews = createSelector(
  [selectActivityDataviews],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectEnvironmentalDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Environment)],
  (dataviews) => dataviews
)

export const selectActiveEnvironmentalDataviews = createSelector(
  [selectDataviewInstancesByCategory(DataviewCategory.Environment)],
  (dataviews) => dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTemporalgridDataviews = createSelector(
  [selectActiveActivityDataviews, selectActiveEnvironmentalDataviews],
  (activityDataviews = [], environmentalDataviews = []) => {
    return [...activityDataviews, ...environmentalDataviews]
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

export const selectHasAnalysisLayersVisible = createSelector(
  [selectActivityDataviews, selectEnvironmentalDataviews],
  (activityDataviews = [], environmentalDataviews = []) => {
    const heatmapEnvironmentalDataviews = environmentalDataviews?.filter(
      ({ config }) => config?.type === GeneratorType.HeatmapAnimated
    )
    const visibleDataviews = [...activityDataviews, ...heatmapEnvironmentalDataviews]?.filter(
      ({ config }) => config?.visible === true
    )
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
    selectWorkspaceDataviews,
    selectWorkspaceDataviewInstances,
    (state: RootState) => selectAllDatasets(state),
  ],
  (dataviews = [], workspaceDataviews, workspaceDataviewInstances, datasets) => {
    const allWorkspaceDataviews = dataviews?.filter((dataview) => {
      if (DEFAULT_DATAVIEW_IDS.includes(dataview.id)) {
        return true
      }
      if (workspaceDataviews?.some((d) => d.id === dataview.id)) {
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

export const selectAvailableFishingDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter(
      (d) => d.category === DataviewCategory.Fishing && d.datasetsConfig?.length > 0
    )
  }
)

export const selectAvailablePresenceDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter(
      (d) => d.category === DataviewCategory.Presence && d.datasetsConfig?.length > 0
    )
  }
)
