import { createSelector } from '@reduxjs/toolkit'
import type { CircleLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import {
  AnyGeneratorConfig,
  GeneratorType,
  GlGeneratorConfig,
  Group,
  HeatmapAnimatedMode,
  MapAnnotation,
  PolygonsGeneratorConfig,
  Ruler,
} from '@globalfishingwatch/layer-composer'
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
} from 'features/dataviews/selectors/dataviews.selectors'
import { selectCurrentWorkspacesList } from 'features/workspaces-list/workspaces-list.selectors'
import { ResourcesState } from 'features/resources/resources.slice'
import { selectVisibleResources } from 'features/resources/resources.selectors'
import { DebugOptions, selectDebugOptions } from 'features/debug/debug.slice'
import {
  selectHighlightedTime,
  selectHighlightedEvents,
  TimeRange,
} from 'features/timebar/timebar.slice'
import {
  selectBivariateDataviews,
  selectMapAnnotationsVisible,
  selectMapRulersVisible,
} from 'features/app/selectors/app.selectors'
import {
  selectIsMarineManagerLocation,
  selectIsVesselLocation,
  selectIsAnyReportLocation,
  selectIsWorkspaceLocation,
  selectIsWorkspaceVesselLocation,
  selectMapDrawingEditId,
  selectIsMapDrawing,
} from 'routes/routes.selectors'
import {
  selectShowTimeComparison,
  selectReportPreviewBufferFeature,
  selectReportBufferFeature,
} from 'features/reports/reports.selectors'
import { WorkspaceCategory } from 'data/workspaces'
import { AsyncReducerStatus } from 'utils/async-slice'
import { BivariateDataviews } from 'types'
import { BUFFER_PREVIEW_COLOR } from 'data/config'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { selectMapControlRuler } from 'features/map/controls/map-controls.slice'
import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'
import { selectMarineManagerDataviewInstanceResolved } from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  ANNOTATIONS_GENERATOR_ID,
  PREVIEW_BUFFER_GENERATOR_ID,
  REPORT_BUFFER_GENERATOR_ID,
  RULERS_GENERATOR_ID,
  WORKSPACES_POINTS_TYPE,
  WORKSPACE_GENERATOR_ID,
} from './map.config'

type GetGeneratorConfigParams = {
  dataviews: UrlDataviewInstance[] | undefined
  resources: ResourcesState
  rulers: Ruler[]
  editingRuler: Ruler | null
  annotations?: MapAnnotation[]
  debugOptions: DebugOptions
  timeRange: TimeRange
  highlightedTime?: TimeRange
  highlightedEvents?: string[]
  bivariateDataviews?: BivariateDataviews
  showTimeComparison?: boolean
}
const getGeneratorsConfig = ({
  dataviews = [],
  resources,
  rulers,
  editingRuler,
  annotations = [],
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

  const trackDataviews = dataviews.filter((d) => d.config?.type === GeneratorType.Track)
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

    const finalGenerators = [...generatorsConfig.reverse()]
    // Avoid entering rulers sources and layers when no active rules
    if (rulers?.length) {
      const rulersGeneratorConfig: AnyGeneratorConfig = {
        type: GeneratorType.Rulers,
        id: RULERS_GENERATOR_ID,
        data: rulers,
      }
      finalGenerators.push(rulersGeneratorConfig)
    }
    // This way we avoid to re-compute the other rulers when editing
    if (editingRuler) {
      const rulersGeneratorConfig: AnyGeneratorConfig = {
        type: GeneratorType.Rulers,
        id: `${RULERS_GENERATOR_ID}-editing`,
        data: [editingRuler],
      }
      finalGenerators.push(rulersGeneratorConfig)
    }
    if (annotations?.length) {
      const annotationsGeneratorConfig: AnyGeneratorConfig = {
        type: GeneratorType.Annotation,
        id: ANNOTATIONS_GENERATOR_ID,
        data: annotations,
      }
      finalGenerators.push(annotationsGeneratorConfig)
    }
    return finalGenerators
  } catch (e) {
    console.error(e)
    return []
  }
}

const selectMapGeneratorsConfig = createSelector(
  [
    selectDataviewInstancesResolvedVisible,
    selectVisibleResources,
    selectMapRulersVisible,
    selectMapControlRuler,
    selectMapAnnotationsVisible,
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
    editingRuler,
    annotations,
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
      editingRuler,
      annotations,
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
    selectMapRulersVisible,
    selectMapControlRuler,
    selectMapAnnotationsVisible,
    selectDebugOptions,
    selectBivariateDataviews,
    selectShowTimeComparison,
    selectTimeRange,
  ],
  (
    dataviews = [],
    resources,
    rulers,
    editingRuler,
    annotations,
    debugOptions,
    bivariateDataviews,
    showTimeComparison,
    timeRange
  ) => {
    // We don't want highlightedTime here to avoid re-computing on mouse timebar hovering
    return getGeneratorsConfig({
      dataviews,
      resources,
      rulers,
      editingRuler,
      annotations,
      debugOptions,
      bivariateDataviews,
      showTimeComparison,
      timeRange,
    })
  }
)

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
                  category: workspace.category || WorkspaceCategory.FishingActivity,
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

export const selectMarineManagerGenerators = createSelector(
  [selectIsMarineManagerLocation, selectMarineManagerDataviewInstanceResolved],
  (isMarineManagerLocation, marineManagerDataviewInstances) => {
    if (isMarineManagerLocation && marineManagerDataviewInstances?.length) {
      const mpaGeneratorConfig = getDataviewsGeneratorConfigs(marineManagerDataviewInstances)
      if (mpaGeneratorConfig) {
        return mpaGeneratorConfig
      }
    }
  }
)

export const selectMapWorkspacesListGenerators = createSelector(
  [selectDefaultBasemapGenerator, selectWorkspacesListGenerator, selectMarineManagerGenerators],
  (basemapGenerator, workspaceGenerator, marineManagerGenerators): AnyGeneratorConfig[] => {
    const generators: AnyGeneratorConfig[] = [basemapGenerator]
    if (marineManagerGenerators?.length) {
      generators.push(...marineManagerGenerators)
    }
    if (workspaceGenerator) generators.push(workspaceGenerator)
    return generators
  }
)

export const selectShowWorkspaceDetail = createSelector(
  [selectIsWorkspaceLocation, selectIsAnyReportLocation, selectIsWorkspaceVesselLocation],
  (isWorkspacelLocation, isReportLocation, isVesselLocation) => {
    return isWorkspacelLocation || isReportLocation || isVesselLocation
  }
)

export const selectMapReportGenerators = createSelector(
  [selectReportBufferFeature, selectReportPreviewBufferFeature],
  (reportBufferFeature, reportPreviewBufferFeature) => {
    const reportGenerators: PolygonsGeneratorConfig[] = []
    if (reportBufferFeature?.geometry) {
      reportGenerators.push({
        type: GeneratorType.Polygons,
        id: REPORT_BUFFER_GENERATOR_ID,
        data: { type: 'FeatureCollection', features: [reportBufferFeature] },
        color: '#FFF',
        visible: true,
        group: Group.OutlinePolygonsHighlighted,
        metadata: {
          interactive: true,
        },
      })
    }
    if (reportPreviewBufferFeature?.geometry) {
      reportGenerators.push({
        type: GeneratorType.Polygons,
        id: PREVIEW_BUFFER_GENERATOR_ID,
        data: { type: 'FeatureCollection', features: [reportPreviewBufferFeature] },
        color: BUFFER_PREVIEW_COLOR,
        visible: true,
        group: Group.OutlinePolygonsHighlighted,
        metadata: {
          interactive: true,
        },
      })
    }
    return reportGenerators
  }
)

export const selectDefaultMapGeneratorsConfig = createSelector(
  [
    selectWorkspaceError,
    selectWorkspaceStatus,
    selectShowWorkspaceDetail,
    selectIsAnyReportLocation,
    selectIsVesselLocation,
    selectDefaultBasemapGenerator,
    selectMapGeneratorsConfig,
    selectMapWorkspacesListGenerators,
    selectMapReportGenerators,
  ],
  (
    workspaceError,
    workspaceStatus,
    showWorkspaceDetail,
    isReportLocation,
    isVesselLocation,
    basemapGenerator,
    workspaceGenerators = [] as AnyGeneratorConfig[],
    workspaceListGenerators,
    mapReportGenerators
  ): AnyGeneratorConfig[] => {
    if (isVesselLocation) {
      return workspaceGenerators
    }
    if (workspaceError.status === 401 || workspaceStatus === AsyncReducerStatus.Loading) {
      return [basemapGenerator]
    }
    if (showWorkspaceDetail) {
      const generators =
        workspaceStatus !== AsyncReducerStatus.Finished ? [basemapGenerator] : workspaceGenerators
      if (isReportLocation) {
        return [...generators, ...mapReportGenerators]
      }
      return generators
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

export const selectDrawEditDataset = createSelector(
  [selectAllDatasets, selectMapDrawingEditId],
  (datasets, datasetId) => {
    return datasets.find((dataset) => dataset.id === datasetId)
  }
)
