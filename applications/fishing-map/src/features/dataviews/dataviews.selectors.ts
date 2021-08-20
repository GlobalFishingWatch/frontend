import { createSelector } from '@reduxjs/toolkit'
import { DataviewInstance, DataviewCategory, DatasetTypes } from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  mergeWorkspaceUrlDataviewInstances,
  getGeneratorConfig,
  getDataviewsForResourceQuerying,
  resolveResourcesFromDatasetConfigs,
  DatasetConfigsTransforms,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { PRESENCE_POC_ID, selectDatasets } from 'features/datasets/datasets.slice'
import {
  selectWorkspaceStatus,
  selectWorkspaceDataviewInstances,
  selectWorkspaceDataviews,
} from 'features/workspace/workspace.selectors'
import { isActivityDataview } from 'features/workspace/activity/activity.utils'
import { selectActivityCategoryFn } from 'features/app/app.selectors'
import { DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, DEFAULT_DATAVIEW_IDS } from 'data/workspaces'
import { selectThinningConfig } from 'features/resources/resources.selectors'
import { selectAllDataviews } from './dataviews.slice'

const defaultBasemapDataview = {
  id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  config: {
    type: Generators.Type.Basemap,
    basemap: Generators.BasemapType.Default,
    labels: false,
  },
}

export const selectBasemapDataview = createSelector([selectAllDataviews], (dataviews) => {
  const basemapDataview = dataviews.find((d) => d.config.type === GeneratorType.Basemap)
  return basemapDataview || defaultBasemapDataview
})

export const selectDefaultBasemapGenerator = createSelector(
  [selectBasemapDataview],
  (basemapDataview) => {
    const basemapGenerator = getGeneratorConfig(
      basemapDataview as UrlDataviewInstance<Type>
    ) as Generators.BasemapGeneratorConfig
    return basemapGenerator
  }
)

export const selectDataviewInstancesMerged = createSelector(
  [selectWorkspaceStatus, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (
    workspaceStatus,
    workspaceDataviewInstances,
    urlDataviewInstances = []
  ): UrlDataviewInstance[] | undefined => {
    if (workspaceStatus !== AsyncReducerStatus.Finished) {
      return
    }
    const mergedDataviewInstances = mergeWorkspaceUrlDataviewInstances(
      workspaceDataviewInstances as DataviewInstance<any>[],
      urlDataviewInstances
    )
    return mergedDataviewInstances
  }
)

export const selectAllDataviewInstancesResolved = createSelector(
  [selectDataviewInstancesMerged, selectAllDataviews, selectDatasets],
  (dataviewInstances, dataviews, datasets): UrlDataviewInstance[] | undefined => {
    if (!dataviewInstances) return
    const dataviewInstancesResolved = resolveDataviews(dataviewInstances, dataviews, datasets)
    return dataviewInstancesResolved
  }
)

/**
 * Calls getDataviewsForResourceQuerying to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getDataviewsForResourceQuerying's callback
 */
export const selectDataviewsForResourceQuerying = createSelector(
  [selectAllDataviewInstancesResolved, selectThinningConfig],
  (dataviewInstances, thinningConfig) => {
    const datasetConfigsTransforms: DatasetConfigsTransforms = {
      [Generators.Type.Track]: ([info, track, ...events]) => {
        const trackWithThinning = track
        if (thinningConfig && !track.datasetId.includes(PRESENCE_POC_ID)) {
          const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
            id,
            value,
          }))
          trackWithThinning.query = [...(track.query || []), ...thinningQuery]
        }
        // Clean resources when mandatory vesselId is missing
        // needed for vessels with no info datasets (zebraX)
        const vesselID = info.query?.find((q) => q.id === 'vesselId')?.value
        if (!vesselID) {
          return [trackWithThinning, ...events]
        }
        return [trackWithThinning, info, ...events]
      },
    }
    return getDataviewsForResourceQuerying(dataviewInstances || [], datasetConfigsTransforms)
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [selectDataviewsForResourceQuerying, selectActivityCategoryFn],
  (dataviews = [], activityCategory) => {
    return dataviews.filter((dataview) => {
      const activityDataview = isActivityDataview(dataview)
      return activityDataview ? dataview.category === activityCategory : true
    })
  }
)

export const selectDataviewsResourceQueries = createSelector(
  [selectDataviewInstancesResolved],
  (dataviews) => {
    return resolveResourcesFromDatasetConfigs(dataviews)
  }
)

export const selectDataviewInstancesResolvedVisible = createSelector(
  [selectDataviewInstancesResolved, selectActivityCategoryFn],
  (dataviews = []) => {
    return dataviews.filter((dataview) => dataview.config?.visible)
  }
)

export const selectDataviewInstancesByType = (type: Generators.Type) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

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

export const selectTrackDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.Track)],
  (dataviews) => dataviews
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) =>
      !dataview.datasets ||
      (dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks &&
        dataview.category === DataviewCategory.Vessels)
  )
})

export const selectActiveVesselsDataviews = createSelector([selectVesselsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTrackDataviews = createSelector([selectTrackDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
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
  [selectFishingDataviews, selectPresenceDataviews, selectActivityCategoryFn],
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
  [selectAllDataviews, selectWorkspaceDataviews, selectWorkspaceDataviewInstances],
  (dataviews = [], workspaceDataviews, workspaceDataviewInstances) => {
    return dataviews?.filter((dataview) => {
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
  }
)

export const selectAvailableFishingDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter((d) => d.category === DataviewCategory.Fishing)
  }
)

export const selectAvailablePresenceDataviews = createSelector(
  [selectAllDataviewsInWorkspace],
  (dataviews) => {
    return dataviews?.filter((d) => d.category === DataviewCategory.Presence)
  }
)
