import { uniq } from 'es-toolkit'

import type {
  ApiEvent,
  Dataset,
  EnviromentalDatasetConfiguration,
  Resource,
  TrackResourceData} from '@globalfishingwatch/api-types';
import {
  DatasetCategory,
  DatasetStatus,
  DatasetTypes,
  DataviewCategory,
  DataviewType,
  DRAW_DATASET_SOURCE,
  EndpointId,
} from '@globalfishingwatch/api-types'
import {
  getDatasetConfiguration,
  getDatasetConfigurationProperty,
  getDatasetRangeSteps,
  getDatasetsExtent,
} from '@globalfishingwatch/datasets-client'
import type {
  UrlDataviewInstance} from '@globalfishingwatch/dataviews-client';
import {
  isActivityDataview,
  isDetectionsDataview,
  isTrackDataview,
  pickTrackResource,
  resolveDataviewDatasetResource,
  resolveDataviewDatasetResources
} from '@globalfishingwatch/dataviews-client'
import { AggregationOperation, VALUE_MULTIPLIER } from '@globalfishingwatch/fourwings-aggregate'
import type {
  ColorRampsIds,
  HeatmapAnimatedGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,
  HeatmapAnimatedInteractionType,
  Interval} from '@globalfishingwatch/layer-composer'
import {
  DEFAULT_ENVIRONMENT_INTERVALS,
  DEFAULT_HEATMAP_INTERVALS,
  Group,
  HeatmapAnimatedMode
} from '@globalfishingwatch/layer-composer'

const MULTILAYER_SEPARATOR = '__'
const MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID = 'mergedActivityHeatmap'
const MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID = 'mergedDetectionsHeatmap'

export function isMergedAnimatedGenerator(generatorId: string) {
  return (
    generatorId === MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID ||
    generatorId === MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID
  )
}

// TODO Maybe this should rather be in dataset.endpoints[id = 4wings-tiles].query[id = interval].options
// or something similar ??
const getDatasetAvailableIntervals = (dataset?: Dataset) =>
  dataset?.configuration?.intervals as Interval[]

const getDatasetAttribution = (dataset?: Dataset) =>
  dataset?.source && dataset?.source !== 'user' ? dataset?.source : undefined

const getDataviewAvailableIntervals = (
  dataview: UrlDataviewInstance,
  defaultIntervals = DEFAULT_HEATMAP_INTERVALS
): Interval[] => {
  const dataset = dataview.datasets?.find((dataset) => dataset.type === DatasetTypes.Fourwings)
  const dataviewInterval = dataview.config?.interval
  const dataviewIntervals = dataview.config?.intervals
  const datasetIntervals = getDatasetAvailableIntervals(dataset)
  let availableIntervals = defaultIntervals

  if (dataviewInterval) {
    availableIntervals = [dataviewInterval as Interval]
  } else if (dataviewIntervals && dataviewIntervals.length > 0) {
    availableIntervals = dataviewIntervals as Interval[]
  } else if (datasetIntervals && datasetIntervals.length > 0) {
    availableIntervals = datasetIntervals
  }
  return availableIntervals
}

type TimeRange = { start: string; end: string }
export type DataviewsGeneratorConfigsParams = {
  debug?: boolean
  timeRange?: TimeRange
  highlightedTime?: TimeRange
  highlightedEvent?: ApiEvent
  highlightedEvents?: string[]
  heatmapAnimatedMode?: HeatmapAnimatedMode
  customGeneratorMapping?: Partial<Record<DataviewType, DataviewType>>
  singleTrack?: boolean
}

type DataviewsGeneratorResource = Record<string, Resource>

export function getGeneratorConfig(
  dataview: UrlDataviewInstance,
  params?: DataviewsGeneratorConfigsParams,
  resources?: DataviewsGeneratorResource
) {
  const { debug = false, highlightedTime, highlightedEvent, highlightedEvents } = params || {}

  let generator: any = {
    id: dataview.id,
    ...dataview.config,
  }

  switch (dataview.config?.type) {
    case DataviewType.Basemap: {
      return {
        ...generator,
        basemap: dataview.config.basemap || dataview.config.layers?.[0]?.id,
      }
    }
    case DataviewType.TileCluster: {
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
        ...(highlightedEvents && { currentEventId: highlightedEvents[0] }),
      }
    }
    case DataviewType.Track: {
      // Inject highligtedTime
      if (highlightedTime) {
        generator.highlightedTime = highlightedTime
      }
      const dataset = dataview.datasets?.find(
        (dataset) => dataset.type === DatasetTypes.Tracks || DatasetTypes.UserTracks
      )
      const endpointType =
        dataset?.type === DatasetTypes.UserTracks ? EndpointId.UserTracks : EndpointId.Tracks

      let trackResource
      if (endpointType === EndpointId.Tracks) {
        trackResource = pickTrackResource(dataview, endpointType, resources)
      } else {
        const { url } = resolveDataviewDatasetResource(dataview, [DatasetTypes.UserTracks])
        if (resources) trackResource = resources[url] as Resource<TrackResourceData>
      }

      if (trackResource) generator.data = trackResource.data

      if (params?.singleTrack) {
        generator.useOwnColor = true
      }

      const sourceFormat = getDatasetConfigurationProperty({
        dataset,
        property: 'sourceFormat',
      })

      if (
        // When the uploaded dataset was generated from a CSV it needs to be filtered by its point coordinates
        ((dataset?.type === DatasetTypes.UserTracks && sourceFormat === 'CSV') ||
          // but also the tracks datasets from the vessels api can include speed or elevation filters
          dataset?.type === DatasetTypes.Tracks) &&
        dataview.config?.filters
      ) {
        delete generator.filters
        generator.coordinateFilters = dataview.config?.filters
      }

      const eventsResources = resolveDataviewDatasetResources(dataview, DatasetTypes.Events)
      const hasEventData =
        eventsResources?.length && eventsResources.some(({ url }) => resources?.[url]?.data)
      // const { url: eventsUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Events)
      if (hasEventData) {
        const vesselId = dataview.datasetsConfig
          ?.find((dc) => dc.endpoint === EndpointId.Tracks)
          ?.params.find((p) => p.id === 'vesselId')?.value

        // This flatMap will prevent the corresponding generator to memoize correctly,
        // which is handled by the events generator
        const data = eventsResources.flatMap(({ url }) => (url ? resources?.[url]?.data || [] : []))
        const type =
          params?.customGeneratorMapping && params?.customGeneratorMapping.VESSEL_EVENTS
            ? params?.customGeneratorMapping.VESSEL_EVENTS
            : DataviewType.VesselEvents

        const eventsGenerator = {
          id: `${dataview.id}${MULTILAYER_SEPARATOR}vessel_events`,
          vesselId,
          type,
          data,
          track: generator.data,
          color: dataview.config?.color,
          event: dataview.config?.event,
          pointsToSegmentsSwitchLevel: dataview.config?.pointsToSegmentsSwitchLevel,
          showIcons: dataview.config?.showIcons,
          showAuthorizationStatus: dataview.config?.showAuthorizationStatus,
          ...(highlightedEvent && { currentEventId: highlightedEvent.id }),
          ...(highlightedEvents && { currentEventsIds: highlightedEvents }),
        }
        return [generator, eventsGenerator]
      }
      return generator
    }
    case DataviewType.Heatmap: {
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
    case DataviewType.HeatmapStatic: {
      const heatmapDataset = dataview.datasets?.find(
        (dataset) => dataset.type === DatasetTypes.Fourwings
      )
      generator = {
        ...generator,
        maxZoom: dataview.config.maxZoom || 8,
        breaks: dataview.config.breaks,
        filters: dataview.config?.filter,
        datasets: [heatmapDataset?.id],
        metadata: {
          color: dataview?.config?.color,
          group: Group.Heatmap,
          interactive: true,
          legend: {
            label: heatmapDataset?.name,
            unit: heatmapDataset?.unit,
          },
        },
      }
      return generator
    }
    case DataviewType.HeatmapAnimated: {
      const isEnvironmentLayer =
        dataview.category === DataviewCategory.Environment ||
        dataview.category === DataviewCategory.User
      let environmentalConfig: Partial<HeatmapAnimatedGeneratorConfig> = {}
      const dataset = dataview.datasets?.find((dataset) => {
        return dataset.type === DatasetTypes.Fourwings
      })
      if (isEnvironmentLayer) {
        const datasetsIds =
          dataview.config.datasets && dataview.config.datasets?.length > 0
            ? dataview.config.datasets
            : dataview.datasetsConfig?.map((dc) => dc.datasetId)
        const sublayers: HeatmapAnimatedGeneratorSublayer[] = [
          {
            id: generator.id,
            colorRamp: dataview.config?.colorRamp as ColorRampsIds,
            filter: dataview.config?.filter,
            vesselGroups: dataview.config?.['vessel-groups'] as any,
            visible: dataview.config?.visible ?? true,
            breaks: dataview.config?.breaks,
            datasets: datasetsIds!,
            attribution: getDatasetAttribution(dataset),
            legend: {
              label: dataset?.name,
              unit: dataset?.unit,
              color: dataview?.config.color,
            },
          },
        ]

        const { url: tilesAPI } = resolveDataviewDatasetResource(dataview, DatasetTypes.Fourwings)
        const availableIntervals = getDataviewAvailableIntervals(
          dataview,
          DEFAULT_ENVIRONMENT_INTERVALS
        )

        environmentalConfig = {
          sublayers,
          maxZoom: dataview.config.maxZoom || 8,
          mode: HeatmapAnimatedMode.Single,
          tilesAPI,
          dynamicBreaks: dataview.config?.dynamicBreaks || true,
          interactive: true,
          aggregationOperation: (dataview.config?.aggregationOperation ||
            AggregationOperation.Avg) as any,
          breaksMultiplier: dataview.config?.breaksMultiplier || VALUE_MULTIPLIER,
          availableIntervals,
        }
      }

      generator = {
        ...generator,
        ...(!generator.type && { type: DataviewType.HeatmapAnimated }),
        ...environmentalConfig,
      } as any

      // TODO use this instead of hardcoded version of the api endpoint in layer composer
      // const { url: tilesAPI, dataset: heatmapDataset } = resolveDataviewDatasetResource(
      //   dataview,
      //   DatasetTypes.Fourwings
      // )
      // const breaksAPI = heatmapDataset?.endpoints?.find(
      //   (endpoint) => endpoint.id === EndpointId.FourwingsBreaks
      // )?.pathTemplate

      const visible = generator.sublayers?.some(({ visible }: any) => visible === true)
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
    case DataviewType.Context:
    case DataviewType.UserPoints:
    case DataviewType.UserContext: {
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
            attribution: getDatasetAttribution(resolvedDataset),
            datasetId: resolvedDataset.id,
            promoteId: resolvedDataset?.configuration?.idProperty,
            valueProperties: resolvedDataset?.configuration?.valueProperties,
          }
        })
        // Duplicated generators when context dataview have multiple layers
        return tilesUrls.map(
          ({ id, tilesUrl, attribution, datasetId, promoteId, valueProperties }) => ({
            ...generator,
            id: `${dataview.id}${MULTILAYER_SEPARATOR}${id}`,
            layer: id,
            attribution,
            tilesUrl,
            datasetId,
            promoteId,
            valueProperties,
          })
        )
      } else {
        generator.id = dataview.config.layers
          ? `${dataview.id}${MULTILAYER_SEPARATOR}${dataview.config.layers}`
          : dataview.id
        generator.layer = dataview.config.layers
        const { dataset, url } = resolveDataviewDatasetResource(dataview, [
          DatasetTypes.Context,
          DatasetTypes.UserContext,
        ])
        if (dataset?.status !== DatasetStatus.Done) {
          return []
        }
        generator.datasetId = dataset.id
        if (url) {
          generator.tilesUrl =
            dataset.source === DRAW_DATASET_SOURCE
              ? `${url}?cache=${dataset.configuration?.filePath}`
              : url
        }
        if (dataset?.source) {
          generator.attribution = getDatasetAttribution(dataset)
        }
        const config = getDatasetConfiguration(dataset)
        if (config?.includeWithoutEndDate !== undefined) {
          generator.includeWithoutEndDate = config.includeWithoutEndDate
        }
        if (config?.valueProperties) {
          generator.valueProperties = config.valueProperties
        }
        if (config?.idProperty) {
          generator.promoteId = config.idProperty
        }

        const propertyToInclude = (dataset.configuration as EnviromentalDatasetConfiguration)
          ?.propertyToInclude
        if (dataset.category === DatasetCategory.Environment && propertyToInclude) {
          const { min = 0, max } =
            (dataset.configuration as EnviromentalDatasetConfiguration)?.propertyToIncludeRange ||
            {}
          generator.steps = getDatasetRangeSteps({ min, max })
        } else if (
          dataset.category === DatasetCategory.Context &&
          (dataview.config?.type === DataviewType.UserContext ||
            dataview.config?.type === DataviewType.UserPoints)
        ) {
          setGeneratorConfigCircleRadius({ dataset, generator })
          setGeneratorConfigTimeFilter({ dataset, generator })
          setGeneratorConfigPolygonColor({ dataset, generator })
          if (dataset?.configuration?.disableInteraction) {
            generator.disableInteraction = dataset.configuration?.disableInteraction
          }
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

function getMergedHeatmapAnimatedDataview(
  heatmapAnimatedDataviews: UrlDataviewInstance[],
  params: DataviewsGeneratorConfigsParams & { mergedHeatmapGeneratorId: string }
) {
  const {
    heatmapAnimatedMode = HeatmapAnimatedMode.Compare,
    timeRange,
    mergedHeatmapGeneratorId,
  } = params || {}
  const dataviewsFiltered = [] as UrlDataviewInstance[]
  const activitySublayers = heatmapAnimatedDataviews.flatMap((dataview) => {
    const { config, datasetsConfig } = dataview
    if (!dataview?.datasets?.length) {
      console.warn('No datasets found on dataview:', dataview)
      return []
    }
    if (!config || !datasetsConfig || !datasetsConfig.length) {
      return []
    }
    const datasets = config.datasets || datasetsConfig.map((dc) => dc.datasetId)
    const activeDatasets = dataview.datasets.filter((dataset) =>
      dataview?.config?.datasets?.includes(dataset.id)
    )
    const units = uniq(activeDatasets?.map((dataset) => dataset.unit))
    if (units.length > 0 && units.length !== 1) {
      throw new Error('Shouldnt have distinct units for the same heatmap layer')
    }
    const interactionTypes = uniq(
      activeDatasets?.map((dataset) => (dataset.unit === 'detections' ? 'detections' : 'activity'))
    ) as HeatmapAnimatedInteractionType[]
    if (interactionTypes.length > 0 && interactionTypes.length !== 1) {
      throw new Error(
        `Shouldnt have distinct dataset config types for the same heatmap layer: ${interactionTypes.toString()}`
      )
    }
    const interactionType = interactionTypes[0]
    const availableIntervals = getDataviewAvailableIntervals(dataview)

    const sublayer: HeatmapAnimatedGeneratorSublayer = {
      id: dataview.id,
      datasets,
      colorRamp: config.colorRamp as any,
      filter: config.filter,
      vesselGroups: config['vessel-groups'] as any,
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

  const maxZoomLevels = heatmapAnimatedDataviews
    ?.filter(({ config }) => config && config?.maxZoom !== undefined)
    .flatMap(({ config }) => config?.maxZoom as number)

  const mergedActivityDataview = {
    id: mergedHeatmapGeneratorId,
    config: {
      type: DataviewType.HeatmapAnimated,
      sublayers: activitySublayers,
      updateDebounce: true,
      mode: heatmapAnimatedMode,
      // if any of the activity dataviews has a max zoom level defined
      // apply the minimum max zoom level (the most restrictive approach)
      ...(maxZoomLevels &&
        maxZoomLevels.length > 0 && {
          maxZoom: Math.min(...maxZoomLevels),
        }),
    },
  }
  dataviewsFiltered.push(mergedActivityDataview as any)

  // New sublayers as auxiliar activity layers
  const activityWithContextDataviews = heatmapAnimatedDataviews.flatMap((dataview) => {
    const auxiliarLayerActive = dataview.config?.auxiliarLayerActive ?? true
    if (
      dataview.datasetsConfig?.some(
        (d) => d.endpoint === EndpointId.ContextGeojson && auxiliarLayerActive
      )
    ) {
      const datasetsConfig = dataview.datasetsConfig?.flatMap((dc) => {
        if (dc.endpoint !== EndpointId.ContextGeojson) {
          return []
        }
        return {
          ...dc,
          query: [
            ...(dc.query || []),
            { id: 'start-date', value: timeRange?.start || '' },
            { id: 'end-date', value: timeRange?.end || '' },
          ],
        }
      })
      // Prepare a new dataview only for the auxiliar activity layer
      const auxiliarDataview: UrlDataviewInstance = {
        ...dataview,
        datasets: dataview.datasets?.filter((d) => d.type === DatasetTypes.TemporalContext),
        datasetsConfig,
      }
      const { url } = resolveDataviewDatasetResource(auxiliarDataview, DatasetTypes.TemporalContext)
      if (!url) {
        return []
      }
      auxiliarDataview.config = {
        color: dataview.config?.color,
        visible: auxiliarLayerActive,
        type: DataviewType.Polygons,
        url,
      } as any
      return auxiliarDataview
    }
    return []
  })
  dataviewsFiltered.push(...activityWithContextDataviews)
  return dataviewsFiltered
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
  params: DataviewsGeneratorConfigsParams = {},
  resources?: Record<string, Resource>
) {
  const { activityDataviews, detectionDataviews, trackDataviews, otherDataviews } =
    dataviews.reduce(
      (acc, dataview) => {
        if (isActivityDataview(dataview)) {
          acc.activityDataviews.push(dataview)
        } else if (isDetectionsDataview(dataview)) {
          acc.detectionDataviews.push(dataview)
        } else if (isTrackDataview(dataview)) {
          acc.trackDataviews.push(dataview)
        } else {
          acc.otherDataviews.push(dataview)
        }
        return acc
      },
      {
        activityDataviews: [] as UrlDataviewInstance[],
        detectionDataviews: [] as UrlDataviewInstance[],
        trackDataviews: [] as UrlDataviewInstance[],
        otherDataviews: [] as UrlDataviewInstance[],
      }
    )

  // If activity heatmap animated generators found, merge them into one generator with multiple sublayers
  const mergedActivityDataview = activityDataviews?.length
    ? getMergedHeatmapAnimatedDataview(activityDataviews, {
        ...params,
        mergedHeatmapGeneratorId: MERGED_ACTIVITY_ANIMATED_HEATMAP_GENERATOR_ID,
      })
    : []
  const mergedDetectionsDataview = detectionDataviews.length
    ? getMergedHeatmapAnimatedDataview(detectionDataviews, {
        ...params,
        mergedHeatmapGeneratorId: MERGED_DETECTIONS_ANIMATED_HEATMAP_GENERATOR_ID,
      })
    : []
  const generatorsConfig = [
    ...mergedActivityDataview,
    ...mergedDetectionsDataview,
    ...trackDataviews,
    ...otherDataviews,
  ].flatMap((dataview) => {
    return getGeneratorConfig(dataview, params, resources)
  })
  return generatorsConfig
}
function setGeneratorConfigCircleRadius(arg0: { dataset: Dataset; generator: any }) {
  throw new Error('Function not implemented.')
}

function setGeneratorConfigTimeFilter(arg0: { dataset: Dataset; generator: any }) {
  throw new Error('Function not implemented.')
}

function setGeneratorConfigPolygonColor(arg0: { dataset: Dataset; generator: any }) {
  throw new Error('Function not implemented.')
}
