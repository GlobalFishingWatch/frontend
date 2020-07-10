import memoizeOne from 'memoize-one'
import { Layer } from 'mapbox-gl'
import { flatten } from 'lodash'
import { Type, HeatmapAnimatedGeneratorConfig, GlobalGeneratorConfig } from '../types'
import { Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import {
  API_TILES_URL,
  API_ENDPOINTS,
  HEATMAP_GEOM_TYPES,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_GEOM_TYPES_GL_TYPES,
} from './config'
import { getServerSideFilters } from './utils'

type GlobalHeatmapAnimatedGeneratorConfig = HeatmapAnimatedGeneratorConfig & GlobalGeneratorConfig

// TODO this can yield different deltas depending even when start and end stays equally further apart:
//  improve logic or throttle
// TODO should work also with hours
const getDelta = (start: string, end: string) => {
  const startTimestampMs = new Date(start).getTime()
  const endTimestampMs = new Date(end).getTime()
  const startTimestampDays = startTimestampMs / 1000 / 60 / 60 / 24
  const endTimestampDays = endTimestampMs / 1000 / 60 / 60 / 24
  const daysDelta = Math.round(endTimestampDays - startTimestampDays)
  return daysDelta
}

export const toDays = (date: string) => {
  return Math.floor(new Date(date).getTime() / 1000 / 60 / 60 / 24)
}

// TODO for now only works in days
const toQuantizedDays = (date: string, quantizeOffset: number) => {
  const days = toDays(date)
  return days - quantizeOffset
}

type TimeChunk = {
  id: string
  start: string
  end: string
  quantizeOffset: number
}

// TODO this will be made dynamic and configurable in next time chunks PR
const getTimeChunks = () => {
  const TEST_CHUNK_START = '2019-01-01T00:00:00.000Z'
  const TEST_CHUNK_END = '2020-01-01T00:00:00.000Z'
  const TEST_TIME_CHUNK: TimeChunk = {
    start: TEST_CHUNK_START,
    end: TEST_CHUNK_END,
    id: `heatmapchunk_${TEST_CHUNK_START.slice(0, 13)}_${TEST_CHUNK_END.slice(0, 13)}`,
    quantizeOffset: toDays(TEST_CHUNK_START),
  }
  return [TEST_TIME_CHUNK]
}

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated
  fastTilesAPI: string

  constructor({ fastTilesAPI = API_TILES_URL }) {
    this.fastTilesAPI = fastTilesAPI
  }

  _getStyleSources = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    if (!config.start || !config.end || !config.tileset) {
      throw new Error(
        `Heatmap generator must specify start, end and tileset parameters in ${config}`
      )
    }

    const tilesUrl = `${this.fastTilesAPI}/${config.tileset}/${API_ENDPOINTS.tiles}`

    const timeChunks = memoizeCache[config.id].getTimeChunks()

    const sources = timeChunks.map((timeChunk: TimeChunk) => {
      const sourceParams = {
        singleFrame: 'false',
        geomType: config.geomType || HEATMAP_GEOM_TYPES.GRIDDED,
        serverSideFilters: getServerSideFilters(timeChunk.start, timeChunk.end),
        delta: getDelta(config.start, config.end).toString(),
        quantizeOffset: timeChunk.quantizeOffset.toString(),
      }
      const url = new URL(`${tilesUrl}?${new URLSearchParams(sourceParams)}`)
      const source = {
        id: timeChunk.id,
        type: 'temporalgrid',
        tiles: [decodeURI(url.toString())],
        maxzoom: config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM,
      }
      return source
    })

    return sources
  }

  _getStyleLayers = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    const timeChunks = memoizeCache[config.id].getTimeChunks()

    const layers: Layer[] = flatten(
      timeChunks.map((timeChunk: TimeChunk) => {
        const day = toQuantizedDays(config.start, timeChunk.quantizeOffset)
        const pickValueAt = day.toString()
        const valueExpression = ['to-number', ['get', pickValueAt]]
        const chunkLayers: Layer[] = [
          {
            id: timeChunk.id,
            source: timeChunk.id,
            'source-layer': 'temporalgrid',
            type: HEATMAP_GEOM_TYPES_GL_TYPES[config.geomType || HEATMAP_GEOM_TYPES.GRIDDED],
            paint: {
              'fill-color': 'red',
            },
            metadata: {
              group: Group.Heatmap,
            },
          },
        ]

        if (config.debug) {
          chunkLayers.push({
            id: `${timeChunk.id}_debug`,
            type: 'symbol',
            source: timeChunk.id,
            'source-layer': 'temporalgrid',
            layout: {
              'text-field': ['to-string', valueExpression],
              'text-font': ['Roboto Mono Light'],
              'text-size': 8,
              'text-allow-overlap': true,
            },
            paint: {
              'text-halo-color': 'hsl(320, 0%, 100%)',
              'text-halo-width': 2,
            },
            metadata: {
              group: Group.Label,
            },
          })
        }

        return chunkLayers
      })
    )

    return layers
  }

  getStyle = (config: GlobalHeatmapAnimatedGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getTimeChunks: memoizeOne(getTimeChunks),
    })
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default HeatmapAnimatedGenerator
