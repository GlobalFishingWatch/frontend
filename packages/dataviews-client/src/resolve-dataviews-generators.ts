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
  Dataset,
} from '@globalfishingwatch/api-types'
import {
  DEFAULT_HEATMAP_INTERVALS,
  GeneratorDataviewConfig,
  Generators,
  Group,
  COLOR_RAMP_DEFAULT_NUM_STEPS,
} from '@globalfishingwatch/layer-composer'
import type {
  ColorRampsIds,
  HeatmapAnimatedGeneratorSublayer,
} from '@globalfishingwatch/layer-composer/dist/generators/types'
import { AggregationOperation, VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import { resolveDataviewDatasetResource, UrlDataviewInstance } from './resolve-dataviews'

export const MULTILAYER_SEPARATOR = '__'
export const MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID = 'mergedAnimatedHeatmap'

const getCommonIntervals = (datasets: Dataset[]) => {
  const interval = DEFAULT_HEATMAP_INTERVALS.find((interval) =>
    datasets.every((dataset) => dataset.configuration?.resolution === interval)
  )
  return (
    interval &&
    DEFAULT_HEATMAP_INTERVALS.slice(DEFAULT_HEATMAP_INTERVALS.findIndex((i) => i === interval))
  )
}

type DataviewsGeneratorConfigsParams = {
  debug?: boolean
  timeRange?: { start: string; end: string }
  highlightedTime?: { start: string; end: string }
  mergedActivityGeneratorId?: string
  heatmapAnimatedMode?: Generators.HeatmapAnimatedMode
}

type DataviewsGeneratorResource = Record<string, Resource>

const getUTCDate = (timestamp: number) => {
  const date = new Date(timestamp)
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes()
    )
  )
}

const getDatasetsExtent = (datasets: Dataset[] | undefined) => {
  const startRanges = datasets?.flatMap((d) =>
    d?.startDate ? new Date(d.startDate).getTime() : []
  )
  const endRanges = datasets?.flatMap((d) => (d?.endDate ? new Date(d.endDate).getTime() : []))
  const extentStart = startRanges?.length
    ? getUTCDate(Math.min(...startRanges)).toISOString()
    : undefined
  const extentEnd = endRanges?.length ? getUTCDate(Math.max(...endRanges)).toISOString() : undefined

  return { extentStart, extentEnd }
}

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
      const trackType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? DatasetTypes.UserTracks
          : DatasetTypes.Tracks
      const { url: trackUrl } = resolveDataviewDatasetResource(dataview, trackType)

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
      const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
      if (isEnvironmentLayer) {
        const datasetsIds =
          dataview.config.datasets || dataview.datasetsConfig?.map((dc) => dc.datasetId)
        const sublayers: Generators.HeatmapAnimatedGeneratorSublayer[] = [
          {
            id: generator.id,
            colorRamp: dataview.config?.colorRamp as ColorRampsIds,
            colorRampWhiteEnd: false,
            visible: dataview.config?.visible ?? true,
            breaks: dataview.config?.breaks,
            datasets: datasetsIds,
            legend: {
              label: dataset?.name,
              unit: dataset?.unit,
              color: dataview?.config.color,
            },
          },
        ]

        environmentalConfig = {
          sublayers,
          maxZoom: 8,
          mode: Generators.HeatmapAnimatedMode.Single,
          aggregationOperation: AggregationOperation.Avg,
          interactive: true,
          breaksMultiplier: dataview.config?.breaksMultiplier || VALUE_MULTIPLIER,
          interval: dataview.config?.interval || 'month',
        }
      }

      generator = {
        ...generator,
        ...environmentalConfig,
      }

      // TODO use this instead of hardcoded version of the api endpoint in layer composer
      // const { url: tilesAPI, dataset: heatmapDataset } = resolveDataviewDatasetResource(
      //   dataview,
      //   DatasetTypes.Fourwings
      // )
      // const breaksAPI = heatmapDataset?.endpoints?.find(
      //   (endpoint) => endpoint.id === EndpointId.FourwingsBreaks
      // )?.pathTemplate

      const visible = generator.sublayers?.some(({ visible }) => visible === true)
      const { extentStart, extentEnd } = getDatasetsExtent(dataview.datasets)

      generator = {
        ...generator,
        visible,
        debug,
        debugLabels: debug,
        // tilesAPI,
        // breaksAPI,
        ...(extentStart && { datasetsStart: extentStart }),
        ...(extentEnd && { datasetsEnd: extentEnd }),
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
          const numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS
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
    const isActivityDataview =
      (d.category === DataviewCategory.Fishing || d.category === DataviewCategory.Presence) &&
      d.config?.type === Generators.Type.HeatmapAnimated
    if (isActivityDataview) {
      activityDataviews.push(d)
    }
    return !isActivityDataview
  })

  // If activity heatmap animated generators found, merge them into one generator with multiple sublayers
  if (activityDataviews.length) {
    const activitySublayers = activityDataviews.flatMap((dataview) => {
      const { config, datasetsConfig } = dataview
      if (!config || !datasetsConfig || !datasetsConfig.length) return []
      const datasets = config.datasets || datasetsConfig.map((dc) => dc.datasetId)
      // TODO Take unit from first dataset -> are we sure activity sublayers always use 'hours'?
      const unit = dataview.datasets?.[0]?.unit
      const sublayer: HeatmapAnimatedGeneratorSublayer = {
        id: dataview.id,
        datasets,
        colorRamp: config.colorRamp as Generators.ColorRampsIds,
        colorRampWhiteEnd: true,
        filter: config.filter,
        visible: config.visible,
        legend: {
          label: dataview.name,
          unit,
          color: dataview?.config?.color,
        },
      }

      return sublayer
    })
    const intervalDatasets = activityDataviews
      .flatMap((dataview) => dataview.datasets || [])
      .filter((d) => d?.configuration?.resolution)
    const interval = getCommonIntervals(intervalDatasets)

    const mergedActivityDataview = {
      id: params.mergedActivityGeneratorId || MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
      config: {
        type: Generators.Type.HeatmapAnimated,
        sublayers: activitySublayers,
        mode: heatmapAnimatedMode,
        ...(interval && { interval }),
      },
    }
    dataviewsFiltered.push(mergedActivityDataview)
  }

  const generatorsConfig = dataviewsFiltered.flatMap((dataview) => {
    return getGeneratorConfig(dataview, params, resources)
  })

  return generatorsConfig
}
