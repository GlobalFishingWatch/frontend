import memoizeOne from 'memoize-one'
import { FeatureCollection, Feature, Point } from 'geojson'
import { LayerSpecification, SymbolLayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { DEFAULT_BACKGROUND_COLOR } from '../background/config'
import { memoizeByLayerId, memoizeCache } from '../../utils'
import { Group } from '../../types'
import { GeneratorType, MapAnnotation, AnnotationsGeneratorConfig } from '../types'

const getAnnotationsGeojson = (data: MapAnnotation[]): FeatureCollection => {
  const points: FeatureCollection = {
    type: 'FeatureCollection',
    features: data.reduce((acc, annotation: MapAnnotation) => {
      return acc.concat({
        type: 'Feature',
        properties: { ...annotation },
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(annotation.lon as string), parseFloat(annotation.lat as string)],
        },
      })
    }, [] as Feature<Point>[]),
  }
  return points
}

class AnnotationsGenerator {
  type = GeneratorType.Annotation

  _getStyleSources = (config: AnnotationsGeneratorConfig) => {
    const { id, data } = config
    if (!data) {
      // console.warn(`${VESSEL_EVENTS_TYPE} source generator needs geojson data`, config)
      return []
    }

    const geojson = memoizeCache[config.id].getAnnotationsGeojson(data)
    return [{ id, type: 'geojson', data: geojson }]
  }

  _getStyleLayers = (config: AnnotationsGeneratorConfig) => {
    const { id } = config
    const layers: Partial<LayerSpecification>[] = [
      {
        id: `${id}-labels`,
        source: id,
        type: 'symbol',
        layout: {
          'text-field': ['get', 'label'],
          'symbol-placement': 'point',
          'text-font': ['Roboto Medium'],
          'text-size': 14,
          'text-allow-overlap': true,
          'text-ignore-placement': true,
        } as SymbolLayerSpecification['layout'],
        paint: {
          'text-color': ['coalesce', ['get', 'color'], '#fff'],
          'text-halo-color': DEFAULT_BACKGROUND_COLOR,
          'text-halo-width': 2,
        },
        metadata: {
          group: Group.Tool,
          interactive: true,
        },
      },
    ]
    return layers
  }

  getStyle = (config: AnnotationsGeneratorConfig) => {
    memoizeByLayerId(config.id, {
      getAnnotationsGeojson: memoizeOne(getAnnotationsGeojson),
    })
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default AnnotationsGenerator
