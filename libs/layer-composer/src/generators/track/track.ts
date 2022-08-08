import { scaleLinear, scalePow } from 'd3-scale'
import { FeatureCollection, LineString } from 'geojson'
import memoizeOne from 'memoize-one'
import { uniq } from 'lodash'
import convert from 'color-convert'
import type { LineLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { Group } from '../../types'
import { GeneratorType, TrackGeneratorConfig, MergedGeneratorConfig } from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { isConfigVisible } from '../utils'
import filterTrackByTimerange from './filterTrackByTimerange'
import { simplifyTrack } from './simplify-track'

export const TRACK_HIGHLIGHT_SUFFIX = '_highlighted'

const mapZoomToMinPosΔ = (zoomLoadLevel: number) => {
  // first normalize and invert z level
  const normalizedZoom = scaleLinear().clamp(true).range([1, 0]).domain([3, 12])(zoomLoadLevel)

  const MIN_POS_Δ_LOW_ZOOM = 0.1
  const MIN_POS_Δ_HIGH_ZOOM = 0.0005
  const DETAIL_INCREASE_RATE = 1.5 // Higher = min delta lower at intermediate zoom levels = more detail at intermediate zoom levels

  const minPosΔ = scalePow()
    .clamp(true)
    .exponent(DETAIL_INCREASE_RATE)
    .range([MIN_POS_Δ_HIGH_ZOOM, MIN_POS_Δ_LOW_ZOOM])
    .domain([0, 1])(normalizedZoom)

  return minPosΔ
}

const simplifyTrackWithZoomLevel = (
  data: FeatureCollection,
  zoomLoadLevel: number
): FeatureCollection => {
  const s = mapZoomToMinPosΔ(zoomLoadLevel)
  const simplifiedData = simplifyTrack(data as FeatureCollection<LineString>, s)
  return simplifiedData
}

const filterByTimerange = (data: FeatureCollection, start: string, end: string) => {
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()

  const filteredData = filterTrackByTimerange(data, startMs, endMs)
  return filteredData
}

const getHighlightedData = (
  data: FeatureCollection,
  highlightedStart: string,
  highlightedEnd: string
) => {
  const startMs = new Date(highlightedStart).getTime()
  const endMs = new Date(highlightedEnd).getTime()

  const filteredData = filterTrackByTimerange(data, startMs, endMs)

  return filteredData
}

const getHighlightedLayer = (
  id: string,
  { group = Group.TrackHighlighted, paint = {} } = {}
): LineLayerSpecification => {
  return {
    id,
    type: 'line',
    source: id,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
      visibility: 'visible',
    },
    paint: {
      'line-color': 'white',
      'line-width': 1.5,
      'line-opacity': 1,
      ...paint,
    },
    metadata: { group },
  }
}

const DEFAULT_TRACK_COLOR = 'rgba(0, 193, 231, 1)'

export type GlobalTrackGeneratorConfig = MergedGeneratorConfig<TrackGeneratorConfig>

class TrackGenerator {
  type = GeneratorType.Track
  highlightSufix = TRACK_HIGHLIGHT_SUFFIX
  highlightEventSufix = `${TRACK_HIGHLIGHT_SUFFIX}_event`

  _getStyleSources = (config: GlobalTrackGeneratorConfig) => {
    const defaultGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    const source: Record<string, any> = {
      id: config.id,
      type: 'geojson',
      data: defaultGeoJSON,
    }
    const sources = [source]

    if (config.data) {
      if ((config.data as FeatureCollection).type) {
        source.data = config.data as FeatureCollection
      } else {
        source.data = memoizeCache[config.id].convertToGeoJSON(config.data)
      }
    }

    if (config.zoomLoadLevel && config.simplify) {
      source.data = memoizeCache[config.id].simplifyTrackWithZoomLevel(
        source.data,
        config.zoomLoadLevel
      )
    }

    const uniqIds: string[] = uniq(
      source.data.features
        .filter((f: any) => f.properties?.id !== undefined)
        .map((f: any) => f.properties?.id)
    )

    if (config.start && config.end) {
      source.data = memoizeCache[config.id].filterByTimerange(source.data, config.start, config.end)
    }

    // if (config.highlightedEvent) {
    //   const highlightedData = memoizeCache[config.id].getHighlightedEventData(
    //     source.data,
    //     config.highlightedEvent.start,
    //     config.highlightedEvent.end
    //   )
    //   const highlightedSource = {
    //     id: `${config.id}${this.highlightEventSufix}`,
    //     type: 'geojson',
    //     data: highlightedData,
    //   }
    //   sources.push(highlightedSource)
    // }

    if (config.highlightedTime) {
      const highlightedData = memoizeCache[config.id].getHighlightedData(
        source.data,
        config.highlightedTime.start,
        config.highlightedTime.end
      )
      const highlightedSource = {
        id: `${config.id}${this.highlightSufix}`,
        type: 'geojson',
        data: highlightedData,
      }
      sources.push(highlightedSource)
    }

    return { sources, uniqIds }
  }

  _getStyleLayers = (
    config: GlobalTrackGeneratorConfig,
    uniqIds: string[]
  ): LineLayerSpecification[] => {
    const paint = {
      'line-color': config.color || DEFAULT_TRACK_COLOR,
      'line-width': 1.5,
      'line-opacity': 1,
    }

    if (uniqIds.length > 1) {
      let exprLineColor
      if (config.useOwnColor) {
        exprLineColor = ['get', 'color']
      } else {
        const HUE_CHANGE_DELTA = 40
        const hueIncrement = HUE_CHANGE_DELTA / (uniqIds.length - 1)
        const hsl = convert.hex.hsl(config.color || '')
        const baseHue = hsl[0]
        exprLineColor = [
          'match',
          ['get', 'id'],
          ...uniqIds.flatMap((id, index) => {
            const rawHue = baseHue - HUE_CHANGE_DELTA / 2 + hueIncrement * index
            const hue = (rawHue + 360) % 360
            const color = `#${convert.hsl.hex([hue, hsl[1], hsl[2]])}`
            return [id, color]
          }),
          config.color,
        ]
      }
      paint['line-color'] = exprLineColor as any
    }

    const visibility = isConfigVisible(config)
    const layer: LineLayerSpecification = {
      id: config.id,
      source: config.id,
      type: 'line',
      layout: { visibility },
      paint,
      metadata: {
        group: Group.Track,
      },
    }
    const layers = [layer]

    // if (visibility && config.highlightedEvent) {
    //   const id = `${config.id}${this.highlightEventSufix}`
    //   const paint = {
    //     'line-color': config.color || DEFAULT_TRACK_COLOR,
    //     'line-width': 5,
    //   }
    //   const highlightedEventLayer = getHighlightedLayer(id, {
    //     paint,
    //     group: Group.TrackHighlightedEvent,
    //   })
    //   layers.push(highlightedEventLayer)
    // }

    if (visibility && config.highlightedTime) {
      const id = `${config.id}${this.highlightSufix}`
      const highlightedLayer = getHighlightedLayer(id)
      layers.push(highlightedLayer)
    }

    return layers
  }

  getStyle = (config: GlobalTrackGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      convertToGeoJSON: memoizeOne(segmentsToGeoJSON),
      simplifyTrackWithZoomLevel: memoizeOne(simplifyTrackWithZoomLevel),
      filterByTimerange: memoizeOne(filterByTimerange),
      getHighlightedData: memoizeOne(getHighlightedData),
      getHighlightedEventData: memoizeOne(getHighlightedData),
    })

    const { sources, uniqIds } = this._getStyleSources(config)
    return {
      id: config.id,
      sources,
      layers: this._getStyleLayers(config, uniqIds),
    }
  }
}

export default TrackGenerator
