import memoizeOne from 'memoize-one'
import { Layer } from 'mapbox-gl'
import flatten from 'lodash/flatten'
import zip from 'lodash/zip'
import {
  Type,
  HeatmapAnimatedGeneratorConfig,
  MergedGeneratorConfig,
  ColorRampsIds,
  CombinationMode,
} from '../types'
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
} from './config'
import { TimeChunk, getActiveTimeChunks, toQuantizedFrame, getDelta } from './util/time-chunks'

type GlobalHeatmapAnimatedGeneratorConfig = Required<
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

// TODO - generate this using updated stats API
// Breaks array must must have length === colorRamp length - 1
const HARDCODED_BREAKS = {
  add: [[0, 1, 5, 10, 30]],
  compare: [
    [0, 1, 5, 10, 30],
    [0, 1, 5, 10, 30],
    [0, 1, 5, 10, 30],
    [0, 1, 5, 10, 30],
    [0, 1, 5, 10, 30],
  ],
  bivariate: [
    [0, 5, 30],
    [0, 5, 30],
  ],
  literal: [[]],
}

const getColorRampBaseExpression = (
  colorRampIds: ColorRampsIds[],
  combinationMode: CombinationMode
) => {
  const colorRamps = colorRampIds.map((colorRampId) => {
    const originalColorRamp = HEATMAP_COLOR_RAMPS[colorRampId]
    return originalColorRamp
  })

  const expressions = colorRamps.map((originalColorRamp, colorRampIndex) => {
    const legend = [...Array(originalColorRamp.length)].map((_, i) => [
      // offset each dataset by 10 + add actual bucket value
      colorRampIndex * 10 + i,
      originalColorRamp[i],
    ])
    const expr = legend.flat()
    return expr
  })

  if (combinationMode === 'compare') {
    return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions.flat() }
  }

  return { colorRamp: colorRamps[0], colorRampBaseExpression: expressions[0] }
}

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated

  _getStyleSources = (config: GlobalHeatmapAnimatedGeneratorConfig, timeChunks: TimeChunk[]) => {
    if (!config.start || !config.end || !config.sublayers) {
      throw new Error(
        `Heatmap generator must specify start, end and sublayers parameters in ${config}`
      )
    }

    // TODO API should support an array of tilesets for each sublayer
    const tilesets = config.sublayers.map((s) => s.tilesets[0])
    const filters = config.sublayers.map((s) => s.filter || '')

    const tilesUrl = `${config.tilesAPI}/${tilesets.join(',')}/${API_ENDPOINTS.tiles}`

    // TODO - generate this using updated stats API
    const breaks = HARDCODED_BREAKS[config.combinationMode].slice(0, tilesets.length)

    const sources = timeChunks.flatMap((timeChunk: TimeChunk) => {
      const baseSourceParams: Record<string, string> = {
        id: timeChunk.id,
        singleFrame: 'false',
        geomType: config.geomType,
        filters: filters
          .map((filter, i) => {
            if (!filter || filter === '') return ''
            return `filters[${i}]=${filter}`
          })
          .join('&'),
        delta: getDelta(config.start, config.end, timeChunk.interval).toString(),
        quantizeOffset: timeChunk.quantizeOffset.toString(),
        interval: timeChunk.interval,
        numDatasets: config.sublayers.length.toString(),
        // TODO - generate this using updated stats API
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
    const { colorRamp, colorRampBaseExpression } = getColorRampBaseExpression(
      config.sublayers.map((s) => s.colorRamp),
      config.combinationMode
    )

    const layers: Layer[] = timeChunks.flatMap((timeChunk: TimeChunk) => {
      const frame = toQuantizedFrame(config.start, timeChunk.quantizeOffset, timeChunk.interval)
      const pickValueAt = frame.toString()
      const exprPick = ['coalesce', ['get', pickValueAt], 0]
      const exprColorRamp = ['step', exprPick, 'transparent', ...colorRampBaseExpression]

      let paint
      if (config.geomType === 'gridded') {
        paint = {
          'fill-color': exprColorRamp as any,
        }
      } else if (config.geomType === 'blob') {
        paint = paintByGeomType.blob
        paint['heatmap-weight'] = exprPick as any
        const hStops = [0, 0.005, 0.01, 0.1, 0.2, 1]
        const heatmapColorRamp = zip(hStops, colorRamp).flat()
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

      if (config.interactive) {
        chunkLayers.push({
          id: `${timeChunk.id}_interaction`,
          source: `${timeChunk.id}_interaction`,
          'source-layer': 'temporalgrid',
          type: 'fill',
          paint: {
            'fill-color': 'pink',
            'fill-opacity': config.debug ? 0.5 : 0,
          },
          metadata: {
            group: Group.Heatmap,
            generator: Type.HeatmapAnimated,
            generatorId: config.id,
            interactive: true,
            frame,
          },
        })
        chunkLayers.push({
          id: `${timeChunk.id}_interaction_hover`,
          source: `${timeChunk.id}_interaction`,
          'source-layer': 'temporalgrid',
          type: 'line',
          paint: {
            'line-color': 'white',
            'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 3, 0],
          },
          metadata: {
            group: Group.Heatmap,
          },
        })
      }

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

    return layers
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
