import memoizeOne from 'memoize-one'
import { FeatureCollection, Feature, LineString, Point } from 'geojson'
import length from '@turf/length'
import greatCircle from '@turf/great-circle'
import { LayerSpecification, SymbolLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { Dictionary, Group } from '../../types'
import { GeneratorType, RulersGeneratorConfig, Ruler } from '../types'

const COLOR = '#ffaa00'
export const RULER_INTERACTIVE_LAYER = 'points'
type RulerPointPosition = 'start' | 'end'
export type RulerPointProperties = {
  id: number
  position: RulerPointPosition
}

const makeRulerLineGeometry = (ruler: Ruler): Feature<LineString> => {
  const { start, end } = ruler
  const rawFeature: Feature<LineString> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude],
      ],
    },
  }
  const lengthKm = length(rawFeature, { units: 'kilometers' })
  const lengthNmi = lengthKm / 1.852
  const precissionKm = lengthKm > 100 ? 0 : lengthKm > 10 ? 1 : 2
  const precissionNmi = lengthNmi > 100 ? 0 : lengthNmi > 10 ? 1 : 2
  const lengthKmFormatted = lengthKm.toFixed(precissionKm)
  const lengthNmiFormatted = lengthNmi.toFixed(precissionNmi)

  const finalFeature =
    lengthKm < 100
      ? rawFeature
      : (greatCircle(
          [start.longitude, start.latitude],
          [end.longitude, end.latitude]
        ) as Feature<LineString>)

  finalFeature.properties = {}
  finalFeature.properties.label = `${lengthKmFormatted}km - ${lengthNmiFormatted}nm`
  return finalFeature
}

const makeRulerPointsGeometry = (ruler: Ruler): Feature<Point>[] => {
  const { id, start, end } = ruler
  return [
    {
      type: 'Feature',
      properties: { id, position: 'start' } as RulerPointProperties,
      geometry: {
        type: 'Point',
        coordinates: [start.longitude, start.latitude],
      },
    },
    {
      type: 'Feature',
      properties: { id, position: 'end' } as RulerPointProperties,
      geometry: {
        type: 'Point',
        coordinates: [end.longitude, end.latitude],
      },
    },
  ]
}

const getRulersGeojsons = (data: Ruler[]): Dictionary<FeatureCollection> => {
  const lines: FeatureCollection = {
    type: 'FeatureCollection',
    features: data.map(makeRulerLineGeometry),
  }
  const points: FeatureCollection = {
    type: 'FeatureCollection',
    features: data.reduce((acc, currentValue: Ruler) => {
      return acc.concat(makeRulerPointsGeometry(currentValue))
    }, [] as Feature<Point>[]),
  }
  return {
    lines,
    points,
  }
}

class RulersGenerator {
  type = GeneratorType.Rulers

  _getStyleSources = (config: RulersGeneratorConfig) => {
    const { data, id } = config
    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const { lines, points } = memoizeCache[config.id].getRulersGeojsons(data)
    return [
      { id: `${id}-lines`, type: 'geojson', data: lines },
      { id: `${id}-points`, type: 'geojson', data: points },
    ]
  }

  _getStyleLayers = (config: RulersGeneratorConfig) => {
    const { id } = config
    const layers: Partial<LayerSpecification>[] = [
      {
        id: `${id}-lines`,
        source: `${id}-lines`,
        type: 'line',
        metadata: {
          group: Group.Tool,
        },
        paint: {
          'line-dasharray': [2, 1],
          'line-width': 1,
          'line-color': COLOR,
        },
      },
      {
        id: `${id}-${RULER_INTERACTIVE_LAYER}`,
        source: `${id}-points`,
        type: 'circle',
        paint: {
          'circle-radius': 4,
          'circle-opacity': 1,
          'circle-stroke-opacity': 0,
          'circle-color': COLOR,
        },
        metadata: {
          group: Group.Tool,
          interactive: true,
          stopPropagation: true,
        },
      },
      {
        id: `${id}-labels`,
        source: `${id}-lines`,
        type: 'symbol',
        layout: {
          'text-field': '{label}',
          'symbol-placement': 'line',
          'text-allow-overlap': true,
          'text-offset': [0, -0.8],
          'text-font': ['Roboto Mono Light'],
          'text-size': 12,
        } as SymbolLayerSpecification['layout'],
        paint: {
          'text-color': COLOR,
        },
        metadata: {
          group: Group.Label,
        },
      },
    ]
    return layers
  }

  getStyle = (config: RulersGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getRulersGeojsons: memoizeOne(getRulersGeojsons),
    })
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default RulersGenerator
