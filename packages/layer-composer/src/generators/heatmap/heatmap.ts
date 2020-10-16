import flatten from 'lodash/flatten'
import zip from 'lodash/zip'
import memoizeOne from 'memoize-one'
import { Group } from '../../types'
import { Type, HeatmapGeneratorConfig, GlobalGeneratorConfig } from '../types'
import { memoizeByLayerId, memoizeCache, isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'
import fetchStats from './util/fetch-stats'
import {
  HEATMAP_GEOM_TYPES,
  HEATMAP_COLOR_RAMPS,
  HEATMAP_GEOM_TYPES_GL_TYPES,
  HEATMAP_DEFAULT_MAX_ZOOM,
} from './config'
import { statsByZoom } from './types'
import getBreaks from './util/get-breaks'

type GlobalHeatmapGeneratorConfig = HeatmapGeneratorConfig & GlobalGeneratorConfig

class HeatmapGenerator {
  type = Type.Heatmap
  statsError = 0
  stats: Record<string, statsByZoom> = {}

  _getStyleSources = (config: GlobalHeatmapGeneratorConfig) => {
    if (!config.tilesUrl) {
      throw new Error(`Heatmap generator must specify tilesUrl parameters in ${config}`)
    }
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl
    const url = new URL(
      tilesUrl.replace('{{type}}', 'heatmap').replace(/{{/g, '{').replace(/}}/g, '}')
    )
    url.searchParams.set('geomType', HEATMAP_GEOM_TYPES.GRIDDED)
    url.searchParams.set('singleFrame', 'true')
    if (config.start && config.end) {
      url.searchParams.set('date-range', [config.start, config.end].join(','))
    }
    if (config.serverSideFilter) {
      url.searchParams.set('filters', config.serverSideFilter)
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

  _getHeatmapLayers = (config: GlobalHeatmapGeneratorConfig) => {
    const colorRampType = config.colorRamp || 'presence'

    let stops: number[] = []
    const zoom = Math.min(Math.floor(config.zoom), config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM)
    const statsByZoom = (this.stats[config.id] && this.stats[config.id][zoom]) || null
    if (config.steps) {
      stops = config.steps
    } else if (statsByZoom) {
      const { min, max, avg } = statsByZoom
      if (min && max && avg) {
        stops = getBreaks(min, max, avg, config.scalePowExponent)
      }
    }

    const pickValueAt = 'value'
    const originalColorRamp = HEATMAP_COLOR_RAMPS[colorRampType]
    const legendRamp = stops.length ? zip(stops, originalColorRamp) : []

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

    const visibility = isConfigVisible(config)
    return [
      {
        id: config.id,
        source: config.id,
        'source-layer': 'temporalgrid',
        type: HEATMAP_GEOM_TYPES_GL_TYPES[HEATMAP_GEOM_TYPES.GRIDDED],
        layout: {
          visibility,
        },
        paint,
        metadata: {
          // TODO: support multiple legends by each datasets
          ...config.metadata,
          generatorId: config.id,
          legend: {
            ...config.metadata?.legend,
            type: 'colorramp',
            ramp: legendRamp,
          },
          // TODO: It should be added on _applyGenericStyle from layers composer,
          // but it needs to be fixed to make it work
          generatorType: Type.Heatmap,
          gridArea: statsByZoom && statsByZoom.area,
          currentlyAt: pickValueAt,
          group: Group.Heatmap,
        },
      },
    ]
  }

  _getStyleLayers = (config: GlobalHeatmapGeneratorConfig) => {
    const hasDates = config.start !== undefined && config.end !== undefined
    const fetchStats = config.fetchStats === true && config.statsUrl !== undefined
    if (!fetchStats || !hasDates) {
      return { layers: this._getHeatmapLayers(config) }
    }

    const statsFilters = [config.serverSideFilter, config.statsFilter]
      .filter((f) => f)
      .join(' AND ')
    const dateRange = [config.start, config.end].join(',')
    const statsUrl = isUrlAbsolute(config.statsUrl as string)
      ? config.statsUrl
      : API_GATEWAY + config.statsUrl
    // use statsError to invalidate cache and try again when it fails
    // also params can't be named as needs to be independant params for memoization
    const statsPromise = memoizeCache[config.id]._fetchStats(
      statsUrl,
      dateRange,
      statsFilters,
      true,
      config.token,
      this.statsError
    )
    const layers = this._getHeatmapLayers(config)

    if (statsPromise.resolved) {
      return { layers }
    }

    const promise = new Promise((resolve, reject) => {
      statsPromise.then((stats: statsByZoom) => {
        this.stats[config.id] = stats
        if (this.statsError > 0) {
          this.statsError = 0
        }
        resolve(this.getStyle(config))
      })
      statsPromise.catch((e: any) => {
        if (e.name !== 'AbortError') {
          this.statsError++
        }
        reject(e)
      })
    })

    return { layers, promise }
  }

  getStyle = (config: GlobalHeatmapGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      _fetchStats: memoizeOne(fetchStats),
    })
    const { layers, promise } = this._getStyleLayers(config)
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers,
      promise,
    }
  }
}

export default HeatmapGenerator
