import memoizeOne from 'memoize-one'
import { DateTime } from 'luxon'
import {
  GeomType,
  TileAggregationSourceParams,
  AggregationOperation,
  VALUE_MULTIPLIER,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  GeneratorType,
  HeatmapAnimatedGeneratorConfig,
  MergedGeneratorConfig,
  HeatmapAnimatedMode,
  HeatmapAnimatedGeneratorSublayer,
} from '../types'
import { isUrlAbsolute, memoizeByLayerId, memoizeCache } from '../../utils'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../config'
import { Group } from '../../types'
import {
  API_ENDPOINTS,
  DEFAULT_HEATMAP_INTERVALS,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_MODE_COMBINATION,
} from './config'
import { TimeChunk, TimeChunks, getActiveTimeChunks } from './util/time-chunks'
import getLegends, { getSublayersBreaks } from './util/get-legends'
import getGriddedLayers from './modes/gridded'
import getBlobLayer from './modes/blob'
import getExtrudedLayer from './modes/extruded'
import { getSourceId, toURLArray } from './util'
import fetchBreaks, { Breaks, FetchBreaksParams } from './util/fetch-breaks'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

const getTilesUrl = (config: HeatmapAnimatedGeneratorConfig): string => {
  if (config.tilesAPI) {
    return isUrlAbsolute(config.tilesAPI) ? config.tilesAPI : API_GATEWAY + config.tilesAPI
  }
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/${API_ENDPOINTS.tiles}`
}

const getSubLayersDatasets = (sublayers: HeatmapAnimatedGeneratorSublayer[]): string[] => {
  return sublayers?.map((sublayer) => {
    const sublayerDatasets = [...sublayer.datasets]
    return sublayerDatasets.sort((a, b) => a.localeCompare(b)).join(',')
  })
}

const getSubLayerVisible = (sublayer: HeatmapAnimatedGeneratorSublayer) =>
  sublayer.visible === false ? false : true
const getSubLayersVisible = (sublayers: HeatmapAnimatedGeneratorSublayer[]) =>
  sublayers.map(getSubLayerVisible)

const serializeBaseSourceParams = (params: any) => {
  const serialized = {
    ...params,
    singleFrame: params.singleFrame ? 'true' : 'false',
    filters: toURLArray('filters', params.filters),
    datasets: toURLArray('datasets', params.datasets),
    delta: params.delta.toString(),
    quantizeOffset: params.quantizeOffset.toString(),
    sublayerVisibility: JSON.stringify(params.sublayerVisibility),
    sublayerCount: params.sublayerCount.toString(),
    interactive: params.interactive ? 'true' : 'false',
  }
  if (params['date-range']) {
    serialized['date-range'] = params['date-range'].join(',')
  }
  if (params.sublayerBreaks) {
    serialized.sublayerBreaks = JSON.stringify(params.sublayerBreaks)
  }
  return serialized
}

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  mode: HeatmapAnimatedMode.Compare,
  datasetsStart: '2012-01-01T00:00:00.000Z',
  datasetsEnd: DateTime.now().toUTC().toISO(),
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  interactive: true,
  interval: DEFAULT_HEATMAP_INTERVALS,
  aggregationOperation: AggregationOperation.Sum,
  breaksMultiplier: VALUE_MULTIPLIER,
}

class HeatmapAnimatedGenerator {
  type = GeneratorType.HeatmapAnimated
  breaksCache: Record<string, { loading: boolean; error: boolean; breaks?: Breaks }> = {}

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

    const datasets = getSubLayersDatasets(config.sublayers)
    const filters = config.sublayers.map((sublayer) => sublayer.filter || '')
    const visible = getSubLayersVisible(config.sublayers)

    const tilesUrl = getTilesUrl(config).replace(/{{/g, '{').replace(/}}/g, '}')

    const geomType = config.mode === HeatmapAnimatedMode.Blob ? GeomType.point : GeomType.rectangle
    const interactiveSource =
      config.interactive &&
      (config.mode === HeatmapAnimatedMode.Compare ||
        config.mode === HeatmapAnimatedMode.Bivariate ||
        config.mode === HeatmapAnimatedMode.Single)
    const sublayerCombinationMode = HEATMAP_MODE_COMBINATION[config.mode]

    const sources = timeChunks.chunks.flatMap((timeChunk: TimeChunk) => {
      const baseSourceParams: TileAggregationSourceParams = {
        id: getSourceId(config.id, timeChunk),
        singleFrame: false,
        geomType,
        // Set a minimum of 1 to avoid empty frames. See error thrown in getStyle() for edge case
        delta: Math.max(1, timeChunks.deltaInIntervalUnits),
        quantizeOffset: timeChunk.quantizeOffset,
        interval: timeChunks.interval,
        filters,
        datasets,
        aggregationOperation: config.aggregationOperation,
        sublayerCombinationMode,
        sublayerVisibility: visible,
        sublayerCount: config.sublayers.length,
        sublayerBreaks: breaks.map((sublayerBreaks) =>
          sublayerBreaks.map((b) => b * config.breaksMultiplier)
        ),
        interactive: interactiveSource,
      }
      if (timeChunk.start && timeChunk.dataEnd) {
        baseSourceParams['date-range'] =
          timeChunks.interval === 'hour'
            ? [timeChunk.start, timeChunk.dataEnd]
            : [
                DateTime.fromISO(timeChunk.start).toISODate(),
                DateTime.fromISO(timeChunk.dataEnd).toISODate(),
              ]
      }
      const serializedBaseSourceParams = serializeBaseSourceParams(baseSourceParams)

      const sourceParams = [serializedBaseSourceParams]

      return sourceParams.map((params: Record<string, string>) => {
        const url = new URL(`${tilesUrl}?${new URLSearchParams(params)}`)
        const urlString = decodeURI(url.toString())
        const source = {
          id: params.id,
          type: 'temporalgrid',
          tiles: [urlString],
          maxzoom: config.maxZoom,
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

    if (
      config.mode === HeatmapAnimatedMode.Compare ||
      config.mode === HeatmapAnimatedMode.Bivariate ||
      config.mode === HeatmapAnimatedMode.Single
    ) {
      return getGriddedLayers(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.Blob) {
      return getBlobLayer(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.Extruded) {
      return getExtrudedLayer(config, timeChunks, breaks)
    }
    return []
  }

  getCacheKey = (config: FetchBreaksParams) => {
    const visibleSublayers = config.sublayers?.filter((sublayer) => sublayer.visible)
    const datasetKey = getSubLayersDatasets(visibleSublayers)?.join(',')
    const filtersKey = visibleSublayers?.flatMap((subLayer) => subLayer.filter || []).join(',')
    return [datasetKey, filtersKey, config.mode].join(',')
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

    const timeChunks: TimeChunks = memoizeCache[finalConfig.id].getActiveTimeChunks(
      finalConfig.id,
      finalConfig.start,
      finalConfig.end,
      finalConfig.datasetsStart,
      finalConfig.datasetsEnd,
      finalConfig.interval
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
    const visible = config.sublayers.some((l) => l.visible === true)

    const useSublayerBreaks = finalConfig.sublayers.some((s) => s.breaks?.length)
    const breaks = useSublayerBreaks
      ? config.sublayers.map(({ breaks }) => breaks || [])
      : getSublayersBreaks(finalConfig, this.breaksCache[cacheKey]?.breaks)
    const legends = getLegends(finalConfig, breaks || [])
    const style = {
      id: finalConfig.id,
      sources: this._getStyleSources(finalConfig, timeChunks, breaks),
      layers: this._getStyleLayers(finalConfig, timeChunks, breaks),
      metadata: {
        breaks,
        legends,
        temporalgrid: true,
        numSublayers: finalConfig.sublayers.length,
        sublayers: finalConfig.sublayers,
        visibleSublayers: getSubLayersVisible(finalConfig.sublayers),
        timeChunks,
        aggregationOperation: finalConfig.aggregationOperation,
        multiplier: finalConfig.breaksMultiplier,
        group: config.group || Group.Heatmap,
      },
    }

    if (
      breaks ||
      !visible ||
      this.breaksCache[cacheKey]?.loading ||
      this.breaksCache[cacheKey]?.error
    ) {
      return style
    }

    const breaksPromise = fetchBreaks(breaksConfig)

    this.breaksCache[cacheKey] = { loading: true, error: false }

    const promise = new Promise((resolve, reject) => {
      breaksPromise.then((breaks) => {
        this.breaksCache[cacheKey] = { loading: false, error: false, breaks }
        resolve({ style: this.getStyle(finalConfig), config: finalConfig })
      })
      breaksPromise.catch((e: any) => {
        this.breaksCache[cacheKey] = { loading: false, error: e.name !== 'AbortError' }
        reject(e)
      })
    })

    return { ...style, promise }
  }
}

export default HeatmapAnimatedGenerator
