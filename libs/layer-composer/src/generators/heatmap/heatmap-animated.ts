import { DateTime } from 'luxon'
import memoizeOne from 'memoize-one'

import type {
  TileAggregationComparisonDateRange,  TileAggregationDateRange,
  TileAggregationSourceParams,
  TileAggregationSourceParamsSerialized} from '@globalfishingwatch/fourwings-aggregate';
import {
  AggregationOperation,
  GeomType,
  VALUE_MULTIPLIER
} from '@globalfishingwatch/fourwings-aggregate'

import { API_GATEWAY, API_GATEWAY_VERSION } from '../../config'
import { Group } from '../../types'
import { isUrlAbsolute, memoizeByLayerId, memoizeCache } from '../../utils'
import type {
  HeatmapAnimatedGeneratorConfig,
  HeatmapAnimatedGeneratorSublayer,  MergedGeneratorConfig} from '../types';
import {
  GeneratorType,
  HeatmapAnimatedMode
} from '../types'
import { toURLArray } from '../utils'

import getBlobLayer from './modes/blob'
import getExtrudedLayer from './modes/extruded'
import getGriddedLayers from './modes/gridded'
import griddedTimeCompare from './modes/gridded-time-compare'
import type { Breaks, FetchBreaksParams } from './util/fetch-breaks';
import fetchBreaks, { getBreaksCacheKey } from './util/fetch-breaks'
import getLegends, { getSublayersBreaks } from './util/get-legends'
import { getTimeChunksInterval } from './util/get-time-chunks-interval'
import type { TimeChunk, TimeChunks} from './util/time-chunks';
import { getActiveTimeChunks, pickActiveTimeChunk } from './util/time-chunks'
import { API_ENDPOINTS, HEATMAP_DEFAULT_MAX_ZOOM, HEATMAP_MODE_COMBINATION } from './config'
import { getSourceId } from './util'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

export const SQUARE_GRID_MODES = [
  HeatmapAnimatedMode.Compare,
  HeatmapAnimatedMode.Bivariate,
  HeatmapAnimatedMode.Single,
]

const INTERACTION_MODES = [...SQUARE_GRID_MODES, HeatmapAnimatedMode.TimeCompare]

const getTilesUrl = (config: HeatmapAnimatedGeneratorConfig): string => {
  if (config.tilesAPI) {
    return isUrlAbsolute(config.tilesAPI) ? config.tilesAPI : API_GATEWAY + config.tilesAPI
  }
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/${API_ENDPOINTS.tiles}`
}

const getSubLayersDatasets = (
  sublayers: HeatmapAnimatedGeneratorSublayer[],
  merge = false
): string[] => {
  const sublayersDatasets = sublayers?.map((sublayer) => {
    const sublayerDatasets = [...sublayer.datasets]
    return sublayerDatasets.sort((a, b) => a.localeCompare(b)).join(',')
  })
  return merge ? [sublayersDatasets.join(',')] : sublayersDatasets
}

const getSubLayersFilters = (
  sublayers: HeatmapAnimatedGeneratorSublayer[],
  merge = false
): string[] => {
  const sublayersFilters = sublayers.map((sublayer) => sublayer.filter || '')
  if (!merge) return sublayersFilters
  if (!sublayersFilters.every((f) => f === sublayersFilters[0])) {
    throw new Error('Distinct sublayer filters not supported yet with time compare mode')
  }
  return [sublayersFilters[0]]
}

const getSubLayersVesselGroups = (
  sublayers: HeatmapAnimatedGeneratorSublayer[],
  merge = false
): string[] => {
  const sublayersVesselGroups = sublayers.map((sublayer) => sublayer.vesselGroups || '')
  return sublayersVesselGroups
}

const getSubLayerVisible = (sublayer: HeatmapAnimatedGeneratorSublayer) =>
  sublayer.visible === false ? false : true
const getSubLayersVisible = (config: HeatmapAnimatedGeneratorConfig) =>
  config.mode === HeatmapAnimatedMode.TimeCompare
    ? [true, true]
    : config.sublayers?.map(getSubLayerVisible)

const serializeBaseSourceParams = (params: TileAggregationSourceParams) => {
  const serialized: TileAggregationSourceParamsSerialized = {
    id: params.id,
    aggregationOperation: params.aggregationOperation,
    sublayerCombinationMode: params.sublayerCombinationMode,
    geomType: params.geomType,
    interval: params.interval,
    singleFrame: params.singleFrame ? 'true' : 'false',
    datasets: toURLArray('datasets', params.datasets),
    ...(params.filters?.length && {
      filters: toURLArray('filters', params.filters),
    }),
    ...(params['vessel-groups']?.length && {
      'vessel-groups': toURLArray('datasets', params['vessel-groups']),
    }),
    delta: params.delta.toString(),
    quantizeOffset: params.quantizeOffset.toString(),
    sublayerVisibility: JSON.stringify(params.sublayerVisibility),
    sublayerCount: params.sublayerCount.toString(),
    interactive: params.interactive ? 'true' : 'false',
  }
  if (params['vessel-groups']) {
    serialized['vessel-groups'] = toURLArray('vessel-groups', params['vessel-groups'])
  }
  if (params['date-range']) {
    serialized['date-range'] = params['date-range'].join(',')
  }
  if (params['comparison-range']) {
    serialized['comparison-range'] = params['comparison-range'].join(',')
  }
  if (params.sublayerBreaks) {
    serialized.sublayerBreaks = JSON.stringify(params.sublayerBreaks)
  }

  return serialized
}

const getFinalurl = (
  config: GlobalHeatmapAnimatedGeneratorConfig,
  params: TileAggregationSourceParamsSerialized
) => {
  const { datasets, filters, 'vessel-groups': vesselGroups, ...rest } = params
  const finalUrlParams = {
    ...rest,
    format: 'INTARRAY',
    'temporal-aggregation': params.singleFrame === 'true',
    // We want proxy active as default when api tiles auth is required
    proxy: params.proxy !== 'false',
  }

  const finalUrlParamsArr = Object.entries(finalUrlParams)
    .filter(([_, value]) => {
      return value !== undefined && value !== null && value !== 'undefined' && value !== 'null'
    })
    .map(([key, value]) => {
      return `${key}=${value}`
    })

  if (datasets) {
    finalUrlParamsArr.push(datasets)
  }
  if (filters) {
    finalUrlParamsArr.push(filters)
  }
  if (vesselGroups) {
    finalUrlParamsArr.push(vesselGroups)
  }
  const tilesUrl = getTilesUrl(config).replace(/{{/g, '{').replace(/}}/g, '}')
  const hasQueryParams = new URL(tilesUrl)?.searchParams.size > 0
  const finalUrlStr = `${tilesUrl}${hasQueryParams ? '&' : '?'}${finalUrlParamsArr.join('&')}`
  return decodeURI(finalUrlStr)
}

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  mode: HeatmapAnimatedMode.Compare,
  datasetsStart: '2012-01-01T00:00:00.000Z',
  datasetsEnd: DateTime.now().toUTC().toISO() as string,
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  interactive: true,
  aggregationOperation: AggregationOperation.Sum,
  breaksMultiplier: VALUE_MULTIPLIER,
}

class HeatmapAnimatedGenerator {
  type = GeneratorType.HeatmapAnimated
  breaksCache: Record<
    string,
    {
      loading: boolean
      error: boolean
      breaks?: Breaks
    }
  > = {}
  configCache: Record<string, GlobalHeatmapAnimatedGeneratorConfig> = {}

  _getStyleSources = (
    config: GlobalHeatmapAnimatedGeneratorConfig,
    timeChunks: TimeChunks,
    breaks: Breaks | undefined
  ) => {
    if (!config.start || !config.end || !config.sublayers) {
      throw new Error(
        `Heatmap generator must specify start, end and sublayers parameters in ${config}`
      )
    }

    if (!breaks) {
      return []
    }

    const datasets = getSubLayersDatasets(
      config.sublayers,
      config.mode === HeatmapAnimatedMode.TimeCompare
    )

    const filters = getSubLayersFilters(
      config.sublayers,
      config.mode === HeatmapAnimatedMode.TimeCompare
    )

    const attributtion = config.sublayers
      ?.flatMap((sublayer) => (sublayer.visible ? sublayer.attribution || [] : []))
      .join(',')

    // TODO should be an array per sublayer?
    const vesselGroups = getSubLayersVesselGroups(config.sublayers)

    const visible = getSubLayersVisible(config)
    const geomType = config.mode === HeatmapAnimatedMode.Blob ? GeomType.point : GeomType.rectangle
    const interactiveSource = config.interactive && INTERACTION_MODES.includes(config.mode)
    const sublayerCombinationMode = HEATMAP_MODE_COMBINATION[config.mode]
    const sublayerBreaks = breaks?.map((sublayerBreaks) =>
      sublayerBreaks.map((b) => b * config.breaksMultiplier)
    )

    const sourceTimeChunks =
      config.mode === HeatmapAnimatedMode.TimeCompare
        ? [pickActiveTimeChunk(timeChunks)]
        : timeChunks.chunks

    const sources = sourceTimeChunks.flatMap((timeChunk: TimeChunk) => {
      const id = getSourceId(config.id, timeChunk)
      const baseSourceParams: TileAggregationSourceParams = {
        id,
        singleFrame: false,
        geomType,
        // Set a minimum of 1 to avoid empty frames. See error thrown in getStyle() for edge case
        delta: Math.max(1, timeChunks.deltaInIntervalUnits),
        quantizeOffset: timeChunk.quantizeOffset,
        interval: timeChunks.interval,
        filters,
        'vessel-groups': vesselGroups,
        datasets,
        aggregationOperation: config.aggregationOperation,
        sublayerCombinationMode,
        sublayerVisibility: visible,
        sublayerCount:
          config.mode === HeatmapAnimatedMode.TimeCompare ? 2 : config.sublayers.length,
        ...(!config.dynamicBreaks && { sublayerBreaks }),
        interactive: interactiveSource,
      }

      const getDateForInterval = (date: string) =>
        timeChunks.interval === 'HOUR'
          ? date
          : DateTime.fromISO(date as string, { zone: 'utc' }).toISODate()

      if (
        config.mode === HeatmapAnimatedMode.TimeCompare &&
        config.start &&
        config.end &&
        config.compareStart &&
        config.compareEnd
      ) {
        baseSourceParams['comparison-range'] = [
          config.start,
          config.end,
          config.compareStart,
          config.compareEnd,
        ].map((d) => getDateForInterval(d)) as TileAggregationComparisonDateRange // TODO not sure why using map makes casting needed
      } else if (timeChunk.start && timeChunk.dataEnd) {
        baseSourceParams['date-range'] = [timeChunk.start, timeChunk.dataEnd].map((d) =>
          getDateForInterval(d)
        ) as TileAggregationDateRange
      }

      const serializedBaseSourceParams = serializeBaseSourceParams(baseSourceParams)

      const sourceParams = [serializedBaseSourceParams]

      return sourceParams.map((params: Record<string, string>) => {
        const url = getFinalurl(config, params)
        const source = {
          id: params.id,
          type: 'temporalgrid',
          tiles: [url],
          updateDebounce: config.updateDebounce && timeChunk.active,
          maxzoom: config.maxZoom,
          ...(attributtion.length > 0 && { attribution: attributtion }),
        }
        return source
      })
    })

    return sources
  }

  _getStyleLayers = (
    config: GlobalHeatmapAnimatedGeneratorConfig,
    timeChunks: TimeChunks,
    breaks: Breaks | undefined
  ) => {
    if (!breaks) {
      // we can't return layers until breaks data is loaded
      return []
    }

    if (SQUARE_GRID_MODES.includes(config.mode)) {
      return getGriddedLayers(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.Blob) {
      return getBlobLayer(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.Extruded) {
      return getExtrudedLayer(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.TimeCompare) {
      return griddedTimeCompare(config, timeChunks)
    }
    return []
  }

  getCacheKey = (config: FetchBreaksParams) => {
    const visibleSublayers = config.sublayers?.filter((sublayer) => sublayer.visible)
    const datasetKey = getSubLayersDatasets(visibleSublayers)?.join(',')
    const breaksCacheKey = getBreaksCacheKey(config)
    return [datasetKey, breaksCacheKey].join(',')
  }

  getStyle = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    // TODO Handle num sublayers/mode errors
    memoizeByLayerId(config.id, {
      getActiveTimeChunks: memoizeOne(getActiveTimeChunks),
    })

    const finalConfig: GlobalHeatmapAnimatedGeneratorConfig = {
      ...DEFAULT_CONFIG,
      ...config,
      // ensure we have the visible flag set
      sublayers: config.sublayers?.map((s) => ({ ...s, visible: getSubLayerVisible(s) })),
    }

    if (!config.start || !config.end) {
      return {
        id: finalConfig.id,
        sources: [],
        layers: [],
      }
    }

    const timeChunksInterval = getTimeChunksInterval(config, finalConfig.start, finalConfig.end)

    const timeChunks: TimeChunks = memoizeCache[finalConfig.id].getActiveTimeChunks(
      finalConfig.id,
      finalConfig.start,
      finalConfig.end,
      finalConfig.datasetsStart,
      finalConfig.datasetsEnd,
      timeChunksInterval
    )

    if (
      timeChunks.deltaInIntervalUnits === 0 &&
      config.aggregationOperation !== AggregationOperation.Avg
    ) {
      console.error(
        'Trying to show less than 1 interval worth of data for this heatmap layer. This could result in showing misleading information when aggregation mode is not set to avg.'
      )
    }

    const breaksConfig = {
      ...finalConfig,
      interval: timeChunks.interval,
    }

    const cacheKey = this.getCacheKey(breaksConfig)
    const visible = config.sublayers?.some((l) => l.visible === true)

    const useSublayerBreaks = finalConfig.sublayers?.some((s) => s.breaks?.length)
    const breaks =
      useSublayerBreaks && config.mode !== HeatmapAnimatedMode.TimeCompare
        ? config.sublayers?.map(({ breaks }) => breaks || [])
        : getSublayersBreaks(breaksConfig, this.breaksCache[cacheKey]?.breaks)

    const legends = getLegends(finalConfig, breaks || [])
    const style = {
      id: finalConfig.id,
      sources: this._getStyleSources(breaksConfig, timeChunks, breaks),
      layers: this._getStyleLayers(breaksConfig, timeChunks, breaks),
      metadata: {
        aggregationOperation: finalConfig.aggregationOperation,
        breaks,
        group: config.group || Group.Heatmap,
        legends,
        maxVisibleValue: finalConfig.maxVisibleValue,
        minVisibleValue: finalConfig.minVisibleValue,
        multiplier: finalConfig.breaksMultiplier,
        numSublayers: finalConfig.sublayers.length,
        sublayerCombinationMode: HEATMAP_MODE_COMBINATION[config.mode],
        sublayers: finalConfig.sublayers,
        temporalgrid: true,
        timeChunks,
        visibleSublayers: getSubLayersVisible(finalConfig),
      },
    }

    // Store config
    this.configCache[cacheKey] = finalConfig

    if (
      breaks ||
      !visible ||
      this.breaksCache[cacheKey]?.loading ||
      this.breaksCache[cacheKey]?.error
    ) {
      return style
    }

    const breaksPromise = fetchBreaks(breaksConfig)

    this.breaksCache[cacheKey] = {
      loading: true,
      error: false,
    }

    const promise = new Promise((resolve, reject) => {
      breaksPromise.then((breaks) => {
        // This makes sure we are using the latest config, which may not be the case
        // when getStyle has been called while breaks are being loaded
        const cachedConfig = this.configCache[cacheKey]

        this.breaksCache[cacheKey] = {
          loading: false,
          error: false,
          breaks,
        }

        resolve({ style: this.getStyle(cachedConfig), config: cachedConfig })
      })
      breaksPromise.catch((e: any) => {
        this.breaksCache[cacheKey] = {
          loading: false,
          error: e.name !== 'AbortError',
        }
        reject(e)
      })
    })

    return { ...style, promise }
  }
}

export default HeatmapAnimatedGenerator
