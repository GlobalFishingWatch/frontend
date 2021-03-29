import { scaleLinear } from 'd3-scale'
import {
  Resource,
  TrackResourceData,
  DatasetTypes,
  EndpointId,
  DatasetStatus,
  DatasetCategory,
  EnviromentalDatasetConfiguration,
} from '@globalfishingwatch/api-types'
import { GeneratorDataviewConfig, Generators, Group } from '@globalfishingwatch/layer-composer'
import { HeatmapAnimatedGeneratorSublayer } from '@globalfishingwatch/layer-composer/dist/generators/types'
import { resolveDataviewDatasetResource, UrlDataviewInstance } from './resolve-dataviews'

export const MULTILAYER_SEPARATOR = '__'

type DataviewsGeneratorConfigsParams = {
  debug?: boolean
  aggregationMode?: Generators.HeatmapAnimatedMode
  timeRange?: { start: string; end: string }
  highlightedTime?: { start: string; end: string }
}

type DataviewsGeneratorResource = Record<string, Resource>

export function getGeneratorConfig(
  dataview: UrlDataviewInstance,
  params?: DataviewsGeneratorConfigsParams,
  resources?: DataviewsGeneratorResource
) {
  const { highlightedTime } = params || {}
  let generator: GeneratorDataviewConfig = {
    id: dataview.id,
    ...dataview.config,
  }
  if (dataview.config?.type === Generators.Type.Track) {
    // Inject highligtedTime
    if (highlightedTime) {
      generator.highlightedTime = highlightedTime
    }
    // Try to retrieve resource if it exists
    const { url } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Tracks })
    if (url && resources?.[url]) {
      const resource = resources?.[url] as Resource<TrackResourceData>
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
          (dataset.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange || {}
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
    const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
    const tilesEndpoint = dataset?.endpoints?.find(
      (endpoint) => endpoint.id === EndpointId.FourwingsTiles
    )
    const statsEndpoint = dataset?.endpoints?.find(
      (endpoint) => endpoint.id === EndpointId.FourwingsLegend
    )
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
  const { debug = false, aggregationMode = Generators.HeatmapAnimatedMode.Compare, timeRange } =
    params || {}

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

    const visible = sublayers.some(({ visible }) => visible === true)
    const mergedLayer = {
      id: 'mergedAnimatedHeatmap',
      config: {
        type: Generators.Type.HeatmapAnimated,
        sublayers,
        visible,
        mode: aggregationMode,
        debug,
        debugLabels: debug,
        staticStart: timeRange?.start,
        staticEnd: timeRange?.end,
      },
    }
    generatorsConfig.push(mergedLayer)
  }

  generatorsConfig = generatorsConfig.flatMap((dataview) => {
    return getGeneratorConfig(dataview, params, resources)
  })

  return generatorsConfig
}
