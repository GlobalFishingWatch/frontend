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
  selectWorkspaceDataviewsResolved,
  selectDataviewsResourceQueries,
  getUniqueDataviewId,
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
    selectWorkspaceDataviewsResolved,
    selectDataviews,
    selectFishingFilters,
    selectDataviewsResourceQueries,
    selectResources,
  ],
  (dataviews = [], urlDataviews, fishingFilters, resourceQueries, resources) => {
    // TODO add logic to merge 4Wings dataviews into one generator
    const generatorsConfig = dataviews.map((dataview) => {
      const urlDataview = (urlDataviews || []).find(
        (urlDataview) =>
          urlDataview.uid === dataview.id?.toString() || urlDataview.uid === dataview.uid
      )
      const visible = urlDataview?.config?.visible ?? true
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
      const resourceId = getUniqueDataviewId(dataview)
      const resourceQuery = resourceQueries.find((rq) => rq.id === resourceId)
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
        id: `${config.type}_${resourceId}`,
        visible,
        data,
      }
    }) as AnyGeneratorConfig[]
    return generatorsConfig
  }
)
