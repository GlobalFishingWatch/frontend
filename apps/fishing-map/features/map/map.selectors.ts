import { createSelector } from '@reduxjs/toolkit'
import type { CircleLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import {
  AnyGeneratorConfig,
  GeneratorType,
  GlGeneratorConfig,
  HeatmapAnimatedMode,
  Ruler,
} from '@globalfishingwatch/layer-composer'
import { ApiEvent } from '@globalfishingwatch/api-types'
import {
  getDataviewsGeneratorConfigs,
  UrlDataviewInstance,
  DataviewsGeneratorConfigsParams,
  isMergedAnimatedGenerator,
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
  selectHighlightedEvents,
  Range,
} from 'features/timebar/timebar.slice'
import { selectBivariateDataviews, selectTimeRange } from 'features/app/app.selectors'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { WorkspaceCategories } from 'data/workspaces'
import { AsyncReducerStatus } from 'utils/async-slice'
import { BivariateDataviews } from 'types'
import { selectShowTimeComparison } from 'features/analysis/analysis.selectors'

type GetGeneratorConfigParams = {
  dataviews: UrlDataviewInstance[] | undefined
  resources: ResourcesState
  rulers: Ruler[]
  debugOptions: DebugOptions
  timeRange?: Range
  highlightedTime?: Range
  highlightedEvents?: string[]
  bivariateDataviews?: BivariateDataviews
  showTimeComparison?: boolean
}
const getGeneratorsConfig = ({
  dataviews = [],
  resources,
  rulers,
  debugOptions,
  timeRange,
  highlightedTime,
  highlightedEvents,
  bivariateDataviews,
  showTimeComparison,
}: GetGeneratorConfigParams) => {
  const animatedHeatmapDataviews = dataviews.filter((dataview) => {
    return dataview.config?.type === GeneratorType.HeatmapAnimated
  })

  const visibleDataviewIds = dataviews.map(({ id }) => id)
  const bivariateVisible =
    bivariateDataviews?.filter((dataviewId) => visibleDataviewIds.includes(dataviewId))?.length ===
    2

  let heatmapAnimatedMode: HeatmapAnimatedMode = bivariateVisible
    ? HeatmapAnimatedMode.Bivariate
    : HeatmapAnimatedMode.Compare

  if (debugOptions.extruded) {
    heatmapAnimatedMode = HeatmapAnimatedMode.Extruded
  } else if (debugOptions.blob && animatedHeatmapDataviews.length === 1) {
    heatmapAnimatedMode = HeatmapAnimatedMode.Blob
  } else if (showTimeComparison) {
    heatmapAnimatedMode = HeatmapAnimatedMode.TimeCompare
  }

  const trackDataviews = dataviews.filter((d) => d.config.type === GeneratorType.Track)
  const singleTrack = trackDataviews.length === 1

  const generatorOptions: DataviewsGeneratorConfigsParams = {
    timeRange,
    heatmapAnimatedMode,
    highlightedEvents,
    highlightedTime,
    debug: debugOptions.debug,
    customGeneratorMapping: {
      [GeneratorType.VesselEvents]: GeneratorType.VesselEventsShapes,
    },
    singleTrack,
  }

  try {
    let generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)
    // In time comparison mode, exclude any heatmap layer that is not activity
    if (showTimeComparison) {
      generatorsConfig = generatorsConfig.filter((config) => {
        if (config.type === GeneratorType.HeatmapAnimated) {
          return isMergedAnimatedGenerator(config.id) && config.sublayers?.length
        }
        return true
      })
    }

    // Avoid entering rulers sources and layers when no active rules
    if (rulers?.length) {
      const rulersGeneratorConfig = {
        type: GeneratorType.Rulers,
        id: 'rulers',
        data: rulers,
      }
      return [...generatorsConfig.reverse(), rulersGeneratorConfig] as AnyGeneratorConfig[]
    }

    return generatorsConfig.reverse()
  } catch (e) {
    console.error(e)
    return []
  }
}

const selectMapGeneratorsConfig = createSelector(
  [
    selectDataviewInstancesResolvedVisible,
    selectVisibleResources,
    selectRulers,
    selectDebugOptions,
    selectHighlightedTime,
    selectHighlightedEvents,
    selectBivariateDataviews,
    selectShowTimeComparison,
    selectTimeRange,
  ],
  (
    dataviews = [],
    resources,
    rulers,
    debugOptions,
    highlightedTime,
    highlightedEvents,
    bivariateDataviews,
    showTimeComparison,
    timeRange
  ) => {
    const generators = getGeneratorsConfig({
      dataviews,
      resources,
      rulers,
      debugOptions,
      highlightedTime,
      highlightedEvents,
      bivariateDataviews,
      showTimeComparison,
      timeRange,
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
    selectShowTimeComparison,
  ],
  (dataviews = [], resources, rulers, debugOptions, bivariateDataviews, showTimeComparison) => {
    // We don't want highlightedTime here to avoid re-computing on mouse timebar hovering
    return getGeneratorsConfig({
      dataviews,
      resources,
      rulers,
      debugOptions,
      bivariateDataviews,
      showTimeComparison,
    })
  }
)

export const WORKSPACES_POINTS_TYPE = 'workspace'
export const WORKSPACE_GENERATOR_ID = 'workspace_points'
export const selectWorkspacesListGenerator = createSelector(
  [selectCurrentWorkspacesList],
  (workspaces) => {
    if (!workspaces?.length) return

    const generator: GlGeneratorConfig = {
      id: WORKSPACE_GENERATOR_ID,
      type: GeneratorType.GL,
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
        } as CircleLayerSpecification,
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
        } as CircleLayerSpecification,
      ],
    }

    return generator
  }
)

export const selectMapWorkspacesListGenerators = createSelector(
  [selectDefaultBasemapGenerator, selectWorkspacesListGenerator],
  (basemapGenerator, workspaceGenerator): AnyGeneratorConfig[] => {
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

const selectGeneratorConfigsByType = (type: GeneratorType) => {
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
  [selectGeneratorConfigsByType(GeneratorType.HeatmapAnimated)],
  (dataviews) => dataviews
)

export const selectActiveHeatmapAnimatedGeneratorConfigs = createSelector(
  [selectHeatmapAnimatedGeneratorConfigs],
  (generators) => {
    return generators?.filter((generator) => generator.visible)
  }
)
