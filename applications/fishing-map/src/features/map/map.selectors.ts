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
import { selectWorkspaceDataviews } from 'features/workspace/workspace.selectors'

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
  [selectWorkspaceDataviews, selectDataviews, selectFishingFilters],
  (dataviews = [], urlDataviews, fishingFilters) => {
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
      return {
        ...config,
        visible,
      }
    }) as AnyGeneratorConfig[]
  }
)
