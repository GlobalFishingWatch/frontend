import { AnyLayer } from '@globalfishingwatch/mapbox-gl'
import { Type, TileClusterGeneratorConfig, MergedGeneratorConfig } from '../types'
import { isUrlAbsolute } from '../../utils'
import { isConfigVisible } from '../utils'
import { API_GATEWAY } from '../../layer-composer'
import { Group } from '../..'
import { DEFAULT_BACKGROUND_COLOR } from '../background/background'

const MAX_ZOOM_TO_CLUSTER_POINTS = 4

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
    url.searchParams.set(
      'maxClusterZoom',
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
          group: Group.Cluster,
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
          'text-offset': [0, 0.13],
          'text-field': ['get', 'count'],
          'text-font': ['Roboto Medium'],
          'text-allow-overlap': true,
          visibility: isConfigVisible(config),
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
        id: 'unclustered_point',
        type: 'circle',
        source: config.id,
        'source-layer': 'points',
        filter: ['==', ['get', 'count'], 1],
        layout: {
          visibility: isConfigVisible(config),
        },
        paint: {
          'circle-color': config.color || '#FAE9A0',
          'circle-radius': 5,
          'circle-stroke-width': 1,
          'circle-stroke-color': DEFAULT_BACKGROUND_COLOR,
        },
        metadata: {
          interactive: true,
          generatorId: config.id,
          group: Group.Cluster,
        },
      },
      // {
      //   id: 'unclustered_point_icon',
      //   source: config.id,
      //   'source-layer': 'points',
      //   type: 'symbol',
      //   filter: ['==', ['get', 'count'], 1],
      //   layout: {
      //     visibility: isConfigVisible(config),
      //     'icon-image': 'carrier_portal_encounter',
      //     'icon-allow-overlap': true,
      //   },
      //   metadata: {
      //     group: Group.Cluster,
      //   },
      // },
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
