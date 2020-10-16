import { createSelector } from '@reduxjs/toolkit'
import { UrlDataviewInstance } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  AnyGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewConfig } from '@globalfishingwatch/dataviews-client'
import {
  selectTimerange,
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
  [selectDataviewInstancesResolved, selectResources, selectDebugOptions],
  (dataviews = [], resources, debugOptions) => {
    const animatedHeatmapDataviews: UrlDataviewInstance[] = []

    // Collect heatmap animated generators and filter them out from main dataview list
    let generatorsConfig = dataviews.filter((d) => {
      const isAnimatedHeatmap = d.config?.type === Generators.Type.HeatmapAnimated
      if (isAnimatedHeatmap) {
        animatedHeatmapDataviews.push(d)
      }
      return !isAnimatedHeatmap
    })

    // If heatmap animated generators found, merge them into one generator with multiple sublayers
    if (animatedHeatmapDataviews.length) {
      const sublayers = animatedHeatmapDataviews.flatMap((dataview) => {
        const config = dataview.config
        const datasetsConfig = dataview.datasetsConfig
        if (!config || !datasetsConfig || !datasetsConfig.length) return []
        const sublayer: HeatmapAnimatedGeneratorSublayer = {
          id: dataview.id,
          datasets: datasetsConfig.map((dc) => dc.datasetId),
          colorRamp: config.colorRamp || 'presence',
        }
        if (config.filters) {
          const flags = config.filters.map((flag: string) => `flag='${flag}'`).join(' OR ')
          sublayer.filter = flags
        }
        return sublayer
      })
      const mergedLayer = {
        ...animatedHeatmapDataviews[0],
        config: {
          ...animatedHeatmapDataviews[0].config,
          sublayers,
          geomType: debugOptions.blob === true && sublayers.length === 1 ? 'blob' : 'gridded',
        },
      }
      generatorsConfig.push(mergedLayer)
    }

    generatorsConfig = generatorsConfig.flatMap((dataview) => {
      const config: DataviewConfig = { ...dataview.config }
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
      }
    }) as AnyGeneratorConfig[]
    return generatorsConfig
  }
)
