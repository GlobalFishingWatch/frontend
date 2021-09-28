import { createSelector } from '@reduxjs/toolkit'
import type { CircleLayer } from '@globalfishingwatch/mapbox-gl'
import { AnyGeneratorConfig } from '@globalfishingwatch/layer-composer/src/generators/types'
import { ApiEvent } from '@globalfishingwatch/api-types/dist'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  getDataviewsGeneratorConfigs,
  MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { selectWorkspaceError, selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import {
  selectDataviewInstancesResolvedVisible,
  selectDefaultBasemapGenerator,
} from 'features/dataviews/dataviews.selectors'
import { selectCurrentWorkspacesList } from 'features/workspaces-list/workspaces-list.selectors'
import { ResourcesState } from 'features/resources/resources.slice'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import { DebugOptions, selectDebugOptions } from 'features/debug/debug.slice'
import { selectRulers } from 'features/map/rulers/rulers.slice'
import {
  selectHighlightedTime,
  selectHighlightedEvent,
  Range,
} from 'features/timebar/timebar.slice'
import { selectBivariateDataviews } from 'features/app/app.selectors'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { WorkspaceCategories } from 'data/workspaces'
import { AsyncReducerStatus } from 'utils/async-slice'
import { BivariateDataviews } from 'types'
import { selectDrawMode } from './map.slice'

type GetGeneratorConfigParams = {
  dataviews: UrlDataviewInstance[] | undefined
  resources: ResourcesState
  rulers: Generators.Ruler[]
  debugOptions: DebugOptions
  highlightedTime?: Range
  highlightedEvent?: ApiEvent
  bivariateDataviews?: BivariateDataviews
}
const getGeneratorsConfig = ({
  dataviews = [],
  resources,
  rulers,
  debugOptions,
  highlightedTime,
  highlightedEvent,
  bivariateDataviews,
}: GetGeneratorConfigParams) => {
  const animatedHeatmapDataviews = dataviews.filter((dataview) => {
    return dataview.config?.type === Generators.Type.HeatmapAnimated
  })

  const visibleDataviewIds = dataviews.map(({ id }) => id)
  const bivariateVisible =
    bivariateDataviews?.filter((dataviewId) => visibleDataviewIds.includes(dataviewId))?.length ===
    2

  let heatmapAnimatedMode: Generators.HeatmapAnimatedMode = bivariateVisible
    ? Generators.HeatmapAnimatedMode.Bivariate
    : Generators.HeatmapAnimatedMode.Compare

  if (debugOptions.extruded) {
    heatmapAnimatedMode = Generators.HeatmapAnimatedMode.Extruded
  } else if (debugOptions.blob && animatedHeatmapDataviews.length === 1) {
    heatmapAnimatedMode = Generators.HeatmapAnimatedMode.Blob
  }

  const generatorOptions = {
    heatmapAnimatedMode,
    highlightedEvent,
    highlightedTime,
    debug: debugOptions.debug,
    mergedActivityGeneratorId: MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
  }

  const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

  // Avoid entering rulers sources and layers when no active rules
  if (rulers?.length) {
    const rulersGeneratorConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }
    return [...generatorsConfig.reverse(), rulersGeneratorConfig] as AnyGeneratorConfig[]
  }

  return generatorsConfig.reverse()
}

const selectMapGeneratorsConfig = createSelector(
  [
    selectDataviewInstancesResolvedVisible,
    selectVisibleResources,
    selectRulers,
    selectDebugOptions,
    selectHighlightedTime,
    selectHighlightedEvent,
    selectBivariateDataviews,
  ],
  (
    dataviews = [],
    resources,
    rulers,
    debugOptions,
    highlightedTime,
    highlightedEvent,
    bivariateDataviews
  ) => {
    const generators = getGeneratorsConfig({
      dataviews,
      resources,
      rulers,
      debugOptions,
      highlightedTime,
      highlightedEvent,
      bivariateDataviews,
    })
    return generators
  }
)

const selectStaticGeneratorsConfig = createSelector(
  [
    selectDataviewInstancesResolvedVisible,
    selectVisibleResources,
    selectRulers,
    selectDebugOptions,
    selectBivariateDataviews,
  ],
  (dataviews = [], resources, rulers, debugOptions, bivariateDataviews) => {
    // We don't want highlightedTime here to avoid re-computing on mouse timebar hovering
    return getGeneratorsConfig({
      dataviews,
      resources,
      rulers,
      debugOptions,
      bivariateDataviews,
    })
  }
)

export const WORKSPACES_POINTS_TYPE = 'workspace'
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

              const { latitude, longitude, zoom } = workspace.viewport
              return {
                type: 'Feature',
                properties: {
                  id: workspace.id,
                  label: workspace.name,
                  type: WORKSPACES_POINTS_TYPE,
                  category: workspace.category || WorkspaceCategories.FishingActivity,
                  latitude,
                  longitude,
                  zoom,
                },
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

export const selectMapWorkspacesListGenerators = createSelector(
  [selectDefaultBasemapGenerator, selectWorkspacesListGenerator],
  (basemapGenerator, workspaceGenerator): Generators.AnyGeneratorConfig[] => {
    if (!workspaceGenerator) return [basemapGenerator]
    return [basemapGenerator, workspaceGenerator]
  }
)

export const selectDefaultMapGeneratorsConfig = createSelector(
  [
    selectWorkspaceError,
    selectWorkspaceStatus,
    isWorkspaceLocation,
    selectDefaultBasemapGenerator,
    selectMapGeneratorsConfig,
    selectMapWorkspacesListGenerators,
  ],
  (
    workspaceError,
    workspaceStatus,
    showWorkspaceDetail,
    basemapGenerator,
    workspaceGenerators = [] as AnyGeneratorConfig[],
    workspaceListGenerators
  ): AnyGeneratorConfig[] => {
    if (workspaceError.status === 401 || workspaceStatus === AsyncReducerStatus.Loading) {
      return [basemapGenerator]
    }
    if (showWorkspaceDetail) {
      return workspaceStatus !== AsyncReducerStatus.Finished
        ? [basemapGenerator]
        : workspaceGenerators
    }
    return workspaceListGenerators
  }
)

const selectGeneratorConfigsByType = (type: Generators.Type) => {
  return createSelector([selectStaticGeneratorsConfig], (generators = []) => {
    return generators?.filter((generator) => generator.type === type)
  })
}

export const selectGeneratorConfigsById = (id: string) => {
  return createSelector([selectStaticGeneratorsConfig], (generators = []) => {
    return generators?.filter((generator) => generator.id === id)
  })
}

const selectHeatmapAnimatedGeneratorConfigs = createSelector(
  [selectGeneratorConfigsByType(Generators.Type.HeatmapAnimated)],
  (dataviews) => dataviews
)

export const selectActiveHeatmapAnimatedGeneratorConfigs = createSelector(
  [selectHeatmapAnimatedGeneratorConfigs],
  (generators) => {
    return generators?.filter((generator) => generator.visible)
  }
)

export const selectIsMapDrawing = createSelector([selectDrawMode], (drawMode): boolean => {
  return drawMode !== 'disabled'
})
