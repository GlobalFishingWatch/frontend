import { createSelector } from '@reduxjs/toolkit'
import { DatasetTypes, DataviewCategory, DataviewInstance } from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  getGeneratorConfig,
  mergeWorkspaceUrlDataviewInstances,
  DatasetConfigsTransforms,
  getDataviewsForResourceQuerying,
  resolveResourcesFromDatasetConfigs,
  GetDatasetConfigsCallbacks,
  getResources,
} from '@globalfishingwatch/dataviews-client'
import {
  BasemapGeneratorConfig,
  BasemapType,
  GeneratorType,
} from '@globalfishingwatch/layer-composer'
import { THINNING_LEVELS } from '@globalfishingwatch/api-client'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasets, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { selectVesselDataview } from 'features/vessels/vessels.slice'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceProfileView,
  selectWorkspaceStateProperty,
} from 'features/workspace/workspace.selectors'
import { createDeepEqualSelector } from 'utils/selectors'
import { APP_PROFILE_VIEWS, DEFAULT_PAGINATION_PARAMS } from 'data/config'
import {
  selectTrackChunksConfig,
  selectTrackThinningConfig,
} from 'features/resources/resources.slice'
import { trackDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectAllDataviews, selectDataviewsStatus } from './dataviews.slice'
import {
  BACKGROUND_LAYER,
  OFFLINE_LAYERS,
  APP_THINNING,
  DEFAULT_VESSEL_DATAVIEWS,
} from './dataviews.config'
import { getVesselDataviewInstanceFactory } from './dataviews.utils'

const defaultBasemapDataview = {
  id: 'basemap',
  config: {
    type: GeneratorType.Basemap,
    basemap: BasemapType.Default,
  },
}

export const selectDefaultOfflineDataviewsGenerators = createSelector([], () => {
  return BACKGROUND_LAYER.concat(OFFLINE_LAYERS)
})

export const selectBasemapDataview = createSelector([selectAllDataviews], (dataviews) => {
  const basemapDataview = dataviews.find((d) => d.config.type === GeneratorType.Basemap)
  return basemapDataview || defaultBasemapDataview
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

export const selectDataviewInstancesMerged = createDeepEqualSelector(
  [selectVesselDataview, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (vesselDataview, dataviews, urlDataviewInstances) => {
    const dataviewsToMerge: DataviewInstance<any>[] = vesselDataview
      ? [...dataviews, vesselDataview]
      : dataviews
    return mergeWorkspaceUrlDataviewInstances(dataviewsToMerge, urlDataviewInstances)
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [
    selectDataviewsStatus,
    selectAllDataviews,
    selectDatasets,
    selectDatasetsStatus,
    selectDataviewInstancesMerged,
  ],
  (
    dataviewsStatus,
    dataviews,
    datasets,
    datasetsStatus,
    dataviewInstances
  ): UrlDataviewInstance[] => {
    if (
      dataviewsStatus !== AsyncReducerStatus.Finished ||
      datasetsStatus !== AsyncReducerStatus.Finished
    ) {
      return []
    }
    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstances as UrlDataviewInstance[],
      dataviews,
      datasets
    )
    return dataviewInstancesResolved
  }
)

/**
 * Calls getDataviewsForResourceQuerying to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getDataviewsForResourceQuerying's callback
 */
export const selectDataviewsForResourceQuerying = createDeepEqualSelector(
  [selectDataviewInstancesResolved],
  (dataviewInstances) => {
    const thinningConfig = THINNING_LEVELS[APP_THINNING]
    const datasetConfigsTransforms: DatasetConfigsTransforms = {
      [GeneratorType.Track]: ([info, track, ...events]) => {
        const trackWithThinning = track
        const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
          id,
          value,
        }))
        trackWithThinning.query = [...(track.query || []), ...thinningQuery]
        trackWithThinning.metadata = { ...(trackWithThinning.metadata || {}), zoom: 12 }
        return [trackWithThinning, info, ...events]
      },
    }
    return getDataviewsForResourceQuerying(dataviewInstances || [], datasetConfigsTransforms)
  }
)

export const selectDataviewsResourceQueries = createDeepEqualSelector(
  [selectDataviewsForResourceQuerying],
  (dataviews) => {
    return resolveResourcesFromDatasetConfigs(dataviews)
  }
)

export const selectTrackDatasetConfigsCallback = createSelector(
  [
    selectTrackThinningConfig,
    selectTrackChunksConfig,
    selectWorkspaceStateProperty('timebarGraph'),
  ],
  (thinningConfig, chunks, timebarGraph) =>
    trackDatasetConfigsCallback(thinningConfig, chunks, timebarGraph)
)

/**
 * Calls getResources to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getResources's callback
 */
export const selectDataviewsResources = createSelector(
  [selectDataviewInstancesResolved, selectTrackDatasetConfigsCallback],
  (dataviewInstances, trackDatasetConfigsCallback) => {
    const callbacks: GetDatasetConfigsCallbacks = {
      tracks: trackDatasetConfigsCallback,
    }
    return getResources(dataviewInstances || [], callbacks)
  }
)

export const selectDataviewInstancesByCategory = (category: DataviewCategory) => {
  return createSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.category === category)
  })
}

export const selectDataviewInstancesByIds = (ids: string[]) => {
  return createDeepEqualSelector([selectDataviewInstancesResolved], (dataviews) => {
    return dataviews?.filter((dataview) => ids.includes(dataview.id))
  })
}

export const selectDataviewInstancesByType = (type: GeneratorType) => {
  return createDeepEqualSelector([selectDataviewsForResourceQuerying], (dataviews) => {
    return dataviews?.filter((dataview) => dataview.config?.type === type)
  })
}

export const selectTrackDataviews = createDeepEqualSelector(
  [selectDataviewInstancesByType(GeneratorType.Track)],
  (dataviews) => dataviews
)

export const selectVesselsDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter(
    (dataview) => !dataview.datasets || dataview.datasets?.[0]?.type !== DatasetTypes.UserTracks
  )
})

export const selectActiveVesselsDataviews = createSelector([selectVesselsDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)

export const selectActiveTrackDataviews = createSelector([selectTrackDataviews], (dataviews) => {
  return dataviews?.filter((d) => d.config?.visible)
})

export const selectGetVesselDataviewInstance = createSelector(
  [selectWorkspaceProfileView],
  (profileView) => {
    return getVesselDataviewInstanceFactory(DEFAULT_VESSEL_DATAVIEWS[profileView])
  }
)

/**
 * Returns the event datasets query params based on the current profile view
 * and its list of query params set for propagation into other endpoints
 */
export const selectEventDatasetsConfigQueryParams = (state) => {
  const profileView = state.workspace?.profileView
  const { propagate_events_query_params } = APP_PROFILE_VIEWS.filter(
    (v) => v.id === profileView
  ).shift()
  const vesselDataview =
    state.dataviews &&
    state.dataviews.entities &&
    state.dataviews.entities[DEFAULT_VESSEL_DATAVIEWS[profileView]]
  return (vesselDataview.datasetsConfig ?? [])
    .filter((config) => config.endpoint === 'events')
    .flatMap((config) => config.query ?? {})
    .filter(
      (query) =>
        query.id &&
        query.value !== undefined &&
        ((propagate_events_query_params as string[]) ?? []).includes(query.id ?? null)
    )
}
