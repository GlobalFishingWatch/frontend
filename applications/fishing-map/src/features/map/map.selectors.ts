import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  AnyGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  selectDataviews,
  selectViewport,
  selectTimerange,
  selectFishingFilters,
} from 'routes/routes.selectors'
import {
  selectWorkspaceDataviews,
  selectDataviewsResourceQueries,
} from 'features/workspace/workspace.selectors'
import { selectResources } from 'features/resources/resources.slice'

export const selectGlobalGeneratorsConfig = createSelector(
  [selectViewport, selectTimerange],
  ({ zoom }, { start, end }) => ({
    zoom,
    start,
    end,
    token: GFWAPI.getToken(),
  })
)

export const getGeneratorsConfig = createSelector(
  [
    selectWorkspaceDataviews,
    selectDataviews,
    selectFishingFilters,
    selectDataviewsResourceQueries,
    selectResources,
  ],
  (dataviews = [], urlDataviews, fishingFilters, resourceQueries, resources) => {
    return dataviews.map((dataview) => {
      const urlDataview = urlDataviews?.find((urlDataview) => urlDataview.id === dataview.id)
      const visible =
        urlDataview?.config?.visible !== undefined ? urlDataview?.config?.visible : true
      const filters = fishingFilters?.map((filter) => filter.id)
      const config = { ...dataview.config }
      if (config.type === Generators.Type.HeatmapAnimated && filters?.length) {
        config.sublayers = (config.sublayers as HeatmapAnimatedGeneratorSublayer[])?.map(
          (layer) => ({
            ...layer,
            filter: `flag=${filters.map((filter) => `'${filter}'`).join(',')}`,
          })
        )
      }

      // Try to retrieve resource if it exists
      let data
      const resourceQuery = resourceQueries.find((rq) => rq.dataviewId === dataview.id)
      if (resourceQuery) {
        const resource = resources[resourceQuery.url]
        if (resource) {
          data = resource.data
        }
      }

      return {
        ...config,
        // TODO Add vessel id for tracks ie
        // dataview.datasetsConfig[?].query.find(q => q.id === 'id').value
        id: `${config.type}_${dataview.id}_SOME_UNIQUE_ID`,
        visible,
        data,
      }
    }) as AnyGeneratorConfig[]
  }
)
