import type { GeneratorStyles} from '../../types';
import { Group } from '../../types'
import type { CartoPolygonsGeneratorConfig } from '../types';
import { GeneratorType } from '../types'

import layersDirectory from './carto-polygons-layers'

export const CARTO_FISHING_MAP_API = 'https://carto.globalfishingwatch.org/user/admin/api/v1/map'
const DEFAULT_LINE_COLOR = 'white'

interface CartoLayerOptions {
  cartoTableId: string
  sql: string
  baseUrl: string
}

const getCartoLayergroupId = async (options: CartoLayerOptions) => {
  const { cartoTableId, sql, baseUrl } = options
  const layerConfig = JSON.stringify({
    version: '1.3.0',
    stat_tag: 'API',
    layers: [{ id: cartoTableId, options: { sql } }],
  })
  const url = `${baseUrl}?config=${encodeURIComponent(layerConfig)}`

  const response = await fetch(url).then((res) => {
    if (res.status >= 400) {
      throw new Error(`loading of layer failed ${cartoTableId}`)
    }
    return res.json()
  })

  return response
}

class CartoPolygonsGenerator {
  type = GeneratorType.CartoPolygons
  tilesCacheByid: { [key: string]: any } = {}
  baseUrl: string

  constructor({ baseUrl = CARTO_FISHING_MAP_API }) {
    this.baseUrl = baseUrl
  }

  _getStyleSources = (config: CartoPolygonsGeneratorConfig) => {
    const { id } = config
    const cartoTableId = config.cartoTableId || id
    const layerData = (layersDirectory as any)[cartoTableId as string] || config

    try {
      const response = {
        sources: [{ id: cartoTableId, ...layerData.source, tiles: [] }],
      }
      if (this.tilesCacheByid[id] !== undefined) {
        response.sources[0].tiles = this.tilesCacheByid[id]
        return response
      }

      const promise = async () => {
        try {
          const { layergroupid } = await getCartoLayergroupId({
            cartoTableId,
            baseUrl: config.baseUrl || this.baseUrl,
            promoteId: 'id',
            ...layerData.source,
          })
          const tiles = [`${CARTO_FISHING_MAP_API}/${layergroupid}/{z}/{x}/{y}.mvt`]
          this.tilesCacheByid[id] = tiles
          return { style: this.getStyle(config), config }
        } catch (e: any) {
          throw e
        }
      }
      return { sources: [], promise: promise() }
    } catch (e: any) {
      console.warn(e)
      return { sources: [] }
    }
  }

  _getStyleLayers = (config: CartoPolygonsGeneratorConfig) => {
    const isSourceReady = this.tilesCacheByid[config.id] !== undefined
    if (!isSourceReady) return []

    const { id } = config
    const cartoTableId = config.cartoTableId || id

    const layerData = (layersDirectory as any)[cartoTableId] || config
    const layers: any = layerData.layers.map((glLayer: any) => {
      const layout = glLayer.layout ? { ...glLayer.layout } : {}
      const paint: any = {}
      const hasSelectedFeatures = config.selectedFeatures?.values?.length
      // TODO: make this dynamic
      if (glLayer.type === 'line') {
        paint['line-opacity'] = config.opacity !== undefined ? config.opacity : 1
        const color = config.color || DEFAULT_LINE_COLOR
        paint['line-color'] = [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          'white',
          color,
        ]
      } else if (glLayer.type === 'fill') {
        paint['fill-opacity'] = config.opacity !== undefined ? config.opacity : 1
        const fillColor = config.fillColor || DEFAULT_LINE_COLOR

        if (hasSelectedFeatures) {
          const { field = 'id', values, fill = {} } = config.selectedFeatures
          const { color = fillColor, fillOutlineColor = config.color } = fill
          const matchFilter = ['match', ['get', field], values]
          paint['fill-color'] = [...matchFilter, color, fillColor]
          paint['fill-outline-color'] = [...matchFilter, fillOutlineColor, config.color]
        } else {
          paint['fill-color'] = fillColor
          paint['fill-outline-color'] = config.color || DEFAULT_LINE_COLOR
        }
      } else if (glLayer.type === 'circle') {
        const circleColor = config.color || '#99eeff'
        const circleOpacity = config.opacity || 1
        const circleStrokeColor = config.strokeColor || 'hsla(190, 100%, 45%, 0.5)'
        const circleStrokeWidth = config.strokeWidth || 2
        const circleRadius = config.radius || 5
        paint['circle-color'] = circleColor
        paint['circle-stroke-width'] = circleStrokeWidth
        paint['circle-radius'] = circleRadius
        paint['circle-stroke-color'] = circleStrokeColor
        if (hasSelectedFeatures) {
          const { field = 'id', values, fallback = {} } = config.selectedFeatures
          const {
            color = 'rgba(50, 139, 169, 0.3)',
            opacity = 1,
            strokeColor = 'rgba(0,0,0,0)',
            strokeWidth = 0,
          } = fallback
          const matchFilter = ['match', ['get', field], values]
          paint[`circle-color`] = [...matchFilter, circleColor, color]
          paint['circle-opacity'] = [...matchFilter, circleOpacity, opacity]
          paint['circle-stroke-color'] = [...matchFilter, circleStrokeColor, strokeColor]
          paint['circle-stroke-width'] = [...matchFilter, circleStrokeWidth, strokeWidth]
        }
      }

      glLayer.metadata = {
        ...config.metadata,
        interactive: true,
        generatorId: config.id,
      }

      return { ...glLayer, layout, paint }
    })

    const newLayers: any = []
    // workaround to use line type for better rendering (uses antialiasing) but allows to fill the layer too
    layers.forEach((layer: any) => {
      if (layer.type === 'line' && config.selectedFeatures?.values?.length) {
        const { field = 'id', values, fill = {} } = config.selectedFeatures
        const { color = DEFAULT_LINE_COLOR, outlineColor = DEFAULT_LINE_COLOR } = fill
        const matchFilter = ['match', ['get', field], values]

        const selectedFillLayer = {
          ...layer,
          id: `${layer.id}_selected_features`,
          type: 'fill',
          paint: {
            'fill-color': [...matchFilter, color, 'transparent'],
            'fill-outline-color': 'transparent',
          },
          layout: {},
          metadata: {
            ...layer.metadata,
            group: Group.Basemap,
          },
        }
        newLayers.push(selectedFillLayer)

        const selectedHighlightLayer = {
          ...layer,
          id: `${layer.id}_selected_features_highlighted`,
          paint: { ...layer.paint, 'line-color': [...matchFilter, outlineColor, 'transparent'] },
          metadata: {
            ...layer.metadata,
            group: Group.OutlinePolygonsHighlighted,
          },
        }
        newLayers.push(selectedHighlightLayer)
      }
    })
    return layers.concat(newLayers)
  }

  getStyle = (layer: CartoPolygonsGeneratorConfig): GeneratorStyles => {
    const { sources, promise } = this._getStyleSources(layer) as any
    return {
      id: layer.id,
      promise,
      sources: sources,
      layers: this._getStyleLayers(layer),
    }
  }
}

export default CartoPolygonsGenerator
