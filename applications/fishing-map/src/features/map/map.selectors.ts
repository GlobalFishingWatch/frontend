import { createSelector } from '@reduxjs/toolkit'
import { scaleLinear } from 'd3-scale'
import { CircleLayer } from '@globalfishingwatch/mapbox-gl'
import GFWAPI from '@globalfishingwatch/api-client'
import {
  AnyGeneratorConfig,
  HeatmapAnimatedGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
  HeatmapAnimatedMode,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { GeneratorDataviewConfig, Generators, Group } from '@globalfishingwatch/layer-composer'
import {
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
  EndpointId,
  EnviromentalDatasetConfiguration,
} from '@globalfishingwatch/api-types'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { UrlDataviewInstance } from 'types'
import {
  selectDataviewInstancesResolved,
  selectWorkspaceError,
} from 'features/workspace/workspace.selectors'
import { selectCurrentWorkspacesList } from 'features/workspaces-list/workspaces-list.selectors'
import { Resource, selectResources, TrackResourceData } from 'features/resources/resources.slice'
import { selectDebugOptions } from 'features/debug/debug.slice'
import { selectRulers } from 'features/map/controls/rulers.slice'
import { selectHighlightedTime, selectStaticTime } from 'features/timebar/timebar.slice'
import { selectViewport, selectTimeRange, selectBivariate } from 'features/app/app.selectors'
import { isWorkspaceLocation } from 'routes/routes.selectors'
import { resolveDataviewDatasetResource } from 'features/resources/resources.selectors'
import { MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID } from 'data/config'

export const MULTILAYER_SEPARATOR = '__'

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
        const { config, datasetsConfig } = dataview
        if (!config || !datasetsConfig || !datasetsConfig.length) return []
        const datasets = config.datasets || datasetsConfig.map((dc: any) => dc.datasetId)
        const sublayer: HeatmapAnimatedGeneratorSublayer = {
          id: dataview.id,
          datasets,
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
      const visible = sublayers.some(({ visible }) => visible === true)
      const mergedLayer = {
        id: MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
        config: {
          type: Generators.Type.HeatmapAnimated,
          sublayers,
          visible,
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
      let generator: GeneratorDataviewConfig = {
        id: dataview.id,
        ...dataview.config,
      }

      if (dataview.config?.type === Generators.Type.Track) {
        // Inject highligtedTime
        generator.highlightedTime = highlightedTime
        // Try to retrieve resource if it exists
        const { url } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Tracks })
        if (url && resources[url]) {
          const resource = resources[url] as Resource<TrackResourceData>
          generator.data = resource.data
        }
      } else if (
        dataview.config?.type === Generators.Type.Context ||
        dataview.config?.type === Generators.Type.UserContext
      ) {
        if (Array.isArray(dataview.config.layers)) {
          const tilesUrls = dataview.config.layers?.flatMap(({ id, dataset }) => {
            const { dataset: resolvedDataset, url } = resolveDataviewDatasetResource(dataview, {
              id: dataset,
            })
            if (!url || resolvedDataset?.status !== DatasetStatus.Done) return []
            return { id, tilesUrl: url, attribution: resolvedDataset?.source }
          })
          // Duplicated generators when context dataview have multiple layers
          return tilesUrls.map(({ id, tilesUrl, attribution }) => ({
            ...generator,
            id: `${dataview.id}${MULTILAYER_SEPARATOR}${id}`,
            layer: id,
            attribution,
            tilesUrl,
          }))
        } else {
          generator.id = dataview.config.layers
            ? `${dataview.id}${MULTILAYER_SEPARATOR}${dataview.config.layers}`
            : dataview.id
          generator.layer = dataview.config.layers
          const { dataset, url } = resolveDataviewDatasetResource(dataview, {
            type: DatasetTypes.Context,
          })
          if (dataset?.status !== DatasetStatus.Done) {
            return []
          }
          if (url) {
            generator.tilesUrl = url
          }
          if (dataset?.source) {
            generator.attribution = dataset.source
          }
          if (dataset.category === DatasetCategory.Environment) {
            const { min, max } =
              (dataset.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange ||
              {}
            const rampScale = scaleLinear().range([min, max]).domain([0, 1])
            const numSteps = 8
            const steps = [...Array(numSteps)]
              .map((_, i) => parseFloat((i / (numSteps - 1)).toFixed(2)))
              .map((value) => parseFloat((rampScale(value) as number).toFixed(3)))
            generator.steps = steps
          }
        }
        if (!generator.tilesUrl) {
          console.warn('Missing tiles url for dataview', dataview)
          return []
        }
      } else if (dataview.config?.type === Generators.Type.Heatmap) {
        // TODO: use the getGeneratorConfig package function here
        const dataset = dataview.datasets?.find(
          (dataset) => dataset.type === DatasetTypes.Fourwings
        )
        const tilesEndpoint = dataset?.endpoints?.find(
          (endpoint) => endpoint.id === EndpointId.FourwingsTiles
        )
        const statsEndpoint = dataset?.endpoints?.find(
          (endpoint) => endpoint.id === EndpointId.FourwingsLegend
        )
        // console.log(dataview.config.steps)
        generator = {
          ...generator,
          maxZoom: 8,
          fetchStats: !dataview.config.steps,
          datasets: [dataset?.id],
          tilesUrl: tilesEndpoint?.pathTemplate,
          statsUrl: statsEndpoint?.pathTemplate,
          metadata: {
            color: dataview?.config?.color,
            group: Group.OutlinePolygonsBackground,
            interactive: true,
            legend: {
              label: dataset?.name,
              unit: dataset?.unit,
            },
          },
        }
      } else if (dataview.config?.type === Generators.Type.TileCluster) {
        const { dataset, url } = resolveDataviewDatasetResource(dataview, {
          type: DatasetTypes.Events,
        })
        if (!dataset || !url) {
          console.warn('No dataset config for TileCluster generator', dataview)
          return []
        }
        generator.tilesUrl = url
      }
      return generator
    })

    const rulersConfig = {
      type: Generators.Type.Rulers,
      id: 'rulers',
      data: rulers,
    }

    const generators = [...generatorsConfig.reverse(), rulersConfig] as AnyGeneratorConfig[]

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
      const gen: HeatmapAnimatedGeneratorConfig = {
        id: 'sea-surface-temp-palau',
        type: Generators.Type.HeatmapAnimated,
        sublayers: [sublayer],
        mode: HeatmapAnimatedMode.Single,
        interactive: true,
        interval: 'month',
        tilesAPI: 'https://dev-api-fourwings-tiler-jzzp2ui3wq-uc.a.run.app/v1',
        aggregationOperation: AggregationOperation.Avg,
        breaksMultiplier: 1,
      }
      return gen
    })

    return generators_ as AnyGeneratorConfig[]
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
