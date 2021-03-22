import { AnyLayer } from '@globalfishingwatch/mapbox-gl'
import { Type, TileClusterGeneratorConfig, MergedGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'
import { Group } from '../..'

export type GlobalTileClusterGeneratorConfig = Required<
  MergedGeneratorConfig<TileClusterGeneratorConfig>
>

class TileClusterGenerator {
  type = Type.TileCluster

  _getStyleSources = (config: GlobalTileClusterGeneratorConfig) => {
    if (!config.tilesUrl) {
      throw new Error(`Tile Cluster layer should specify tilesUrl ${JSON.stringify(config)}`)
    }
    const tilesUrl = isUrlAbsolute(config.tilesUrl)
      ? config.tilesUrl
      : API_GATEWAY + config.tilesUrl
    const url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))
    if (config.dataset) {
      url.searchParams.set('datasets', config.dataset)
    }
    if (config.start && config.end) {
      url.searchParams.set('dateRange', [config.start, config.end].join(','))
    }
    if (config.eventTypes) {
      url.searchParams.set(
        'types',
        Array.isArray(config.eventTypes) ? config.eventTypes.join(',') : config.eventTypes
      )
    }

    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: 'event_id',
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: GlobalTileClusterGeneratorConfig): AnyLayer[] => {
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
          group: Group.Tool,
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
          group: Group.Tool,
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

  getStyle = (config: GlobalTileClusterGeneratorConfig) => {
    return {
      id: config.id,
      sources: this._getStyleSources(config),
      layers: this._getStyleLayers(config),
    }
  }
}

export default TileClusterGenerator
