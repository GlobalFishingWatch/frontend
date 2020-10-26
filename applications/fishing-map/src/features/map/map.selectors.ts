import { createSelector } from '@reduxjs/toolkit'
import { UrlDataviewInstance } from 'types'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  AnyGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { DataviewConfig } from '@globalfishingwatch/api-types'
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
import { TRACKS_DATASET_TYPE, USER_CONTEXT_TYPE } from 'features/workspace/workspace.mock'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectRulers } from 'features/map/controls/rulers.slice'
import { selectHighlightedTime, selectStaticTime } from 'features/timebar/timebar.slice'

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
    selectDataviewInstancesResolved,
    selectResources,
    selectRulers,
    selectDebugOptions,
    selectHighlightedTime,
    selectStaticTime,
  ],
  (dataviews = [], resources, rulers, debugOptions, highlightedTime, staticTime) => {
    const animatedHeatmapDataviews: UrlDataviewInstance[] = []

    // Collect heatmap animated generators and filter them out from main dataview list
    let generatorsConfig = dataviews.filter((d) => {
      const isAnimatedHeatmap = d.config?.type === Generators.Type.HeatmapAnimated
      const isVisible = d.config?.visible !== false
      if (isAnimatedHeatmap && isVisible) {
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
        const colorRamp =
          animatedHeatmapDataviews.length === 1
            ? 'presence'
            : (config.colorRamp as Generators.ColorRampsIds)
        const sublayer: HeatmapAnimatedGeneratorSublayer = {
          id: dataview.id,
          datasets: datasetsConfig.map((dc) => dc.datasetId),
          colorRamp,
          filter: config.filter,
        }

        return sublayer
      })

      // Force HeatmapAnimated mode depending on debug options
      let mode = Generators.HeatmapAnimatedMode.Compare
      if (debugOptions.extruded) {
        mode = Generators.HeatmapAnimatedMode.Extruded
      } else if (debugOptions.blob && sublayers.length === 1) {
        mode = Generators.HeatmapAnimatedMode.Blob
      }

      const mergedLayer = {
        ...animatedHeatmapDataviews[0],
        id: 'mergedAnimatedHeatmap',
        config: {
          ...animatedHeatmapDataviews[0].config,
          sublayers,
          mode,
          debug: debugOptions.debug,
          debugLabels: debugOptions.debug,
          staticStart: staticTime?.start,
          staticEnd: staticTime?.end,
        },
      }
      generatorsConfig.push(mergedLayer)
    }

    // Collect track generators and inject highligtedTime
    generatorsConfig = generatorsConfig.map((generator) => {
      const isTrack = generator.config?.type === Generators.Type.Track
      if (!isTrack) return generator
      return {
        ...generator,
        config: {
          ...generator.config,
          highlightedTime,
        },
      }
    })

    generatorsConfig = generatorsConfig.flatMap((dataview) => {
      const config: DataviewConfig = { ...dataview.config }
      // Try to retrieve resource if it exists
      let data
      const { url } = resolveDataviewDatasetResource(dataview, TRACKS_DATASET_TYPE)
      if (url && resources[url]) {
        data = resources[url].data
      }

      const generator: any = {
        ...config,
        id: dataview.id,
        ...(data && { data }),
      }
      // TODO: remove UserContext and use Context
      if (dataview.config?.type === Generators.Type.UserContext) {
        const { url } = resolveDataviewDatasetResource(dataview, USER_CONTEXT_TYPE)
        if (url) {
          generator.tilesUrl = url
        }
      }
      return generator
    })

    const rulersConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    return [...generatorsConfig, rulersConfig] as AnyGeneratorConfig[]
  }
)
