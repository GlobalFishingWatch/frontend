import { scaleLinear } from 'd3-scale'
import {
  Resource,
  TrackResourceData,
  DatasetTypes,
  EndpointId,
  DatasetStatus,
  DatasetCategory,
  EnviromentalDatasetConfiguration,
  DataviewCategory,
} from '@globalfishingwatch/api-types'
import { GeneratorDataviewConfig, Generators, Group } from '@globalfishingwatch/layer-composer'
import type {
  ColorRampsIds,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AggregationOperation } from '@globalfishingwatch/fourwings-aggregate'
import { resolveDataviewDatasetResource, UrlDataviewInstance } from './resolve-dataviews'

export const MULTILAYER_SEPARATOR = '__'
export const MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID = 'mergedAnimatedHeatmap'

type DataviewsGeneratorConfigsParams = {
  debug?: boolean
  timeRange?: { start: string; end: string }
  highlightedTime?: { start: string; end: string }
  mergedActivityGeneratorId?: string
  heatmapAnimatedMode?: Generators.HeatmapAnimatedMode
}

type DataviewsGeneratorResource = Record<string, Resource>

export function getGeneratorConfig(
  dataview: UrlDataviewInstance,
  params?: DataviewsGeneratorConfigsParams,
  resources?: DataviewsGeneratorResource
) {
  const { debug = false, timeRange, highlightedTime } = params || {}

  let generator: GeneratorDataviewConfig = {
    id: dataview.id,
    ...dataview.config,
  }

  switch (dataview.config?.type) {
    case Generators.Type.TileCluster: {
      const { dataset: tileClusterDataset, url: tileClusterUrl } = resolveDataviewDatasetResource(
        dataview,
        DatasetTypes.Events
      )
      if (!tileClusterDataset || !tileClusterUrl) {
        console.warn('No dataset config for TileCluster generator', dataview)
        return []
      }
      generator.tilesUrl = tileClusterUrl
      break
    }
    case Generators.Type.Track: {
      // Inject highligtedTime
      if (highlightedTime) {
        generator.highlightedTime = highlightedTime
      }
      // Try to retrieve resource if it exists
      const { url: trackUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
      if (trackUrl && resources?.[trackUrl]) {
        const resource = resources?.[trackUrl] as Resource<TrackResourceData>
        generator.data = resource.data
      }
      break
    }
    case Generators.Type.Heatmap: {
      const heatmapDataset = dataview.datasets?.find(
        (dataset) => dataset.type === DatasetTypes.Fourwings
      )
      const tilesEndpoint = heatmapDataset?.endpoints?.find(
        (endpoint) => endpoint.id === EndpointId.FourwingsTiles
      )
      const statsEndpoint = heatmapDataset?.endpoints?.find(
        (endpoint) => endpoint.id === EndpointId.FourwingsLegend
      )
      generator = {
        ...generator,
        maxZoom: 8,
        fetchStats: !dataview.config.steps,
        datasets: [heatmapDataset?.id],
        tilesUrl: tilesEndpoint?.pathTemplate,
        statsUrl: statsEndpoint?.pathTemplate,
        metadata: {
          color: dataview?.config?.color,
          group: Group.OutlinePolygonsBackground,
          interactive: true,
          legend: {
            label: heatmapDataset?.name,
            unit: heatmapDataset?.unit,
          },
        },
      }
      break
    }
    case Generators.Type.HeatmapAnimated: {
      const isEnvironmentLayer = dataview.category === DataviewCategory.Environment
      let environmentalConfig: Partial<Generators.HeatmapAnimatedGeneratorConfig> = {}
      if (isEnvironmentLayer) {
        // TODO not exactly sure how to retrieve dataset properly
        const dataset = dataview?.datasets && dataview?.datasets[0]
        const datasetsIds =
          dataview.config.datasets || dataview.datasetsConfig?.map((dc) => dc.datasetId)
        const sublayers: Generators.HeatmapAnimatedGeneratorSublayer[] = [
          {
            id: generator.id,
            colorRamp: dataview.config?.colorRamp as ColorRampsIds,
            visible: dataview.config?.visible ?? true,
            breaks: dataview.config?.breaks,
            datasets: datasetsIds,
          },
        ]

        environmentalConfig = {
          sublayers,
          mode: Generators.HeatmapAnimatedMode.Single,
          aggregationOperation: AggregationOperation.Avg,
          interactive: true,
          interval: dataview.config?.interval || 'month',
          breaksMultiplier: dataview.config?.breaskMultiplier || 1,
          // TODO remove and grab from dataset config here
          tilesAPI: 'https://dev-api-fourwings-tiler-jzzp2ui3wq-uc.a.run.app/v1',
          metadata: {
            legend: {
              label: dataset?.name,
              unit: dataset?.unit,
            },
          },
        }
      }

      generator = {
        ...generator,
        ...environmentalConfig,
      }

      const visible = generator.sublayers?.some(({ visible }) => visible === true)
      generator = {
        ...generator,
        visible,
        debug,
        debugLabels: debug,
        staticStart: timeRange?.start,
        staticEnd: timeRange?.end,
      }
      break
    }
    case Generators.Type.Context:
    case Generators.Type.UserContext: {
      if (Array.isArray(dataview.config.layers)) {
        const tilesUrls = dataview.config.layers?.flatMap(({ id, dataset }) => {
          const { dataset: resolvedDataset, url } = resolveDataviewDatasetResource(
            dataview,
            dataset
          )
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
        const { dataset, url } = resolveDataviewDatasetResource(dataview, DatasetTypes.Context)
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
            .map((_, i) => parseFloat((i / (numSteps - 1))?.toFixed(2)))
            .map((value) => parseFloat((rampScale(value) as number)?.toFixed(3)))
          generator.steps = steps
        }
      }
      if (!generator.tilesUrl) {
        console.warn('Missing tiles url for dataview', dataview)
        return []
      }
      break
    }
  }
  return generator
}

/**
 * Generates generator configs to be consumed by LayerComposer, based on the list of dataviews provided,
 * and associates Resources to them when needed for the generator (ie tracks data for a track generator).
 * If workspace is provided, it will only use the dataviews specified in the Workspace,
 * and apply any viewParams or datasetParams from it.
 * @param dataviews
 * @param resources
 * @param options
 */

export function getDataviewsGeneratorConfigs(
  dataviews: UrlDataviewInstance[],
  params: DataviewsGeneratorConfigsParams,
  resources?: Record<string, Resource>
) {
  const { heatmapAnimatedMode = Generators.HeatmapAnimatedMode.Compare } = params || {}

  const activityDataviews: UrlDataviewInstance[] = []

  // Collect heatmap animated generators and filter them out from main dataview list
  const dataviewsFiltered = dataviews.filter((d) => {
    const isActivityDataview = d.category === DataviewCategory.Activity
    if (isActivityDataview) {
      activityDataviews.push(d)
    }
    return !isActivityDataview
  })

  // If heatmap animated generators found, merge them into one generator with multiple sublayers
  if (activityDataviews.length) {
    const activitySublayers = activityDataviews.flatMap((dataview) => {
      const { config, datasetsConfig } = dataview
      if (!config || !datasetsConfig || !datasetsConfig.length) return []
      const datasets = config.datasets || datasetsConfig.map((dc) => dc.datasetId)
      const sublayer: HeatmapAnimatedGeneratorSublayer = {
        id: dataview.id,
        datasets,
        colorRamp: config.colorRamp as Generators.ColorRampsIds,
        filter: config.filter,
        visible: config.visible,
      }

      return sublayer
    })

    const mergedActivityDataview = {
      id: params.mergedActivityGeneratorId || MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
      config: {
        type: Generators.Type.HeatmapAnimated,
        sublayers: activitySublayers,
        mode: heatmapAnimatedMode,
      },
    }
    dataviewsFiltered.push(mergedActivityDataview)
  }

  const generatorsConfig = dataviewsFiltered.flatMap((dataview) => {
    return getGeneratorConfig(dataview, params, resources)
  })

  return generatorsConfig
}
