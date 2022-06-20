import { LayerSpecification } from '@globalfishingwatch/maplibre-gl'
import { GeneratorType, TileClusterGeneratorConfig, MergedGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { API_GATEWAY } from '../../config'
import { Group } from '../../types'

const MAX_ZOOM_TO_CLUSTER_POINTS = 4

export type GlobalTileClusterGeneratorConfig = Required<
  MergedGeneratorConfig<TileClusterGeneratorConfig>
>

class TileClusterGenerator {
  type = GeneratorType.TileCluster

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
      url.searchParams.set('date-range', [config.start, config.end].join(','))
    }
    if (config.eventTypes) {
      url.searchParams.set(
        'types',
        Array.isArray(config.eventTypes) ? config.eventTypes.join(',') : config.eventTypes
      )
    }
    url.searchParams.set(
      'max-cluster-zoom',
      (config.maxZoomCluster || MAX_ZOOM_TO_CLUSTER_POINTS).toString()
    )

    return [
      {
        id: config.id,
        type: 'vector',
        promoteId: 'event_id',
        tiles: [decodeURI(url.toString())],
      },
    ]
  }

  _getStyleLayers = (config: GlobalTileClusterGeneratorConfig): LayerSpecification[] => {
    const activeFilter = ['case', ['==', ['get', 'event_id'], config.currentEventId || null]]
    const layers = [
      {
        id: `${config.id}-clusters`,
        type: 'circle',
        source: config.id,
        'source-layer': 'points',
        filter: ['>', ['get', 'count'], config.duplicatedEventsWorkaround ? 2 : 1],
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
        metadata: {
          interactive: true,
          generatorId: config.id,
          group: Group.Cluster,
        },
      },
      {
        id: `${config.id}-cluster_count`,
        type: 'symbol',
        source: config.id,
        'source-layer': 'points',
        filter: ['>', ['get', 'count'], config.duplicatedEventsWorkaround ? 2 : 1],
        layout: {
          'text-size': 14,
          'text-offset': [0, 0.13],
          'text-field': config.duplicatedEventsWorkaround
            ? ['to-string', ['/', ['number', ['get', 'count']], 2]]
            : ['get', 'count'],
          'text-font': ['Roboto Medium'],
          'text-allow-overlap': true,
        },
        paint: {
          'text-color': '#163f89',
        },
        metadata: {
          generatorId: config.id,
          group: Group.Cluster,
        },
      },
      {
        id: `${config.id}-unclustered_point`,
        type: 'symbol',
        source: config.id,
        'source-layer': 'points',
        filter: ['<=', ['get', 'count'], config.duplicatedEventsWorkaround ? 2 : 1],
        layout: {
          'icon-allow-overlap': true,
          'icon-size': [...activeFilter, 1.5, 1],
          'icon-image': [...activeFilter, 'encounter-highlight', 'encounter'],
        },
        metadata: {
          interactive: true,
          generatorId: config.id,
          uniqueFeatureInteraction: true,
          group: Group.Cluster,
        },
      },
    ]
    return layers as LayerSpecification[]
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
