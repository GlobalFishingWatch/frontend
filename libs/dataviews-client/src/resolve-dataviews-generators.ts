import { scaleLinear } from 'd3-scale'
import { uniq } from 'lodash'
import {
  Resource,
  DatasetTypes,
  EndpointId,
  DatasetStatus,
  DatasetCategory,
  EnviromentalDatasetConfiguration,
  DataviewCategory,
  Dataset,
  ApiEvent,
} from '@globalfishingwatch/api-types'
import {
  DEFAULT_HEATMAP_INTERVALS,
  DEFAULT_ENVIRONMENT_INTERVALS,
  GeneratorDataviewConfig,
  GeneratorType,
  Group,
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HeatmapAnimatedMode,
  HeatmapAnimatedGeneratorConfig,
  Interval,
} from '@globalfishingwatch/layer-composer'
import type {
  ColorRampsIds,
  HeatmapAnimatedGeneratorSublayer,
  HeatmapAnimatedInteractionType,
} from '@globalfishingwatch/layer-composer'
import { AggregationOperation, VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import {
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources,
  UrlDataviewInstance,
} from './resolve-dataviews'
import { pickTrackResource } from './resources'

export const MULTILAYER_SEPARATOR = '__'
export const MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID = 'mergedAnimatedHeatmap'

// TODO Maybe this should rather be in dataset.endpoints[id = 4wings-tiles].query[id = interval].options
// or something similar ??
const getDatasetAvailableIntervals = (dataset?: Dataset) =>
  dataset?.configuration?.intervals as Interval[]

type DataviewsGeneratorConfigsParams = {
  debug?: boolean
  highlightedTime?: { start: string; end: string }
  highlightedEvent?: ApiEvent
  mergedActivityGeneratorId?: string
  heatmapAnimatedMode?: HeatmapAnimatedMode
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
  const { debug = false, highlightedTime, highlightedEvent } = params || {}

  let generator: GeneratorDataviewConfig = {
    id: dataview.id,
    ...dataview.config,
  }

  switch (dataview.config?.type) {
    case GeneratorType.TileCluster: {
      const { dataset: tileClusterDataset, url: tileClusterUrl } = resolveDataviewDatasetResource(
        dataview,
        DatasetTypes.Events
      )
      if (!tileClusterDataset || !tileClusterUrl) {
        console.warn('No dataset config for TileCluster generator', dataview)
        return []
      }
      generator.tilesUrl = tileClusterUrl
      return {
        ...generator,
        ...(highlightedEvent && { currentEventId: highlightedEvent.id }),
      }
    }
    case GeneratorType.Track: {
      // Inject highligtedTime
      if (highlightedTime) {
        generator.highlightedTime = highlightedTime
      }

      const endpointType =
        dataview.datasets && dataview.datasets?.[0]?.type === DatasetTypes.UserTracks
          ? EndpointId.UserTracks
          : EndpointId.Tracks

      const trackResource = pickTrackResource(dataview, endpointType, resources)

      if (trackResource) generator.data = trackResource.data

      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      const hasEventData =
        eventsResources?.length && eventsResources.some(({ url }) => resources?.[url]?.data)
      // const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      if (hasEventData) {
        // TODO This flatMap will prevent the corresponding generator to memoize correctly
        const data = eventsResources.flatMap(({ url }) => (url ? resources?.[url]?.data || [] : []))
        const eventsGenerator = {
          id: `${dataview.id}${MULTILAYER_SEPARATOR}vessel_events`,
          event: dataview.config?.event,
          pointsToSegmentsSwitchLevel: dataview.config?.pointsToSegmentsSwitchLevel,
          type: GeneratorType.VesselEvents,
          showIcons: dataview.config?.showIcons,
          showAuthorizationStatus: dataview.config?.showAuthorizationStatus,
          data: data,
          color: dataview.config?.color,
          track: generator.data,
          ...(highlightedEvent && { currentEventId: highlightedEvent.id }),
        }
        return [generator, eventsGenerator]
      }
      return generator
    }
    case GeneratorType.Heatmap: {
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
        maxZoom: dataview.config.maxZoom || 8,
        fetchStats: !dataview.config.breaks,
        static: dataview.config.static || false,
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
      return generator
    }
    case GeneratorType.HeatmapAnimated: {
      const isEnvironmentLayer = dataview.category === DataviewCategory.Environment
      let environmentalConfig: Partial<HeatmapAnimatedGeneratorConfig> = {}
      const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
      if (isEnvironmentLayer) {
        const datasetsIds =
          dataview.config.datasets || dataview.datasetsConfig?.map((dc) => dc.datasetId)
        const sublayers: HeatmapAnimatedGeneratorSublayer[] = [
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

        const { url: tilesAPI } = resolveDataviewDatasetResource(dataview, DatasetTypes.Fourwings)
        const availableIntervals =
          (dataview.config?.interval
            ? [dataview.config?.interval]
            : getDatasetAvailableIntervals(dataset)) || DEFAULT_ENVIRONMENT_INTERVALS

        environmentalConfig = {
          sublayers,
          maxZoom: 8,
          mode: HeatmapAnimatedMode.Single,
          tilesAPI,
          dynamicBreaks: dataview.config?.dynamicBreaks || true,
          interactive: true,
          aggregationOperation: dataview.config?.aggregationOperation || AggregationOperation.Avg,
          breaksMultiplier: dataview.config?.breaksMultiplier || VALUE_MULTIPLIER,
          availableIntervals,
        }
      }

      generator = {
        ...generator,
        ...(!generator.type && { type: GeneratorType.HeatmapAnimated }),
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
      return generator
    }
    case GeneratorType.Context:
    case GeneratorType.UserPoints:
    case GeneratorType.UserContext: {
      if (Array.isArray(dataview.config.layers)) {
        const tilesUrls = dataview.config.layers?.flatMap(({ id, dataset }) => {
          const { dataset: resolvedDataset, url } = resolveDataviewDatasetResource(
            dataview,
            dataset
          )
          if (!url || resolvedDataset?.status !== DatasetStatus.Done) return []
          return {
            id,
            tilesUrl: url,
            attribution: resolvedDataset?.source,
            datasetId: resolvedDataset.id,
          }
        })
        // Duplicated generators when context dataview have multiple layers
        return tilesUrls.map(({ id, tilesUrl, attribution, datasetId }) => ({
          ...generator,
          id: `${dataview.id}${MULTILAYER_SEPARATOR}${id}`,
          layer: id,
          attribution,
          tilesUrl,
          datasetId,
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
        generator.datasetId = dataset.id
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
        } else if (
          dataset.category === DatasetCategory.Context &&
          (dataview.config?.type === GeneratorType.UserContext ||
            dataview.config?.type === GeneratorType.UserPoints)
        ) {
          generator.disableInteraction = dataset.configuration?.disableInteraction
        }
      }
      if (!generator.tilesUrl) {
        console.warn('Missing tiles url for dataview', dataview)
        return []
      }
      return generator
    }
    default: {
      return generator
    }
  }
}

export function isActivityDataview(dataview: UrlDataviewInstance) {
  return (
    (dataview.category === DataviewCategory.Fishing ||
      dataview.category === DataviewCategory.Presence) &&
    dataview.config?.type === GeneratorType.HeatmapAnimated
  )
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
  const { heatmapAnimatedMode = HeatmapAnimatedMode.Compare } = params || {}

  const activityDataviews: UrlDataviewInstance[] = []

  // Collect heatmap animated generators and filter them out from main dataview list
  const dataviewsFiltered = dataviews.filter((d) => {
    const activityDataview = isActivityDataview(d)
    if (activityDataview) {
      activityDataviews.push(d)
    }
    return !activityDataview
  })

  // If activity heatmap animated generators found, merge them into one generator with multiple sublayers
  if (activityDataviews.length) {
    const activitySublayers = activityDataviews.flatMap((dataview) => {
      const { config, datasetsConfig } = dataview
      if (!config || !datasetsConfig || !datasetsConfig.length || !dataview?.datasets?.length) {
        return []
      }
      const datasets = config.datasets || datasetsConfig.map((dc) => dc.datasetId)
      if (!dataview.datasets?.length) return []
      const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)

      const activeDatasets = dataview.datasets.filter((dataset) =>
        dataview?.config?.datasets.includes(dataset.id)
      )
      const units = uniq(activeDatasets?.map((dataset) => dataset.unit))
      if (units.length > 0 && units.length !== 1) {
        throw new Error('Shouldnt have distinct units for the same heatmap layer')
      }
      const interactionTypes = uniq(
        dataview.datasets?.map((dataset) => dataset.configuration?.type || 'fishing-effort')
      ) as HeatmapAnimatedInteractionType[]
      if (interactionTypes.length > 0 && interactionTypes.length !== 1) {
        throw new Error(
          `Shouldnt have distinct dataset config types for the same heatmap layer: ${interactionTypes.toString()}`
        )
      }
      const interactionType =
        // Some VMS presence layers have interaction, this is the way of
        // allowing it but keeping it disabled in the global one
        interactionTypes[0] === 'presence'
          ? dataview?.config?.presenceInteraction
            ? (`presence-${dataview?.config?.presenceInteraction}` as HeatmapAnimatedInteractionType)
            : 'presence'
          : (interactionTypes[0] as HeatmapAnimatedInteractionType)

      const availableIntervals = getDatasetAvailableIntervals(dataset) || DEFAULT_HEATMAP_INTERVALS

      const sublayer: HeatmapAnimatedGeneratorSublayer = {
        id: dataview.id,
        datasets,
        colorRamp: config.colorRamp as ColorRampsIds,
        colorRampWhiteEnd: true,
        filter: config.filter,
        visible: config.visible,
        legend: {
          label: dataview.name,
          unit: units[0],
          color: dataview?.config?.color,
        },
        interactionType,
        availableIntervals,
      }

      return sublayer
    })

    const mergedActivityDataview = {
      id: params.mergedActivityGeneratorId || MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
      config: {
        type: GeneratorType.HeatmapAnimated,
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
