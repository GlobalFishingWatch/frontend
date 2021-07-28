import { createSelector } from 'reselect'
import {
  DatasetTypes,
  DataviewCategory,
  DataviewInstance,
  EndpointId,
} from '@globalfishingwatch/api-types'
import {
  resolveDataviews,
  UrlDataviewInstance,
  getGeneratorConfig,
  mergeWorkspaceUrlDataviewInstances,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import { GeneratorType } from '@globalfishingwatch/layer-composer/dist/generators'
import { Type } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectDatasets, selectDatasetsStatus } from 'features/datasets/datasets.slice'
import { selectVesselDataview } from 'features/vessels/vessels.slice'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { selectWorkspaceDataviewInstances } from 'features/workspace/workspace.selectors'
import { selectAllDataviews, selectDataviewsStatus } from './dataviews.slice'
import { BACKGROUND_LAYER, OFFLINE_LAYERS, APP_THINNING, THINNING_LEVELS } from './dataviews.config'

export const selectDataviews = createSelector([selectAllDataviews], (dataviews) => {
  const thinningConfig = THINNING_LEVELS[APP_THINNING]
  const thinningQuery = Object.entries(thinningConfig).map(([id, value]) => ({
    id,
    value,
  }))
  return dataviews?.map((dataview) => {
    return {
      ...dataview,
      datasetsConfig: dataview.datasetsConfig?.map((datasetConfig) => {
        if (datasetConfig.endpoint !== EndpointId.Tracks) return datasetConfig
        return { ...datasetConfig, query: [...(datasetConfig.query || []), ...thinningQuery] }
      }),
    }
  })
})

const defaultBasemapDataview = {
  id: 'basemap',
  config: {
    type: Generators.Type.Basemap,
    basemap: Generators.BasemapType.Default,
  },
}

export const selectDefaultOfflineDataviewsGenerators = createSelector([], () => {
  return BACKGROUND_LAYER.concat(OFFLINE_LAYERS)
})

export const selectBasemapDataview = createSelector([selectDataviews], (dataviews) => {
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
  [selectVesselDataview, selectWorkspaceDataviewInstances, selectUrlDataviewInstances],
  (vesselDataview, dataviews, urlDataviewInstances) => {
    return mergeWorkspaceUrlDataviewInstances(
      [...dataviews, vesselDataview ?? []] as DataviewInstance<any>[],
      urlDataviewInstances
    )
  }
)

export const selectDataviewInstancesResolved = createSelector(
  [
    selectDataviewsStatus,
    selectDataviews,
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
    )
      return []
    const dataviewInstancesResolved = resolveDataviews(
      dataviewInstances as UrlDataviewInstance[],
      dataviews,
      datasets
    )
    return dataviewInstancesResolved
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

export const selectTrackDataviews = createSelector(
  [selectDataviewInstancesByType(Generators.Type.Track)],
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

export const selectActiveTrackDataviews = createSelector([selectTrackDataviews], (dataviews) =>
  dataviews?.filter((d) => d.config?.visible)
)
// export const selectEventsDataviews = createSelector(
//   [selectDataviewInstancesByCategory(DataviewCategory.Events)],
//   (dataviews) => dataviews
// )
