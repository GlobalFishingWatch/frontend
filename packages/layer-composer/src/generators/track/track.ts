import { scaleLinear, scalePow } from 'd3-scale'
import { FeatureCollection, LineString } from 'geojson'
import memoizeOne from 'memoize-one'
import uniq from 'lodash/uniq'
import type { LineLayer } from '@globalfishingwatch/mapbox-gl'
import { segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { Group } from '../../types'
import { Type, TrackGeneratorConfig, GlobalGeneratorConfig } from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { isConfigVisible } from '../utils'
import filterGeoJSONByTimerange from './filterGeoJSONByTimerange'
import { simplifyTrack } from './simplify-track'

const LINE_STYLES = {
  'line-width': [1, 2.5, 4, 5.5],
  'line-opacity': [1, 0.75, 0.5, 0.25],
}
const BASE_LINE_STYLE = {
  'line-width': LINE_STYLES['line-width'][0],
  'line-opacity': LINE_STYLES['line-opacity'][0],
}

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

  const filteredData = filterGeoJSONByTimerange(data, startMs, endMs)
  return filteredData
}

const getHighlightedData = (
  data: FeatureCollection,
  highlightedStart: string,
  highlightedEnd: string
) => {
  const startMs = new Date(highlightedStart).getTime()
  const endMs = new Date(highlightedEnd).getTime()

  const filteredData = filterGeoJSONByTimerange(data, startMs, endMs)

  return filteredData
}

const getHighlightedLayer = (
  id: string,
  { group = Group.TrackHighlighted, paint = {} } = {}
): LineLayer => {
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
      'line-width': 3,
      'line-opacity': 1,
      ...paint,
    },
    metadata: { group },
  }
}

const DEFAULT_TRACK_COLOR = 'rgba(0, 193, 231, 1)'

class TrackGenerator {
  type = Type.Track
  highlightSufix = '_highlighted'
  highlightEventSufix = `${this.highlightSufix}_event`

  _getStyleSources = (config: TrackGeneratorConfig & GlobalGeneratorConfig) => {
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

    if (config.highlightedEvent) {
      const highlightedData = memoizeCache[config.id].getHighlightedEventData(
        source.data,
        config.highlightedEvent.start,
        config.highlightedEvent.end
      )
      const highlightedSource = {
        id: `${config.id}${this.highlightEventSufix}`,
        type: 'geojson',
        data: highlightedData,
      }
      sources.push(highlightedSource)
    }

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
    config: TrackGeneratorConfig & GlobalGeneratorConfig,
    uniqIds: string[]
  ): LineLayer[] => {
    let paint = {
      'line-color': config.color || DEFAULT_TRACK_COLOR,
    }
    if (uniqIds.length > 1) {
      const extraStyles = Object.fromEntries(
        Object.keys(LINE_STYLES).map((paintProperty) => {
          const exprLineWidth = [
            'match',
            ['get', 'id'],
            ...uniqIds.flatMap((id, index) => {
              const styleIndex = index % 4
              return [id, (LINE_STYLES as any)[paintProperty][styleIndex]]
            }),
            (LINE_STYLES as any)[paintProperty][0],
          ]
          return [paintProperty, exprLineWidth]
        })
      )
      paint = {
        ...paint,
        ...extraStyles,
      }
    } else {
      paint = {
        ...paint,
        ...BASE_LINE_STYLE,
      }
    }

    const visibility = isConfigVisible(config)
    const layer: LineLayer = {
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

    if (visibility && config.highlightedEvent) {
      const id = `${config.id}${this.highlightEventSufix}`
      const paint = {
        'line-color': config.color || DEFAULT_TRACK_COLOR,
        'line-width': 5,
      }
      const highlightedEventLayer = getHighlightedLayer(id, {
        paint,
        group: Group.TrackHighlightedEvent,
      })
      layers.push(highlightedEventLayer)
    }

    if (visibility && config.highlightedTime) {
      const id = `${config.id}${this.highlightSufix}`
      const highlightedLayer = getHighlightedLayer(id)
      layers.push(highlightedLayer)
    }

    return layers
  }

  getStyle = (config: TrackGeneratorConfig & GlobalGeneratorConfig) => {
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
