import { flatten, zip } from 'lodash'

import type {
  FillLayerSpecification,
  LineLayerSpecification,
} from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY } from '../../config'
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import type { HeatmapGeneratorConfig, MergedGeneratorConfig } from '../types';
import { GeneratorType } from '../types'
import { addURLSearchParams } from '../utils'

import fetchStats from './util/fetch-stats'
import getBreaks from './util/get-breaks'
import { HEATMAP_COLOR_RAMPS } from './colors'
import {
  COLOR_RAMP_DEFAULT_NUM_STEPS,
  HEATMAP_DEFAULT_MAX_ZOOM,
  TEMPORALGRID_SOURCE_LAYER,
} from './config'
import type { StatsByZoom } from './types'

export type GlobalHeatmapGeneratorConfig = MergedGeneratorConfig<HeatmapGeneratorConfig>

class HeatmapGenerator {
  type = GeneratorType.Heatmap
  statsError = 0
  statsCache: Record<string, { loading: boolean; error: boolean; stats?: StatsByZoom }> = {}

  _getStyleSources = (config: GlobalHeatmapGeneratorConfig) => {
    if (!config.tilesUrl) {
      throw new Error(
        `Heatmap generator must specify tilesUrl parameters in ${JSON.stringify(config)}`
      )
    }
    if (!config.datasets) {
      throw new Error(
        `Heatmap generator must specify datasets parameters in ${JSON.stringify(config)}`
      )
    }
    const staticHeatmap = config.static || false
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl

    let url = new URL(
      tilesUrl.replace('{{type}}', 'heatmap').replace(/{{/g, '{').replace(/}}/g, '}')
    )

    url.searchParams.set('temporal-aggregation', 'true')
    url.searchParams.set('format', 'INTARRAY')
    url = addURLSearchParams(url, 'datasets', config.datasets)

    if (!staticHeatmap && config.start && config.end) {
      url.searchParams.set('date-range', [config.start, config.end].join(','))
    }
    if (config.filters) {
      url.searchParams.set('filters', config.filters)
    }

    return [
      {
        id: config.id,
        type: 'temporalgrid' as const,
        tiles: [decodeURI(url.toString())],
        maxzoom: config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM,
      },
    ]
  }

  _roundNumber = (number: number) => {
    const precision = Array.from(Math.round(number).toString()).reduce((acc) => acc * 10, 0.1)
    const rounded = Math.floor(number / precision) * precision
    return rounded
  }

  getCacheKey = (config: GlobalHeatmapGeneratorConfig) => {
    return config.id
  }

  _getStyleLayers = (
    config: GlobalHeatmapGeneratorConfig,
    statsByZoom?: StatsByZoom
  ): [FillLayerSpecification, LineLayerSpecification] => {
    let breaks = config.breaks || []
    const zoom = Math.min(config.zoomLoadLevel, config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM)
    const stats = statsByZoom?.[zoom]
    if (!breaks?.length && stats) {
      const { min, max, avg } = stats
      const numBreaks = config.numBreaks || COLOR_RAMP_DEFAULT_NUM_STEPS
      breaks = getBreaks(min, max, avg, config.scalePowExponent, numBreaks)
    }

    const colorRampType = config.colorRamp || 'teal'
    const pickValueAt = 'value'
    const originalColorRamp = HEATMAP_COLOR_RAMPS[colorRampType]
    const legendRamp = breaks.length ? zip(breaks, originalColorRamp) : []

    const colorRampValues = flatten(legendRamp)
    const valueExpression = ['to-number', ['get', pickValueAt]]
    const colorRamp =
      colorRampValues.length > 0
        ? ['interpolate', ['linear'], valueExpression, ...colorRampValues]
        : 'transparent'
    const paint: any = {
      'fill-outline-color': 'transparent',
      'fill-color': colorRamp,
    }

    return [
      {
        id: config.id,
        source: config.id,
        'source-layer': TEMPORALGRID_SOURCE_LAYER,
        type: 'fill',
        paint,
        metadata: {
          // TODO: support multiple legends by each datasets
          ...config.metadata,
          uniqueFeatureInteraction: true,
          generatorId: config.id,
          legend: {
            ...config.metadata?.legend,
            type: 'colorramp',
            ramp: legendRamp,
          },
          // TODO: It should be added on _applyGenericStyle from layers composer,
          // but it needs to be fixed to make it work
          generatorType: GeneratorType.Heatmap,
          gridArea: stats?.area,
          currentlyAt: pickValueAt,
          group: config.metadata?.group || Group.Heatmap,
        },
      },
      {
        id: `${config.id}_interaction`,
        source: config.id,
        'source-layer': TEMPORALGRID_SOURCE_LAYER,
        type: 'line',
        paint: {
          'line-color': 'white',
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            4,
            ['boolean', ['feature-state', 'click'], false],
            4,
            0,
          ],
          'line-offset': -2,
        },
        metadata: {
          interactive: false,
          group: Group.Heatmap,
        },
      },
    ]
  }

  getStyle = (config: GlobalHeatmapGeneratorConfig) => {
    const style = {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }

    const hasDates = config.start !== undefined && config.end !== undefined
    const needFetchStats =
      !config.breaks || (config.fetchStats === true && config.statsUrl !== undefined)
    const cacheKey = this.getCacheKey(config)
    const statsCache = this.statsCache[cacheKey]

    if (!needFetchStats || !hasDates || statsCache?.loading || statsCache?.error) {
      return style
    }

    const statsByZoom = statsCache?.stats

    if (statsByZoom) {
      return {
        ...style,
        layers: this._getStyleLayers(config, statsByZoom),
      }
    }

    const statsPromise = fetchStats(config)

    this.statsCache[cacheKey] = { loading: true, error: false }
    const promise = new Promise((resolve, reject) => {
      statsPromise.then((stats: StatsByZoom) => {
        this.statsCache[cacheKey] = { loading: false, error: false, stats }
        resolve({ style: this.getStyle(config), config })
      })
      statsPromise.catch((e: any) => {
        if (e.name !== 'AbortError') {
          this.statsCache[cacheKey] = { loading: false, error: true }
        }
        reject(e)
      })
    })

    return { ...style, promise }
  }
}

export default HeatmapGenerator
