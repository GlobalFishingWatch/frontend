import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  selectTimerange,
  selectFishingFilters,
  selectMapZoomQuery,
  selectMapLatitudeQuery,
  selectMapLongitudeQuery,
} from 'routes/routes.selectors'
import {
  selectWorkspaceDataviewsResolved,
  selectDataviewsResourceQueries,
  getUniqueDataviewId,
  selectWorkspaceViewport,
} from 'features/workspace/workspace.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { FALLBACK_VIEWPORT } from 'data/config'

export const selectViewport = createSelector(
  [selectMapZoomQuery, selectMapLatitudeQuery, selectMapLongitudeQuery, selectWorkspaceViewport],
  (zoom, latitude, longitude, workspaceViewport) => {
    return {
      zoom: zoom || workspaceViewport?.zoom || FALLBACK_VIEWPORT.zoom,
      latitude: latitude || workspaceViewport?.latitude || FALLBACK_VIEWPORT.latitude,
      longitude: longitude || workspaceViewport?.longitude || FALLBACK_VIEWPORT.longitude,
    }
  }
)

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
    selectFishingFilters,
    selectDataviewsResourceQueries,
    selectResources,
  ],
  (dataviews = [], fishingFilters, resourceQueries, resources) => {
    // TODO add logic to merge 4Wings dataviews into one generator
    const generatorsConfig = dataviews.map((dataview) => {
      const filters = fishingFilters?.map((filter) => filter.id)
      const config = { ...dataview.config }
      if (config.type === Generators.Type.HeatmapAnimated && filters?.length) {
        config.sublayers = config.sublayers?.map((layer) => ({
          ...layer,
          filter: `flag=${filters.map((filter) => `'${filter}'`).join(',')}`,
        }))
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
        data,
      }
    }) as AnyGeneratorConfig[]
    return generatorsConfig
  }
)
