import flatten from 'lodash/flatten'
import compact from 'lodash/compact'
import debounce from 'lodash/debounce'
import zip from 'lodash/zip'
import memoizeOne from 'memoize-one'
import { Group } from '../../types'
import { Type, HeatmapAnimatedGeneratorConfig } from '../types'
import { statsByZoom } from '../heatmap/types'
import {
  API_TILES_URL,
  API_ENDPOINTS,
  HEATMAP_DEFAULT_MAX_ZOOM,
  HEATMAP_GEOM_TYPES,
  HEATMAP_COLOR_RAMPS,
  HEATMAP_COLOR_RAMPS_RAMPS,
  HEATMAP_GEOM_TYPES_GL_TYPES,
  HEATMAP_DEFAULT_GEOM_TYPE,
} from '../heatmap/config'
import paintByGeomType from '../heatmap/heatmap-layers-paint'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { getServerSideFilters, fetchStats } from '../heatmap/utils'

export const toDays = (date: string) => {
  return Math.floor(new Date(date).getTime() / 1000 / 60 / 60 / 24)
}

export const DEFAULT_QUANTIZE_OFFSET = toDays('2019-01-01T00:00:00.000Z')

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

// TODO for now only works in days
const toQuantizedDays = (date: string, quantizeOffset: number) => {
  const days = toDays(date)
  return days - quantizeOffset
}

class HeatmapAnimatedGenerator {
  type = Type.HeatmapAnimated
  fastTilesAPI: string
  quantizeOffset = 0
  currentSetDeltaDebounced: any
  delta = 0
  statsError = 0
  stats: statsByZoom | null = null

  constructor({ fastTilesAPI = API_TILES_URL }) {
    this.fastTilesAPI = fastTilesAPI
  }

  _getStyleSources = (layer: HeatmapAnimatedGeneratorConfig) => {
    if (!layer.start || !layer.end || !layer.tileset) {
      throw new Error(
        `Heatmap generator must specify start, end and tileset parameters in ${layer}`
      )
    }
    const geomType = layer.geomType || HEATMAP_DEFAULT_GEOM_TYPE

    const tilesUrl = `${this.fastTilesAPI}/${layer.tileset}/${API_ENDPOINTS.tiles}`
    const url = new URL(tilesUrl)
    url.searchParams.set('geomType', geomType)
    url.searchParams.set('quantizeOffset', this.quantizeOffset.toString())
    url.searchParams.set('delta', this.delta.toString())
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

  _getHeatmapLayers = (layer: HeatmapAnimatedGeneratorConfig) => {
    const geomType = layer.geomType || HEATMAP_GEOM_TYPES.GRIDDED
    const colorRampType = layer.colorRamp || HEATMAP_COLOR_RAMPS.PRESENCE
    const colorRampMult = layer.colorRampMult || 1

    const delta = this.delta
    const overallMult = colorRampMult * delta

    let stops: number[] = []

    const zoom = Math.min(Math.floor(layer.zoom), layer.maxZoom || HEATMAP_DEFAULT_MAX_ZOOM)
    const statsByZoom = (this.stats !== null && this.stats[zoom]) || null
    if (statsByZoom) {
      const { median, min, max } = statsByZoom
      const medianOffseted = median - min + 0.001
      const maxOffseted = max - min + 0.002
      const medianMaxOffsetedValue = medianOffseted + (maxOffseted - medianOffseted) / 2
      stops = [
        // first meaningful value = use minimum value in stats
        min,
        // next step = use median value in stats
        min + medianOffseted * overallMult,
        // this is the intermediate value bnetween median and max
        min + medianMaxOffsetedValue * overallMult,
        // final step = max value for current zoom level
        min + maxOffseted * overallMult,
      ]
    }

    const originalColorRamp = HEATMAP_COLOR_RAMPS_RAMPS[colorRampType as any]
    let legend = stops.length ? zip(stops, originalColorRamp) : []

    const colorRampValues = flatten(legend)

    const d = toQuantizedDays(layer.start, this.quantizeOffset)
    const pickValueAt = d.toString()

    const valueExpression = ['to-number', ['get', pickValueAt]]
    const colorRamp =
      colorRampValues.length > 0
        ? ['interpolate', ['linear'], valueExpression, ...colorRampValues]
        : 'transparent'
    const paint = { ...(paintByGeomType as any)[geomType] }
    switch (geomType) {
      case HEATMAP_GEOM_TYPES.GRIDDED:
        paint['fill-color'] = colorRamp
        break
      case HEATMAP_GEOM_TYPES.EXTRUDED:
        paint['fill-extrusion-color'] = colorRamp
        const zoomFactor = layer.zoom ? 1 / Math.ceil(layer.zoom) : 1
        const extrusionHeightRamp = flatten(
          zip(stops, [
            0,
            10000 * zoomFactor,
            150000 * zoomFactor,
            300000 * zoomFactor,
            500000 * zoomFactor,
          ])
        )
        paint['fill-extrusion-height'] = [
          'interpolate',
          ['linear'],
          valueExpression,
          ...extrusionHeightRamp,
        ]

        break
      case HEATMAP_GEOM_TYPES.BLOB:
        paint['heatmap-weight'] = valueExpression
        const hStops = [0, 0.005, 0.1, 0.3, 1]
        const heatmapColorRamp = flatten(zip(hStops, originalColorRamp))
        paint['heatmap-color'] = [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          ...heatmapColorRamp,
        ]
        paint['heatmap-opacity'] = layer.opacity || 1
        break
      default:
        break
    }

    // 'desactivate' legend values that are similar
    let prevValidValue: number | null
    legend = legend.map(([value, color], i) => {
      let rdFn = Math.round
      if (i === 0) rdFn = Math.floor
      if (i === 4) rdFn = Math.ceil
      let finalValue = value ? rdFn(value) : 0
      if (i > 0 && prevValidValue === finalValue) {
        finalValue = 0
      } else {
        prevValidValue = finalValue
      }
      return [finalValue, color]
    })

    const visibility: 'visible' | 'none' = layer && layer.visible ? 'visible' : 'none'
    return [
      {
        id: layer.id,
        source: layer.id,
        'source-layer': 'temporalgrid',
        type: HEATMAP_GEOM_TYPES_GL_TYPES[geomType],
        layout: {
          visibility,
        },
        paint,
        metadata: {
          legend,
          currentlyAt: pickValueAt,
          group: Group.Heatmap,
        },
      },
    ]
  }

  _getStyleLayers = (layer: HeatmapAnimatedGeneratorConfig) => {
    if (layer.fetchStats !== true) {
      return { layers: this._getHeatmapLayers(layer) }
    }

    const serverSideFilters = getServerSideFilters(layer.start, layer.end, layer.serverSideFilter)
    const statsUrl = `${this.fastTilesAPI}/${layer.tileset}/${API_ENDPOINTS.statistics}`
    const statsPromise = memoizeCache[layer.id]._fetchStats(
      statsUrl,
      serverSideFilters,
      false,
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

  _updateDelta = (layer: HeatmapAnimatedGeneratorConfig) => {
    const newDelta = getDelta(layer.start, layer.end)
    if (newDelta === this.delta) return null

    if (this.currentSetDeltaDebounced) this.currentSetDeltaDebounced.cancel()

    const promise = new Promise((resolve) => {
      this.currentSetDeltaDebounced = debounce(() => {
        this.delta = newDelta
        resolve(this.getStyle(layer))
      }, 400)
      this.currentSetDeltaDebounced()
    })

    return promise
  }
  _setDelta = debounce(this._updateDelta, 1000)

  getStyle = (layer: HeatmapAnimatedGeneratorConfig) => {
    memoizeByLayerId(layer.id, {
      _fetchStats: memoizeOne(fetchStats),
    })
    if (!this.delta) {
      this.delta = getDelta(layer.start, layer.end)
    }
    this.quantizeOffset = layer.quantizeOffset || DEFAULT_QUANTIZE_OFFSET
    const { layers, promise } = this._getStyleLayers(layer)
    const deltaPromise: any = this._updateDelta(layer)
    const promises = compact([promise, deltaPromise])
    return {
      id: layer.id,
      sources: this._getStyleSources(layer),
      layers,
      promises,
    }
  }
}

export default HeatmapAnimatedGenerator
