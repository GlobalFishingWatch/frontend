import flatten from 'lodash/flatten'
import zip from 'lodash/zip'
import { scalePow } from 'd3-scale'
import memoizeOne from 'memoize-one'
import { Group } from '../../types'
import { Type, HeatmapGeneratorConfig, GlobalGeneratorConfig } from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import paintByGeomType from './heatmap-layers-paint'
import fetchStats from './util/fetch-stats'
import getServerSideFilters from './util/get-server-side-filters'
import {
  API_TILES_URL,
  API_ENDPOINTS,
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
  fastTilesAPI: string
  statsError = 0
  stats: statsByZoom | null = null
  geomType = HEATMAP_GEOM_TYPES.GRIDDED

  constructor({ fastTilesAPI = API_TILES_URL }) {
    this.fastTilesAPI = fastTilesAPI
  }

  _getStyleSources = (layer: GlobalHeatmapGeneratorConfig) => {
    if (!layer.start || !layer.end || !layer.tileset) {
      throw new Error(
        `Heatmap generator must specify start, end and tileset parameters in ${layer}`
      )
    }

    const tilesUrl = `${this.fastTilesAPI}/${layer.tileset}/${API_ENDPOINTS.tiles}`
    const url = new URL(tilesUrl)
    url.searchParams.set('geomType', this.geomType)
    url.searchParams.set('singleFrame', 'true')
    url.searchParams.set(
      'serverSideFilters',
      getServerSideFilters(layer.start, layer.end, layer.serverSideFilter)
    )

    return [
      {
        id: layer.id,
        type: 'temporalgrid' as const,
        tiles: [decodeURI(url.toString())],
        maxzoom: layer.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM,
      },
    ]
  }

  _getHeatmapLayers = (layer: GlobalHeatmapGeneratorConfig) => {
    const colorRampType = layer.colorRamp || HEATMAP_COLOR_RAMPS.PRESENCE

    let stops: number[] = []
    const zoom = Math.min(Math.floor(layer.zoom), layer.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM)
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
    const paint: any = paintByGeomType[this.geomType]
    paint['fill-color'] = colorRamp

    const visibility: 'visible' | 'none' = layer && layer.visible ? 'visible' : 'none'
    return [
      {
        id: layer.id,
        source: layer.id,
        'source-layer': 'temporalgrid',
        type: HEATMAP_GEOM_TYPES_GL_TYPES[this.geomType],
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

  _getStyleLayers = (layer: GlobalHeatmapGeneratorConfig) => {
    if (layer.fetchStats !== true || !layer.start || !layer.end) {
      return { layers: this._getHeatmapLayers(layer) }
    }

    const statsFilters = [layer.serverSideFilter, layer.statsFilter].filter((f) => f).join(' AND ')
    const serverSideFilters = getServerSideFilters(layer.start, layer.end, statsFilters)
    // use statsError to invalidate cache and try again when it fails
    const statsUrl = `${this.fastTilesAPI}/${layer.tileset}/${API_ENDPOINTS.statistics}`
    const statsPromise = memoizeCache[layer.id]._fetchStats(
      statsUrl,
      serverSideFilters,
      true,
      this.statsError
    )
    const layers = this._getHeatmapLayers(layer)

    if (statsPromise.resolved) {
      return { layers }
    }

    const promise = new Promise((resolve, reject) => {
      statsPromise.then((stats: statsByZoom) => {
        this.stats = stats
        if (this.statsError > 0) {
          this.statsError = 0
        }
        resolve(this.getStyle(layer))
      })
      statsPromise.catch((e: any) => {
        this.statsError++
        reject(e)
      })
    })

    return { layers, promise }
  }

  getStyle = (layer: GlobalHeatmapGeneratorConfig) => {
    memoizeByLayerId(layer.id, {
      _fetchStats: memoizeOne(fetchStats),
    })
    const { layers, promise } = this._getStyleLayers(layer)
    return {
      id: layer.id,
      sources: this._getStyleSources(layer),
      layers,
      promise,
    }
  }
}

export default HeatmapGenerator
