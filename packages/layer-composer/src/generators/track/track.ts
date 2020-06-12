import { scaleLinear, scalePow } from 'd3-scale'
import { FeatureCollection, LineString } from 'geojson'
import memoizeOne from 'memoize-one'
import { Group } from '../../types'
import { Type, TrackGeneratorConfig } from '../types'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import valuesArrayToGeoJSON from './segments-to-geojson'
import filterGeoJSONByTimerange from './filterGeoJSONByTimerange'
import { simplifyTrack } from './simplify-track'

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

const getHighlightedLayer = (id: string, { group = Group.TrackHighlighted, paint = {} } = {}) => {
  return {
    id,
    type: 'line',
    source: id,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': 'white',
      'line-width': 2,
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

  _getStyleSources = (config: TrackGeneratorConfig) => {
    const defaultGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }

    const source = {
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

    return sources
  }

  _getStyleLayers = (config: TrackGeneratorConfig) => {
    const layer = {
      type: 'line',
      id: config.id,
      source: config.id,
      layout: {},
      paint: {
        'line-color': config.color || DEFAULT_TRACK_COLOR,
        'line-opacity': 0.9,
      },
      metadata: {
        group: Group.Track,
      },
    }
    const layers = [layer]

    if (config.highlightedEvent) {
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

    if (config.highlightedTime) {
      const id = `${config.id}${this.highlightSufix}`
      const highlightedLayer = getHighlightedLayer(id)
      layers.push(highlightedLayer)
    }

    return layers
  }

  getStyle = (config: TrackGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      convertToGeoJSON: memoizeOne(valuesArrayToGeoJSON),
      simplifyTrackWithZoomLevel: memoizeOne(simplifyTrackWithZoomLevel),
      filterByTimerange: memoizeOne(filterByTimerange),
      getHighlightedData: memoizeOne(getHighlightedData),
      getHighlightedEventData: memoizeOne(getHighlightedData),
    })
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default TrackGenerator
