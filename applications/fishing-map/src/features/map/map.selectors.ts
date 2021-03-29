import { createSelector } from '@reduxjs/toolkit'
import { CircleLayer } from '@globalfishingwatch/mapbox-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/dataviews-client'
import {
  selectDataviewInstancesResolved,
  selectWorkspaceError,
} from 'features/workspace/workspace.selectors'
import { selectCurrentWorkspacesList } from 'features/workspaces-list/workspaces-list.selectors'
import { selectResources } from 'features/resources/resources.slice'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectRulers } from 'features/map/controls/rulers.slice'
import { selectHighlightedTime, selectStaticTime } from 'features/timebar/timebar.slice'
import { selectViewport, selectTimeRange, selectBivariate } from 'features/app/app.selectors'
import { isWorkspaceLocation } from 'routes/routes.selectors'

export const selectGlobalGeneratorsConfig = createSelector(
  [selectViewport, selectTimeRange],
  ({ zoom }, { start, end }) => ({
    zoom,
    start,
    end,
    token: GFWAPI.getToken(),
  })
)

// TODO merge this with getDataviewsGeneratorConfigs user-dataviews-layer package
export const getWorkspaceGeneratorsConfig = createSelector(
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
    const animatedHeatmapDataviews = dataviews.filter((d) => {
      const isAnimatedHeatmap = d.config?.type === Generators.Type.HeatmapAnimated
      return !isAnimatedHeatmap
    })

    let aggregationMode: Generators.HeatmapAnimatedMode = bivariate
      ? Generators.HeatmapAnimatedMode.Bivariate
      : Generators.HeatmapAnimatedMode.Compare
    if (debugOptions.extruded) {
      aggregationMode = Generators.HeatmapAnimatedMode.Extruded
    } else if (debugOptions.blob && animatedHeatmapDataviews.length === 1) {
      aggregationMode = Generators.HeatmapAnimatedMode.Blob
    }
    const generatorOptions = {
      aggregationMode,
      highlightedTime,
      timeRange: staticTime,
    }

    const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

    const rulersConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    return [...generatorsConfig.reverse(), rulersConfig] as AnyGeneratorConfig[]
  }
)

export const WORKSPACE_GENERATOR_ID = 'workspace_points'
export const selectWorkspacesListGenerator = createSelector(
  [selectCurrentWorkspacesList],
  (workspaces) => {
    if (!workspaces?.length) return

    const generator: Generators.GlGeneratorConfig = {
      id: WORKSPACE_GENERATOR_ID,
      type: Generators.Type.GL,
      sources: [
        {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: workspaces.flatMap((workspace) => {
              if (!workspace.viewport) {
                return []
              }

              const { latitude, longitude } = workspace.viewport
              return {
                type: 'Feature',
                properties: { id: workspace.id, label: workspace.name, type: 'workspace' },
                geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude],
                },
              }
            }),
          },
        },
      ],
      layers: [
        {
          type: 'circle',
          layout: {},
          paint: {
            'circle-color': '#ffffff',
            'circle-opacity': 0.2,
            'circle-radius': 14,
          },
          metadata: {
            interactive: true,
          },
        } as CircleLayer,
        {
          type: 'circle',
          layout: {},
          paint: {
            'circle-color': '#ffffff',
            'circle-stroke-color': '#002358',
            'circle-stroke-opacity': 1,
            'circle-stroke-width': 1,
            'circle-radius': 8,
          },
          metadata: {
            interactive: false,
          },
        } as CircleLayer,
      ],
    }

    return generator
  }
)

const basemap: Generators.BasemapGeneratorConfig = {
  id: 'landmass',
  type: Generators.Type.Basemap,
  basemap: Generators.BasemapType.Default,
}

export const selectMapWorkspacesListGenerators = createSelector(
  [selectWorkspacesListGenerator],
  (workspaceGenerator): AnyGeneratorConfig[] => {
    if (!workspaceGenerator) return [basemap]
    return [basemap, workspaceGenerator]
  }
)

export const getGeneratorsConfig = createSelector(
  [
    selectWorkspaceError,
    isWorkspaceLocation,
    getWorkspaceGeneratorsConfig,
    selectMapWorkspacesListGenerators,
  ],
  (workspaceError, showWorkspaceDetail, workspaceGenerators, workspaceListGenerators) => {
    if (workspaceError.status === 401) return [basemap]
    return showWorkspaceDetail ? workspaceGenerators : workspaceListGenerators
  }
)
