import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  AnyGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { GeneratorDataviewConfig, Generators } from '@globalfishingwatch/layer-composer'
import { UrlDataviewInstance } from 'types'
import {
  selectMapZoomQuery,
  selectMapLatitudeQuery,
  selectMapLongitudeQuery,
  selectBivariate,
} from 'routes/routes.selectors'
import { selectTimeRange } from 'features/timebar/timebar.selectors'
import {
  selectDataviewInstancesResolved,
  selectWorkspaceViewport,
  resolveDataviewDatasetResource,
} from 'features/workspace/workspace.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { FALLBACK_VIEWPORT } from 'data/config'
import { TRACKS_DATASET_TYPE, USER_CONTEXT_TYPE } from 'data/datasets'
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
  [selectViewport, selectTimeRange],
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
    selectBivariate,
  ],
  (dataviews = [], resources, rulers, debugOptions, highlightedTime, staticTime, bivariate) => {
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
          colorRamp: config.colorRamp as Generators.ColorRampsIds,
          filter: config.filter,
          visible: config.visible,
        }

        return sublayer
      })

      // Force HeatmapAnimated mode depending on debug options
      let mode = bivariate
        ? Generators.HeatmapAnimatedMode.Bivariate
        : Generators.HeatmapAnimatedMode.Compare
      if (debugOptions.extruded) {
        mode = Generators.HeatmapAnimatedMode.Extruded
      } else if (debugOptions.blob && sublayers.length === 1) {
        mode = Generators.HeatmapAnimatedMode.Blob
      }
      const mergedLayer = {
        id: 'mergedAnimatedHeatmap',
        config: {
          type: Generators.Type.HeatmapAnimated,
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

    generatorsConfig = generatorsConfig.flatMap((dataview) => {
      const generator: GeneratorDataviewConfig = {
        id: dataview.id,
        ...dataview.config,
      }

      if (dataview.config?.type === Generators.Type.Track) {
        // Inject highligtedTime
        generator.config = {
          ...generator.config,
          highlightedTime,
        }
        // Try to retrieve resource if it exists
        const { url } = resolveDataviewDatasetResource(dataview, { type: TRACKS_DATASET_TYPE })
        if (url && resources[url]) {
          generator.data = resources[url].data
        }
      } else if (dataview.config?.type === Generators.Type.Context) {
        if (Array.isArray(dataview.config.layers)) {
          const tilesUrls = dataview.config.layers?.flatMap(({ id, dataset }) => {
            const { url } = resolveDataviewDatasetResource(dataview, { id: dataset })
            if (!url) return []
            return { id, tilesUrl: url }
          })
          // Duplicated generators when context dataview have multiple layers
          return tilesUrls.map(({ id, tilesUrl }) => ({
            ...generator,
            id: dataview.id + id,
            layer: id,
            tilesUrl,
          }))
        } else {
          generator.id = dataview.id + dataview.config.layers
          generator.layer = dataview.config.layers
          const { url } = resolveDataviewDatasetResource(dataview, { type: USER_CONTEXT_TYPE })
          if (url) {
            generator.tilesUrl = url
          }
        }
      }

      return generator
    })

    const rulersConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    return [...generatorsConfig.reverse(), rulersConfig] as AnyGeneratorConfig[]
  }
)
