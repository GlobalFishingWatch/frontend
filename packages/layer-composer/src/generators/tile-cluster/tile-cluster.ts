import { AnyLayer } from '@globalfishingwatch/mapbox-gl'
import { Type, TileClusterGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'

class TileClusterGenerator {
  type = Type.TileCluster

  _getStyleSources = (config: TileClusterGeneratorConfig) => {
    if (!config.tilesUrl) {
      throw new Error(`Tile Cluster layer should specify tilesUrl ${JSON.stringify(config)}`)
    }
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl
    return [
      {
        id: config.id,
        type: 'vector',
        tiles: [tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}')],
      },
    ]
  }

  _getStyleLayers = (config: TileClusterGeneratorConfig): AnyLayer[] => {
    const layers = [
      {
        id: 'clusters',
        type: 'circle',
        source: config.id,
        'source-layer': 'points',
        filter: ['>', ['get', 'count'], 1],
        paint: {
          'circle-radius': [
            'interpolate',
            ['exponential', 0.9],
            ['get', 'count'],
            50,
            12,
            400,
            16,
            5000,
            24,
          ],
          'circle-color': config.color || '#FAE9A0',
        },
        layout: {
          visibility: isConfigVisible(config),
        },
        metadata: {
          interactive: true,
          generatorId: config.id,
        },
      },
      {
        id: 'cluster_count',
        type: 'symbol',
        source: config.id,
        'source-layer': 'points',
        filter: ['>', ['get', 'count'], 1],
        layout: {
          'text-size': 14,
          'text-field': ['get', 'count'],
          'text-font': ['Roboto Mono Light'],
          visibility: isConfigVisible(config),
        },
        paint: {
          'text-color': '#163f89',
        },
        metadata: {
          generatorId: config.id,
        },
      },
      {
        id: 'unclustered-point',
        type: 'circle',
        source: config.id,
        'source-layer': 'points',
        filter: ['==', ['get', 'count'], 1],
        layout: {
          visibility: isConfigVisible(config),
        },
        paint: {
          'circle-color': config.color || '#FAE9A0',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
        metadata: {
          interactive: true,
          generatorId: config.id,
        },
      },
    ]
    return layers as AnyLayer[]
  }

  getStyle = (config: TileClusterGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default TileClusterGenerator
