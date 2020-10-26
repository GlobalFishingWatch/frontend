import memoizeOne from 'memoize-one'
import {
  Type,
  HeatmapAnimatedGeneratorConfig,
  MergedGeneratorConfig,
  HeatmapAnimatedMode,
} from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import {
  API_TILES_URL,
  API_ENDPOINTS,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_MODE_COMBINATION,
} from './config'
import { TimeChunk, TimeChunks, getActiveTimeChunks, getDelta } from './util/time-chunks'
import { getSublayersBreaks } from './util/get-legends'
import getGriddedLayers from './modes/gridded'
import getBlobLayer from './modes/blob'
import getExtrudedLayer from './modes/extruded'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  mode: HeatmapAnimatedMode.Compare,
  tilesetsStart: '2012-01-01T00:00:00.000Z',
  tilesetsEnd: new Date().toISOString(),
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  tilesAPI: API_TILES_URL,
  interactive: true,
}

const toURLArray = (paramName: string, arr: string[]) => {
  return arr
    .map((element, i) => {
      if (!element) return ''
      return `${paramName}[${i}]=${element}`
    })
    .join('&')
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

    const tilesUrl = `${config.tilesAPI}/${API_ENDPOINTS.tiles}`

    const delta = getDelta(timeChunks.activeStart, timeChunks.activeEnd, timeChunks.interval)
    const breaks = getSublayersBreaks(config, timeChunks.deltaInDays)

    const geomType = config.mode === HeatmapAnimatedMode.Blob ? 'point' : 'rectangle'
    const interactiveSource =
      config.interactive &&
      (config.mode === HeatmapAnimatedMode.Compare || config.mode === HeatmapAnimatedMode.Bivariate)
    const combinationMode = HEATMAP_MODE_COMBINATION[config.mode]

    const sources = timeChunks.chunks.flatMap((timeChunk: TimeChunk) => {
      const baseSourceParams: Record<string, string> = {
        id: timeChunk.id,
        singleFrame: 'false',
        geomType,
        combinationMode,
        filters: toURLArray('filters', filters),
        datasets: toURLArray('datasets', datasets),
        delta: delta.toString(),
        quantizeOffset: timeChunk.quantizeOffset.toString(),
        interval: timeChunks.interval,
        numDatasets: config.sublayers.length.toString(),
        breaks: JSON.stringify(breaks),
        // TODO only for visible time chunk
        interactive: interactiveSource.toString(),
      }
      if (timeChunk.start && timeChunk.dataEnd) {
        baseSourceParams['date-range'] = [timeChunk.start, timeChunk.dataEnd].join(',')
      }

      const sourceParams = [baseSourceParams]

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
      config.mode === HeatmapAnimatedMode.Bivariate
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

    const timeChunks = memoizeCache[config.id].getActiveTimeChunks(
      config.staticStart || config.start,
      config.staticEnd || config.end,
      config.tilesetsStart,
      config.tilesetsEnd
    )

    const finalConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    return {
      id: config.id,
      sources: this._getStyleSources(finalConfig, timeChunks),
      layers: this._getStyleLayers(finalConfig, timeChunks),
      metadata: {
        temporalgrid: true,
        timeChunks,
      },
    }
  }
}

export default HeatmapAnimatedGenerator
