import { Generators } from '@globalfishingwatch/layer-composer'

type CLUSTER = 'CARRIER_PORTAL_CLUSTER'
export const CLUSTER_TYPE: CLUSTER = 'CARRIER_PORTAL_CLUSTER'

export interface ClusterEventsGeneratorConfig extends Generators.GeneratorConfig {
  type: typeof CLUSTER_TYPE
  data?: any
}

class ClusterEventsGenerator {
  type = CLUSTER_TYPE

  _getStyleSources = (layer: ClusterEventsGeneratorConfig) => {
    const { id, data } = layer

    if (!data || !data.geojson) {
      console.warn(`${CLUSTER_TYPE} source generator needs geojson data`, layer)
      return []
    }

    const source: any = {
      type: 'geojson',
      data: (data && data.geojson) || {},
      cluster: true,
      clusterMaxZoom: 9, // Max zoom to cluster points on
      clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50),
      clusterProperties: {
        unmatched: ['any', ['==', ['get', 'authorizationStatus'], 'unmatched']],
        partially: ['any', ['==', ['get', 'authorizationStatus'], 'partially']],
      },
    }
    return [{ id, ...source }]
  }

  _getStyleLayers = (layer: ClusterEventsGeneratorConfig) => {
    const { id, data, visible } = layer
    if (!data || !data.geojson) return []

    if (!data || !data.clusterColor || !data.pointColor || !data.pointIcon) {
      console.warn(
        `${CLUSTER_TYPE} layer generator needs geojson, clusterColor and clusterIcon properties`,
        layer
      )
      return []
    }

    const { clusterColor, pointColor, pointIcon } = data
    const visibility = visible !== undefined ? (visible ? 'visible' : 'none') : 'visible'
    const layers: any = [
      {
        id: `${id}_cluster`,
        source: id,
        type: 'circle',
        layout: { visibility },
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': clusterColor,
          'circle-radius': [
            'interpolate',
            ['exponential', 0.9],
            ['get', 'point_count'],
            50,
            14,
            700,
            20,
            1200,
            26,
            3200,
            35,
            6000,
            40,
          ],
        },
        // metadata: {
        //   group: Group.Point,
        // },
      },
      {
        id: `${id}_cluster-number`,
        source: id,
        type: 'symbol',
        filter: ['has', 'point_count'],
        layout: {
          visibility,
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Roboto Medium'],
          'text-size': 16,
          'text-offset': [0, 0.13],
        },
        paint: {
          'text-color': 'rgb(1, 37, 91)',
        },
        // metadata: {
        //   group: Group.Point,
        // },
      },
      {
        id: `${id}_event`,
        source: id,
        type: 'circle',
        filter: ['!', ['has', 'point_count']],
        layout: { visibility },
        paint: {
          'circle-color': pointColor,
          'circle-radius': 12,
        },
        // metadata: {
        //   group: Group.Point,
        // },
      },
      {
        id: `${id}_event-icon`,
        source: id,
        type: 'symbol',
        filter: ['!', ['has', 'point_count']],
        layout: {
          visibility,
          'icon-image': pointIcon,
        },
        // metadata: {
        //   group: Group.Point,
        // },
      },
    ]
    return layers
  }

  getStyle = (layer: ClusterEventsGeneratorConfig) => {
    return {
      id: layer.id,
      sources: this._getStyleSources(layer),
      layers: this._getStyleLayers(layer),
    }
  }
}

export default ClusterEventsGenerator
