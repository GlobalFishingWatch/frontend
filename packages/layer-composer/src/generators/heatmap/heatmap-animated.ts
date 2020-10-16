import memoizeOne from 'memoize-one'
import { Type, HeatmapAnimatedGeneratorConfig, MergedGeneratorConfig } from '../types'
import { ExtendedLayer, Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import {
  API_TILES_URL,
  API_ENDPOINTS,
  HEATMAP_GEOM_TYPES,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_GEOM_TYPES_GL_TYPES,
} from './config'
import { TimeChunk, getActiveTimeChunks, getDelta } from './util/time-chunks'
import { getSublayersBreaks } from './util/get-legends'
import getGriddedLayers from './geomTypes/gridded'
import getBlobLayer from './geomTypes/blob'

export type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  combinationMode: 'add',
  geomType: HEATMAP_GEOM_TYPES.GRIDDED,
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

  _getStyleSources = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) => {
    if (!config.start || !config.end || !config.sublayers) {
      throw new Error(
        `Heatmap generator must specify start, end and sublayers parameters in ${config}`
      )
    }
    const datasets = config.sublayers.map((sublayer) => sublayer.datasets.join(','))
    const filters = config.sublayers.map((sublayer) => sublayer.filter || '')

    const tilesUrl = `${config.tilesAPI}/${API_ENDPOINTS.tiles}`

    const breaks = getSublayersBreaks(config, timeChunks[0].intervalInDays)

    const sources = timeChunks.flatMap((timeChunk: TimeChunk) => {
      const baseSourceParams: Record<string, string> = {
        id: timeChunk.id,
        singleFrame: 'false',
        geomType: config.geomType,
        filters: toURLArray('filters', filters),
        datasets: toURLArray('datasets', datasets),
        delta: getDelta(config.start, config.end, timeChunk.interval).toString(),
        quantizeOffset: timeChunk.quantizeOffset.toString(),
        interval: timeChunk.interval,
        numDatasets: config.sublayers.length.toString(),
        breaks: JSON.stringify(breaks),
        combinationMode: config.combinationMode,
      }
      if (timeChunk.start && timeChunk.dataEnd) {
        baseSourceParams['date-range'] = [timeChunk.start, timeChunk.dataEnd].join(',')
      }

      const sourceParams = [baseSourceParams]
      if (config.interactive) {
        const interactiveSource = {
          ...baseSourceParams,
          id: `${baseSourceParams.id}_interaction`,
          combinationMode: 'literal',
        }
        sourceParams.push(interactiveSource)
      }

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

  _getStyleLayers = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) => {
    if (config.geomType === HEATMAP_GEOM_TYPES.GRIDDED) {
      return getGriddedLayers(config, timeChunks)
    } else if (config.geomType === HEATMAP_GEOM_TYPES.BLOB) {
      return getBlobLayer(config, timeChunks[0])
    }
  }

  getStyle = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getActiveTimeChunks: memoizeOne(getActiveTimeChunks),
    })

    const timeChunks = memoizeCache[config.id].getActiveTimeChunks(
      config.start,
      config.end,
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
        timeChunks,
      },
    }
  }
}

export default HeatmapAnimatedGenerator
