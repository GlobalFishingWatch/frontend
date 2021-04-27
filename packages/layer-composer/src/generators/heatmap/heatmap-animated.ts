import memoizeOne from 'memoize-one'
import { DateTime } from 'luxon'
import {
  GeomType,
  TileAggregationSourceParams,
  AggregationOperation,
  VALUE_MULTIPLIER,
} from '@globalfishingwatch/fourwings-aggregate'
import {
  Type,
  HeatmapAnimatedGeneratorConfig,
  MergedGeneratorConfig,
  HeatmapAnimatedMode,
  HeatmapAnimatedGeneratorSublayer,
} from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { API_GATEWAY, API_GATEWAY_VERSION } from '../../layer-composer'
import { API_ENDPOINTS, HEATMAP_DEFAULT_MAX_ZOOM, HEATMAP_MODE_COMBINATION } from './config'
import { TimeChunk, TimeChunks, getActiveTimeChunks, getDelta, Interval } from './util/time-chunks'
import { getSublayersBreaks } from './util/get-legends'
import getGriddedLayers from './modes/gridded'
import getBlobLayer from './modes/blob'
import getExtrudedLayer from './modes/extruded'
import { getSourceId, toURLArray } from './util'
import fetchBreaks, { Breaks, FetchBreaksParams } from './util/fetch-breaks'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

const getTilesUrl = (config: HeatmapAnimatedGeneratorConfig): string => {
  return `${config.tilesAPI || `${API_GATEWAY}/${API_GATEWAY_VERSION}`}/${API_ENDPOINTS.tiles}`
}

const getSubLayersDatasets = (sublayers: HeatmapAnimatedGeneratorSublayer[]): string[] => {
  return sublayers?.map((sublayer) => {
    const sublayerDatasets = [...sublayer.datasets]
    return sublayerDatasets.sort((a, b) => a.localeCompare(b)).join(',')
  })
}

const getSubLayersVisible = (sublayers: HeatmapAnimatedGeneratorSublayer[]) =>
  sublayers.map((sublayer) => (sublayer.visible === false ? false : true))

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

// This also defines the priority order, so remember to keep it ascendent
export const DEFAULT_HEATMAP_INTERVALS: Interval[] = ['hour', 'day', '10days']

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
  type = Type.HeatmapAnimated
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

    const tilesUrl = getTilesUrl(config)
    const delta = getDelta(timeChunks.activeStart, timeChunks.activeEnd, timeChunks.interval)

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
        delta,
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
        baseSourceParams['date-range'] = [timeChunk.start, timeChunk.dataEnd]
      }
      const serializedBaseSourceParams = serializeBaseSourceParams(baseSourceParams)

      const sourceParams = [serializedBaseSourceParams]

      return sourceParams.map((params: Record<string, string>) => {
        const url = new URL(`${tilesUrl}?${new URLSearchParams(params)}`)
        const source = {
          id: params.id,
          type: 'temporalgrid',
          tiles: [decodeURI(url.toString())],
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
      // TODO review with new buckets
      return getBlobLayer(config, timeChunks, breaks)
    } else if (config.mode === HeatmapAnimatedMode.Extruded) {
      // TODO review with new buckets
      return getExtrudedLayer(config, timeChunks)
    }
  }

  getCacheKey = (config: FetchBreaksParams) => {
    const visibleSublayers = config.sublayers.filter((sublayer) => sublayer.visible)
    const datasetKey = getSubLayersDatasets(visibleSublayers).join(',')
    const filtersKey = visibleSublayers.flatMap((subLayer) => subLayer.filter || []).join(',')
    return [datasetKey, filtersKey].join(',')
  }

  getStyle = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    // TODO Handle num sublayers/mode errors
    memoizeByLayerId(config.id, {
      getActiveTimeChunks: memoizeOne(getActiveTimeChunks),
    })

    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    const timeChunks: TimeChunks = memoizeCache[finalConfig.id].getActiveTimeChunks(
      finalConfig.id,
      finalConfig.staticStart || finalConfig.start,
      finalConfig.staticEnd || finalConfig.end,
      finalConfig.datasetsStart,
      finalConfig.datasetsEnd,
      finalConfig.interval
    )

    const breaksConfig = {
      ...finalConfig,
      interval: timeChunks.interval,
    }

    const cacheKey = this.getCacheKey(breaksConfig)

    const useSublayerBreaks = finalConfig.sublayers.some((s) => s.breaks?.length)
    const breaks = useSublayerBreaks
      ? config.sublayers.map(({ breaks }) => breaks || [])
      : getSublayersBreaks(finalConfig, this.breaksCache[cacheKey]?.breaks)

    const style = {
      id: finalConfig.id,
      sources: this._getStyleSources(finalConfig, timeChunks, breaks),
      layers: this._getStyleLayers(finalConfig, timeChunks, breaks),
      metadata: {
        breaks,
        temporalgrid: true,
        numSublayers: finalConfig.sublayers.length,
        visibleSublayers: getSubLayersVisible(finalConfig.sublayers),
        timeChunks,
        aggregationOperation: finalConfig.aggregationOperation,
        multiplier: finalConfig.breaksMultiplier,
        sublayers: finalConfig.sublayers,
        legend: finalConfig.metadata?.legend,
      },
    }

    if (breaks || this.breaksCache[cacheKey]?.loading || this.breaksCache[cacheKey]?.error) {
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
        if (e.name !== 'AbortError') {
          this.breaksCache[cacheKey] = { loading: false, error: true }
        }
        reject(e)
      })
    })

    return { ...style, promise }
  }
}

export default HeatmapAnimatedGenerator
