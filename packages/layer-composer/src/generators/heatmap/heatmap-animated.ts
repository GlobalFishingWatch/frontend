import memoizeOne from 'memoize-one'
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
import { TimeChunk, TimeChunks, getActiveTimeChunks, getDelta } from './util/time-chunks'
import { getSublayersBreaks } from './util/get-legends'
import getGriddedLayers from './modes/gridded'
import getBlobLayer from './modes/blob'
import getExtrudedLayer from './modes/extruded'
import { getSourceId, toURLArray } from './util'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

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

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  mode: HeatmapAnimatedMode.Compare,
  tilesetsStart: '2012-01-01T00:00:00.000Z',
  tilesetsEnd: new Date().toISOString(),
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  interactive: true,
  interval: 'auto',
  aggregationOperation: AggregationOperation.Sum,
  breaksMultiplier: VALUE_MULTIPLIER,
}

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated

  _getStyleSources = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunks) => {
    if (!config.start || !config.end || !config.sublayers) {
      throw new Error(
        `Heatmap generator must specify start, end and sublayers parameters in ${config}`
      )
    }
    const datasets = config.sublayers.map((sublayer) => sublayer.datasets.join(','))
    const filters = config.sublayers.map((sublayer) => sublayer.filter || '')
    const visible = getSubLayersVisible(config.sublayers)

    const tilesUrl = `${config.tilesAPI || `${API_GATEWAY}/${API_GATEWAY_VERSION}`}/${
      API_ENDPOINTS.tiles
    }`

    const delta = getDelta(timeChunks.activeStart, timeChunks.activeEnd, timeChunks.interval)
    const breaks = getSublayersBreaks(config, timeChunks.deltaInDays)

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
        interval: timeChunks.interval as string,
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

  _getStyleLayers = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunks) => {
    if (
      config.mode === HeatmapAnimatedMode.Compare ||
      config.mode === HeatmapAnimatedMode.Bivariate ||
      config.mode === HeatmapAnimatedMode.Single
    ) {
      return getGriddedLayers(config, timeChunks)
    } else if (config.mode === HeatmapAnimatedMode.Blob) {
      return getBlobLayer(config, timeChunks)
    } else if (config.mode === HeatmapAnimatedMode.Extruded) {
      return getExtrudedLayer(config, timeChunks)
    }
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
    // console.log(finalConfig)
    const timeChunks = memoizeCache[finalConfig.id].getActiveTimeChunks(
      finalConfig.id,
      finalConfig.staticStart || finalConfig.start,
      finalConfig.staticEnd || finalConfig.end,
      finalConfig.tilesetsStart,
      finalConfig.tilesetsEnd,
      finalConfig.interval
    )

    const style = {
      id: finalConfig.id,
      sources: this._getStyleSources(finalConfig, timeChunks),
      layers: this._getStyleLayers(finalConfig, timeChunks),
      metadata: {
        temporalgrid: true,
        numSublayers: config.sublayers.length,
        visibleSublayers: getSubLayersVisible(config.sublayers),
        timeChunks,
        aggregationOperation: finalConfig.aggregationOperation,
        multiplier: finalConfig.breaksMultiplier,
        sublayers: config.sublayers,
      },
    }
    return style
  }
}

export default HeatmapAnimatedGenerator
