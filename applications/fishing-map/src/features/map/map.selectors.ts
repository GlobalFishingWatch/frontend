import { createSelector } from '@reduxjs/toolkit'
import type { CircleLayer } from '@globalfishingwatch/mapbox-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { Generators } from '@globalfishingwatch/layer-composer'
import { getDataviewsGeneratorConfigs } from '@globalfishingwatch/dataviews-client'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
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
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from 'data/config'

export const selectGlobalGeneratorsConfig = createSelector(
  [selectViewport, selectTimeRange],
  ({ zoom }, { start, end }) => ({
    zoom,
    start,
    end,
    token: GFWAPI.getToken(),
  })
)

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

    let heatmapAnimatedMode: Generators.HeatmapAnimatedMode = bivariate
      ? Generators.HeatmapAnimatedMode.Bivariate
      : Generators.HeatmapAnimatedMode.Compare
    if (debugOptions.extruded) {
      heatmapAnimatedMode = Generators.HeatmapAnimatedMode.Extruded
    } else if (debugOptions.blob && animatedHeatmapDataviews.length === 1) {
      heatmapAnimatedMode = Generators.HeatmapAnimatedMode.Blob
    }
    const generatorOptions = {
      heatmapAnimatedMode,
      highlightedTime,
      timeRange: staticTime,
      debug: debugOptions.blob,
      mergedActivityGeneratorId: MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
    }

    const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

    const rulersGeneratorConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }

    const generators = [
      ...generatorsConfig.reverse(),
      rulersGeneratorConfig,
    ] as Generators.AnyGeneratorConfig[]

    const generators_ = generators.map((generator) => {
      if (generator.id !== 'sea-surface-temp-palau') {
        return generator
      }
      const sublayer = {
        id: 'lalalala',
        colorRamp: 'lilac' as Generators.ColorRampsIds,
        datasets: ['fd-water-temperature-palau'],
        filter: '',
        active: true,
        visible: true,
        breaks: [28, 28.2, 28.4, 28.6, 28.8, 29, 29.2, 29.4],
        breaksMultiplier: 1,
      }
      const gen: Generators.HeatmapAnimatedGeneratorConfig = {
        id: 'sea-surface-temp-palau',
        type: Generators.Type.HeatmapAnimated,
        sublayers: [sublayer],
        mode: Generators.HeatmapAnimatedMode.Single,
        interactive: true,
        interval: 'month',
        tilesAPI: 'https://dev-api-fourwings-tiler-jzzp2ui3wq-uc.a.run.app/v1',
        aggregationOperation: AggregationOperation.Avg,
        breaksMultiplier: 1,
        metadata: {
          legend: {
            unit: '℃',
          },
        },
      }
      return gen
    })

    return generators_ as Generators.AnyGeneratorConfig[]
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
  (workspaceGenerator): Generators.AnyGeneratorConfig[] => {
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
