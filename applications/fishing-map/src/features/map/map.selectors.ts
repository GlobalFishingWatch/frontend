import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewConfig } from '@globalfishingwatch/dataviews-client'
import {
  selectTimerange,
  selectFishingFilters,
  selectMapZoomQuery,
  selectMapLatitudeQuery,
  selectMapLongitudeQuery,
} from 'routes/routes.selectors'
import {
  selectDataviewInstancesResolved,
  selectWorkspaceViewport,
  resolveDataviewDatasetResource,
} from 'features/workspace/workspace.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { FALLBACK_VIEWPORT } from 'data/config'
import { TRACKS_DATASET_TYPE } from 'features/workspace/workspace.mock'
import { selectDebugOptions } from 'features/debug/debug.slice'

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
  [selectDataviewInstancesResolved, selectFishingFilters, selectResources, selectDebugOptions],
  (dataviews = [], fishingFilters, resources, debugOptions) => {
    // TODO add logic to merge 4Wings dataviews into one generator
    const generatorsConfig = dataviews.flatMap((dataview) => {
      const filters = fishingFilters?.map((filter) => filter.id)
      const config: DataviewConfig = { ...dataview.config }
      if (config?.type === Generators.Type.HeatmapAnimated) {
        if (filters?.length) {
          config.sublayers = config.sublayers?.map((layer) => ({
            ...layer,
            filter: `flag=${filters.map((filter) => `'${filter}'`).join(',')}`,
          }))
        }
      }

      // Try to retrieve resource if it exists
      let data
      const { url } = resolveDataviewDatasetResource(dataview, TRACKS_DATASET_TYPE)
      if (url && resources[url]) {
        data = resources[url].data
      }

      return {
        ...config,
        id: dataview.id,
        ...(data && { data }),
        geomType:
          debugOptions.blob === true && config?.sublayers?.length === 1 ? 'blob' : 'gridded',
      }
    }) as AnyGeneratorConfig[]
    return generatorsConfig
  }
)
