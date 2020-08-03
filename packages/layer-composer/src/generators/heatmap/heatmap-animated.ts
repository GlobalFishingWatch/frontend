import memoizeOne from 'memoize-one'
import { Layer } from 'mapbox-gl'
import flatten from 'lodash/flatten'
import zip from 'lodash/zip'
import { Type, HeatmapAnimatedGeneratorConfig, MergedGeneratorConfig } from '../types'
import { Group } from '../../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import paintByGeomType from './heatmap-layers-paint'
import {
  API_TILES_URL,
  API_ENDPOINTS,
  HEATMAP_GEOM_TYPES,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_GEOM_TYPES_GL_TYPES,
  HEATMAP_COLOR_RAMPS,
  HEATMAP_COLOR_RAMPS_RAMPS,
} from './config'
import getServerSideFilters from './util/get-server-side-filters'
import { TimeChunk, getActiveTimeChunks } from './util/time-chunks'

type GlobalHeatmapAnimatedGeneratorConfig = Required<
  MergedGeneratorConfig<HeatmapAnimatedGeneratorConfig>
>

const DEFAULT_CONFIG: Partial<HeatmapAnimatedGeneratorConfig> = {
  datasetStart: '2012-01-01T00:00:00.000Z',
  datasetEnd: new Date().toISOString(),
  geomType: HEATMAP_GEOM_TYPES.GRIDDED,
  colorRamp: HEATMAP_COLOR_RAMPS.PRESENCE,
  maxZoom: HEATMAP_DEFAULT_MAX_ZOOM,
  tilesAPI: API_TILES_URL,
}

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

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated

  _getStyleSources = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) => {
    if (!config.start || !config.end || !config.tileset) {
      throw new Error(
        `Heatmap generator must specify start, end and tileset parameters in ${config}`
      )
    }

    const tilesUrl = `${config.tilesAPI}/${config.tileset}/${API_ENDPOINTS.tiles}`

    const sources = timeChunks.map((timeChunk: TimeChunk) => {
      const sourceParams = {
        singleFrame: 'false',
        geomType: config.geomType,
        serverSideFilters: getServerSideFilters(
          timeChunk.start as string,
          timeChunk.dataEnd as string
        ),
        delta: getDelta(config.start, config.end).toString(),
        quantizeOffset: timeChunk.quantizeOffset.toString(),
        interval: timeChunk.interval,
      }
      const url = new URL(`${tilesUrl}?${new URLSearchParams(sourceParams)}`)
      // console.log(url)
      const source = {
        id: timeChunk.id,
        type: 'temporalgrid',
        tiles: [decodeURI(url.toString())],
        maxzoom: config.maxZoom,
      }
      return source
    })

    return sources
  }

  _getStyleLayers = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) => {
    const originalColorRamp = HEATMAP_COLOR_RAMPS_RAMPS[config.colorRamp]
    // TODO - generate this using updated stats API
    const stops = [0, 1, 500, 1000, 1500, 3000]
    const legend = zip(stops, originalColorRamp)
    const colorRampValues = flatten(legend)

    const layers: Layer[] = flatten(
      timeChunks.map((timeChunk: TimeChunk) => {
        const day = toQuantizedDays(config.start, timeChunk.quantizeOffset)
        const pickValueAt = day.toString()
        const exprPick = ['to-number', ['get', pickValueAt]]
        const exprColorRamp =
          colorRampValues.length > 0
            ? ['interpolate', ['linear'], exprPick, ...colorRampValues]
            : 'transparent'

        let paint
        if (config.geomType === 'gridded') {
          paint = {
            'fill-color': exprColorRamp as any,
          }
        } else if (config.geomType === 'blob') {
          paint = paintByGeomType.blob
          paint['heatmap-weight'] = exprPick as any
          const hStops = [0, 0.005, 0.01, 0.1, 0.2, 1]
          const heatmapColorRamp = flatten(zip(hStops, originalColorRamp))
          paint['heatmap-color'] = [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            ...heatmapColorRamp,
          ] as any
        }

        const chunkLayers: Layer[] = [
          {
            id: timeChunk.id,
            source: timeChunk.id,
            'source-layer': 'temporalgrid',
            type: HEATMAP_GEOM_TYPES_GL_TYPES[config.geomType],
            paint: paint as any,
            metadata: {
              group: Group.Heatmap,
            },
          },
        ]

        if (config.debug) {
          const exprDebugOutline = [
            'case',
            ['>', exprPick, 0],
            'rgba(0,255,0,1)',
            'rgba(255,255,0,1)',
          ]
          chunkLayers.push({
            id: `${timeChunk.id}_debug`,
            source: timeChunk.id,
            'source-layer': 'temporalgrid',
            type: 'fill',
            paint: {
              'fill-color': 'transparent',
              'fill-outline-color': exprDebugOutline as any,
            },
            metadata: {
              group: Group.Heatmap,
            },
          })
        }
        if (config.debugLabels) {
          const exprDebugText = ['case', ['>', exprPick, 0], ['to-string', exprPick], '']
          chunkLayers.push({
            id: `${timeChunk.id}_debug_labels`,
            type: 'symbol',
            source: timeChunk.id,
            'source-layer': 'temporalgrid',
            layout: {
              'text-field': exprDebugText as any,
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
      getActiveTimeChunks: memoizeOne(getActiveTimeChunks),
    })

    const timeChunks = memoizeCache[config.id].getActiveTimeChunks(
      config.start,
      config.end,
      config.datasetStart,
      config.datasetEnd
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
