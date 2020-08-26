import flatten from 'lodash/flatten'
import zip from 'lodash/zip'
import { scalePow } from 'd3-scale'
import memoizeOne from 'memoize-one'
import { Group } from '../../types'
import { Type, HeatmapGeneratorConfig, GlobalGeneratorConfig } from '../types'
import { memoizeByLayerId, memoizeCache, isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'
import paintByGeomType from './heatmap-layers-paint'
import fetchStats from './util/fetch-stats'
import getServerSideFilters from './util/get-server-side-filters'
import {
  HEATMAP_GEOM_TYPES,
  HEATMAP_COLOR_RAMPS,
  HEATMAP_COLOR_RAMPS_RAMPS,
  HEATMAP_GEOM_TYPES_GL_TYPES,
  HEATMAP_DEFAULT_MAX_ZOOM,
} from './config'
import { statsByZoom } from './types'

type GlobalHeatmapGeneratorConfig = HeatmapGeneratorConfig & GlobalGeneratorConfig

class HeatmapGenerator {
  type = Type.Heatmap
  statsError = 0
  stats: statsByZoom | null = null

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
    url.searchParams.set('geomType', config.geomType || HEATMAP_GEOM_TYPES.GRIDDED)
    url.searchParams.set('singleFrame', 'true')
    url.searchParams.set(
      'serverSideFilters',
      getServerSideFilters(config.start, config.end, config.serverSideFilter)
    )

    return [
      {
        id: config.id,
        type: 'temporalgrid' as const,
        tiles: [decodeURI(url.toString())],
        maxzoom: config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM,
      },
    ]
  }

  _getHeatmapLayers = (config: GlobalHeatmapGeneratorConfig) => {
    const colorRampType = config.colorRamp || HEATMAP_COLOR_RAMPS.PRESENCE
    const geomType = config.geomType || HEATMAP_GEOM_TYPES.GRIDDED

    let stops: number[] = []
    const zoom = Math.min(Math.floor(config.zoom), config.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM)
    const statsByZoom = (this.stats !== null && this.stats[zoom]) || null
    if (statsByZoom) {
      const { min, max, avg } = statsByZoom
      if (min && max && avg) {
        const precision = Array.from(max.toString()).reduce((acc) => acc * 10, 0.1)
        const roundedMax = Math.floor(max / precision) * precision
        const scale = scalePow().exponent(10).domain([0, 0.5, 1]).range([min, avg, roundedMax])

        stops = [0, min, scale(0.25), scale(0.5), scale(0.75), roundedMax]

        const prevStepValues: number[] = []
        stops = stops.map((stop, index) => {
          let roundValue = Math.round(stop)
          if (prevStepValues.indexOf(roundValue) > -1) {
            roundValue = prevStepValues[index - 1] + 1
          }
          prevStepValues.push(roundValue)
          return roundValue
        })
      }
    }

    const pickValueAt = 'value'
    const originalColorRamp = HEATMAP_COLOR_RAMPS_RAMPS[colorRampType as string]
    const legend = stops.length ? zip(stops, originalColorRamp) : []

    const colorRampValues = flatten(legend)
    const valueExpression = ['to-number', ['get', pickValueAt]]
    const colorRamp =
      colorRampValues.length > 0
        ? ['interpolate', ['linear'], valueExpression, ...colorRampValues]
        : 'transparent'
    const paint: any = paintByGeomType[geomType]
    paint['fill-color'] = colorRamp

    const visibility = isConfigVisible(config)
    return [
      {
        id: config.id,
        source: config.id,
        'source-layer': 'temporalgrid',
        type: HEATMAP_GEOM_TYPES_GL_TYPES[geomType],
        layout: {
          visibility,
        },
        paint,
        metadata: {
          legend,
          gridArea: statsByZoom && statsByZoom.area,
          currentlyAt: pickValueAt,
          group: Group.Heatmap,
        },
      },
    ]
  }

  _getStyleLayers = (config: GlobalHeatmapGeneratorConfig) => {
    if (config.fetchStats !== true || !config.start || !config.end || !config.statsUrl) {
      return { layers: this._getHeatmapLayers(config) }
    }

    const statsFilters = [config.serverSideFilter, config.statsFilter]
      .filter((f) => f)
      .join(' AND ')
    const serverSideFilters = getServerSideFilters(config.start, config.end, statsFilters)
    const statsUrl = isUrlAbsolute(config.statsUrl)
      ? config.statsUrl
      : API_GATEWAY + config.statsUrl
    // use statsError to invalidate cache and try again when it fails
    const statsPromise = memoizeCache[config.id]._fetchStats(
      statsUrl,
      {
        serverSideFilters,
        singleFrame: true,
        token: config.token,
      },
      this.statsError
    )
    const layers = this._getHeatmapLayers(config)

    if (statsPromise.resolved) {
      return { layers }
    }

    const promise = new Promise((resolve, reject) => {
      statsPromise.then((stats: statsByZoom) => {
        this.stats = stats
        if (this.statsError > 0) {
          this.statsError = 0
        }
        resolve(this.getStyle(config))
      })
      statsPromise.catch((e: any) => {
        this.statsError++
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
