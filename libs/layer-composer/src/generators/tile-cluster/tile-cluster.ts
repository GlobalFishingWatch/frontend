import type { LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY } from '../../config'
import { Group } from '../../types'
import { isUrlAbsolute } from '../../utils'
import type { MergedGeneratorConfig,TileClusterGeneratorConfig } from '../types';
import { GeneratorType } from '../types'
import { addURLSearchParams } from '../utils'

import { DEFAULT_POINTS_SOURCE_LAYER, MAX_ZOOM_TO_CLUSTER_POINTS } from './config'

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
    let url = new URL(tilesUrl.replace(/{{/g, '{').replace(/}}/g, '}'))
    if (config.dataset) {
      url = addURLSearchParams(url, 'datasets', [config.dataset])
    }
    if (config.start && config.end) {
      url = addURLSearchParams(url, 'date-range', [config.start, config.end])
    }
    if (config.eventTypes) {
      url = addURLSearchParams(
        url,
        'types',
        Array.isArray(config.eventTypes) ? config.eventTypes : [config.eventTypes]
      )
    }

    if (config.filters?.flag) {
      url = addURLSearchParams(url, 'flags', config.filters.flag)
    }

    if (config.filters?.duration) {
      const duration = `${config.filters?.duration[0]}:${config.filters?.duration[1]}`
      url.searchParams.set('duration', duration)
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
    const breaks = config.breaks?.length ? config.breaks.slice(0, 3) : [50, 400, 5000]
    const breaksRadius = [12, 20, 28]
    const layers = [
      {
        id: `${config.id}-unclustered_point`,
        type: 'symbol',
        source: config.id,
        'source-layer': DEFAULT_POINTS_SOURCE_LAYER,
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
      {
        id: `${config.id}-clusters`,
        type: 'circle',
        source: config.id,
        'source-layer': DEFAULT_POINTS_SOURCE_LAYER,
        filter: ['>', ['get', 'count'], config.duplicatedEventsWorkaround ? 2 : 1],
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'count'],
            ...breaks.flatMap((b, i) => [b, breaksRadius[i]]),
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
        'source-layer': DEFAULT_POINTS_SOURCE_LAYER,
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
