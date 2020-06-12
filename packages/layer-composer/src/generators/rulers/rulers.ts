import memoizeOne from 'memoize-one'
import { FeatureCollection, Feature, LineString, Point } from 'geojson'
import length from '@turf/length'
import greatCircle from '@turf/great-circle'
import { Layer } from 'mapbox-gl'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { Dictionary, Group } from '../../types'
import { Type, RulersGeneratorConfig, Ruler } from '../types'

const COLOR = '#ffaa00'

const makeRulerGeometry = (ruler: Ruler): Feature<LineString> => {
  const { start, end, isNew } = ruler
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
  const lengthKmFormatted = lengthKm.toFixed(lengthKm > 100 ? 0 : 1)
  const lengthNmiFormatted = lengthNmi.toFixed(lengthNmi > 100 ? 0 : 1)

  const finalFeature =
    lengthKm < 100
      ? rawFeature
      : (greatCircle([start.longitude, start.latitude], [end.longitude, end.latitude]) as Feature<
          LineString
        >)

  finalFeature.properties = {}
  finalFeature.properties.label = `${lengthKmFormatted}km - ${lengthNmiFormatted}nmi`
  finalFeature.properties.isNew = isNew
  return finalFeature
}

const makeRulerPointsGeometry = (ruler: Ruler): Feature<Point>[] => {
  const { start, end, isNew } = ruler
  return [
    {
      type: 'Feature',
      properties: {
        isNew,
      },
      geometry: {
        type: 'Point',
        coordinates: [start.longitude, start.latitude],
      },
    },
    {
      type: 'Feature',
      properties: {},
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
    features: data.map(makeRulerGeometry),
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
  type = Type.Rulers

  _getStyleSources = (config: RulersGeneratorConfig) => {
    const { data, id } = config
    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const { lines, points } = memoizeCache[config.id].getRulersGeojsons(data)
    return [
      { id: `rulers-${id}-lines`, type: 'geojson', data: lines },
      { id: `rulers-${id}-points`, type: 'geojson', data: points },
    ]
  }

  _getStyleLayers = (config: RulersGeneratorConfig) => {
    const { id } = config
    const layers: Partial<Layer>[] = [
      {
        id: `rulers-${id}-lines`,
        source: `rulers-${id}-lines`,
        type: 'line',
        metadata: {
          group: Group.Tool,
        },
        paint: {
          'line-dasharray': [2, 1],
          'line-width': ['case', ['==', ['get', 'isNew'], true], 1.5, 1],
          'line-color': COLOR,
        },
      },
      {
        id: `rulers-${id}-points`,
        source: `rulers-${id}-points`,
        type: 'circle',
        paint: {
          'circle-radius': ['case', ['==', ['get', 'isNew'], true], 6, 3],
          'circle-opacity': 1,
          'circle-stroke-opacity': 0,
          'circle-color': COLOR,
        },
        metadata: {
          group: Group.Tool,
        },
      },
      {
        id: `rulers-${id}-labels`,
        source: `rulers-${id}-lines`,
        type: 'symbol',
        layout: {
          'text-field': '{label}',
          'symbol-placement': 'line',
          'text-allow-overlap': true,
          'text-offset': [0, -0.8],
          'text-font': [
            'case',
            ['==', ['get', 'isNew'], true],
            ['literal', ['Roboto Medium']],
            ['literal', ['Roboto Mono Light']],
          ],
          'text-size': ['case', ['==', ['get', 'isNew'], true], 13, 12],
        },
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
