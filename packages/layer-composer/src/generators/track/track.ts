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

const test = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 0,
        coordinateProperties: {
          times: [
            1514761200000,
            1514847600000,
            1514934000000,
            1515020400000,
            1515106800000,
            1515193200000,
            1515279600000,
          ],
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-72.0703125, 40.17887331434696],
          [-53.78906249999999, 43.83452678223682],
          [-41.484375, 45.336701909968134],
          [-29.179687499999996, 46.558860303117164],
          [-22.148437499999996, 47.27922900257082],
          [-13.7109375, 47.754097979680026],
          [-4.21875, 48.22467264956519],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 1,
        coordinateProperties: {
          times: [
            1514761200000,
            1514847600000,
            1514934000000,
            1515020400000,
            1515106800000,
            1515193200000,
            1515279600000,
          ],
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-7.734374999999999, 41.50857729743935],
          [-18.6328125, 42.5530802889558],
          [-30.585937499999996, 43.32517767999296],
          [-39.375, 49.38237278700955],
          [-48.515625, 50.064191736659104],
          [-56.6015625, 50.958426723359935],
          [-67.8515625, 52.05249047600099],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 2,
        coordinateProperties: {
          times: [
            1514761200000,
            1514847600000,
            1514934000000,
            1515020400000,
            1515106800000,
            1515193200000,
            1515279600000,
          ],
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-60.1171875, 32.54681317351514],
          [-48.1640625, 37.996162679728116],
          [-37.265625, 38.272688535980976],
          [-40.78125, 28.92163128242129],
          [-42.5390625, 21.289374355860424],
          [-28.828124999999996, 21.289374355860424],
          [-24.609375, 30.14512718337613],
          [-30.937499999999996, 35.17380831799959],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 3,
        coordinateProperties: {
          times: [
            1514761200000,
            1514847600000,
            1514934000000,
            1515020400000,
            1515106800000,
            1515193200000,
            1515279600000,
          ],
        },
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-42.890625, 60.58696734225869],
          [-35.859375, 55.178867663281984],
          [-31.289062500000004, 51.17934297928927],
          [-31.289062500000004, 46.558860303117164],
          [-28.4765625, 39.90973623453719],
          [-21.4453125, 37.71859032558816],
          [-11.25, 28.92163128242129],
        ],
      },
    },
  ],
}

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
    source.data = test as any

    // if (config.data) {
    //   if ((config.data as FeatureCollection).type) {
    //     source.data = config.data as FeatureCollection
    //   } else {
    //     source.data = memoizeCache[config.id].convertToGeoJSON(config.data)
    //   }
    // }

    // if (config.zoomLoadLevel && config.simplify) {
    //   source.data = memoizeCache[config.id].simplifyTrackWithZoomLevel(
    //     source.data,
    //     config.zoomLoadLevel
    //   )
    // }

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
    if (uniqIds.length > 1 && uniqIds.length <= 4) {
      const extraStyles = Object.fromEntries(
        Object.keys(LINE_STYLES).map((paintProperty) => {
          const exprLineWidth = [
            'match',
            ['get', 'id'],
            ...uniqIds.flatMap((id, index) => {
              return [id, (LINE_STYLES as any)[paintProperty][index]]
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
