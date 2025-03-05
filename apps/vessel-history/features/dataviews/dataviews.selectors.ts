import { createSelector } from '@reduxjs/toolkit'
import type { WorkspaceProfileViewParam } from 'types'

import type { DataviewInstance } from '@globalfishingwatch/api-types';
import { DatasetTypes, DataviewCategory } from '@globalfishingwatch/api-types'
import type {
  GetDatasetConfigsCallbacks,  UrlDataviewInstance} from '@globalfishingwatch/dataviews-client';
import {
  _getLegacyResources,
  getDatasetConfigByDatasetType,
  getDatasetConfigsByDatasetType,
  mergeWorkspaceUrlDataviewInstances,
  resolveDataviews,
} from '@globalfishingwatch/dataviews-client'
import type {
  BasemapGeneratorConfig} from '@globalfishingwatch/layer-composer';
import {
  BasemapType,
  GeneratorType,
  getGeneratorConfig,
} from '@globalfishingwatch/layer-composer'

import { APP_PROFILE_VIEWS } from 'data/config'
import { selectDatasets, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import {
  selectTrackChunksConfig,
  selectTrackThinningConfig,
} from 'features/resources/resources.slice'
import { trackDatasetConfigsCallback } from 'features/resources/resources.utils'
import { selectVesselDataview } from 'features/vessels/vessels.slice'
import {
  selectWorkspaceDataviewInstances,
  selectWorkspaceProfileView,
  selectWorkspaceStateProperty,
} from 'features/workspace/workspace.selectors'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import { createDeepEqualSelector } from 'utils/selectors'

import { BACKGROUND_LAYER, DEFAULT_VESSEL_DATAVIEWS,OFFLINE_LAYERS } from './dataviews.config'
import { selectAllDataviews, selectDataviewsStatus } from './dataviews.slice'
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
    const vesselGroups = []

    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstances as UrlDataviewInstance[],
      dataviews,
      datasets,
      vesselGroups
    )

    return dataviewInstancesResolved
  }
)

export const selectTrackDatasetConfigsCallback = createSelector(
  [
    selectTrackThinningConfig,
    selectTrackChunksConfig,
    selectWorkspaceStateProperty('timebarGraph'),
  ],
  (thinningConfig, chunks, timebarGraph) =>
    trackDatasetConfigsCallback(thinningConfig, chunks as any, timebarGraph)
)

/**
 * Prepare track dataviews' datasetConfigs using the same callback
 * used to get the resources
 */
export const selectDataviewsForResourceQuerying = createDeepEqualSelector(
  [selectDataviewInstancesResolved, selectTrackDatasetConfigsCallback],
  (dataviewInstances, trackDatasetConfigs) => {
    const getDatasetsConfig = (dataview) => {
      const info = getDatasetConfigByDatasetType(dataview, DatasetTypes.Vessels)

      const trackDatasetType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? DatasetTypes.UserTracks
          : DatasetTypes.Tracks
      const track = { ...getDatasetConfigByDatasetType(dataview, trackDatasetType) }

      const events = getDatasetConfigsByDatasetType(dataview, DatasetTypes.Events).filter(
        (datasetConfig) => datasetConfig.query?.find((q) => q.id === 'vessels')?.value
      ) // Loitering
      return trackDatasetConfigs([info, track, ...events])
    }

    return dataviewInstances.map((dataview) => {
      const config =
        dataview.category === DataviewCategory.Context
          ? dataview.datasetsConfig
          : getDatasetsConfig(dataview)
      const result = {
        ...dataview,
        // Use the same datasets config used to get resources in
        // selectDataviewsResources of features/dataviews/dataviews.selectors
        // resources urls are properly built and resources found
        // in the state
        datasetsConfig: config,
      }
      return result
    })
  }
)

/**
 * Calls getResources to prepare track dataviews' datasetConfigs.
 * Injects app-specific logic by using getResources's callback
 */
export const selectDataviewsResources = createSelector(
  [selectDataviewInstancesResolved, selectTrackDatasetConfigsCallback],
  (dataviewInstances, trackDatasetConfigsCallback) => {
    const callbacks: GetDatasetConfigsCallbacks = {
      track: trackDatasetConfigsCallback,
    }

    return _getLegacyResources(dataviewInstances || [], callbacks)
  }
)

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
  (profileView: WorkspaceProfileViewParam) => {
    const { events_query_params } = APP_PROFILE_VIEWS.filter(
      (v) => v.id === profileView
    ).shift() ?? {
      events_query_params: [],
    }

    return getVesselDataviewInstanceFactory(
      DEFAULT_VESSEL_DATAVIEWS[profileView],
      events_query_params
    )
  }
)

/**
 * Returns the event datasets query params based on the current profile view
 * and its list of query params set for propagation into other endpoints
 */
export const selectEventDatasetsConfigQueryParams = (state) => {
  const profileView = state.workspace?.profileView
  const { propagate_events_query_params }: any = APP_PROFILE_VIEWS.filter(
    (v) => v.id === profileView
  ).shift()
  const vesselDataview =
    state.dataviews &&
    state.dataviews.entities &&
    state.dataviews.entities[DEFAULT_VESSEL_DATAVIEWS[profileView]]
  return (vesselDataview?.datasetsConfig ?? [])
    .filter((config) => config.endpoint === 'events')
    .flatMap((config) => config.query ?? {})
    .filter(
      (query) =>
        query.id &&
        query.value !== undefined &&
        ((propagate_events_query_params as string[]) ?? []).includes(query.id ?? null)
    )
}
