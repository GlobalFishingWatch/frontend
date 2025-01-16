import type { DefaultProps, LayerProps, PickingInfo } from '@deck.gl/core';
import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers';
import { MVTLayer } from '@deck.gl/geo-layers'
import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { PATH_BASENAME } from '../../layers/layers.config'
import { getFetchLoadOptions, getLayerGroupOffset, hexToDeckColor,LayerGroup } from '../../utils'

import type {
  ClusterEventType,
  ClusterFeature,
  ClusterLayerProps,
  ClusterPickingInfo,
} from './cluster.types'

const defaultProps: DefaultProps<ClusterLayerProps> = {
  eventType: 'encounter',
  maxClusterZoom: 4,
}

const ICON_MAPPING: Record<ClusterEventType, any> = {
  encounter: { x: 0, y: 0, width: 36, height: 36, mask: true },
  gap: { x: 40, y: 0, width: 36, height: 36, mask: true },
  port_visit: { x: 80, y: 0, width: 36, height: 36, mask: true },
}

export class ClusterLayer extends CompositeLayer<LayerProps & TileLayerProps & ClusterLayerProps> {
  static layerName = 'ClusterLayer'
  static defaultProps = defaultProps

  getPickingInfo = ({ info }: { info: PickingInfo<ClusterFeature> }): ClusterPickingInfo => {
    const object = {
      ...(info.object || ({} as ClusterFeature)),
      id:
        info.object?.properties.event_id ||
        `${(info.object?.geometry?.coordinates || []).join('-')}`,
      color: this.props.color,
      layerId: this.root.id,
      datasetId: this.props.datasetId,
      category: this.props.category,
      subcategory: this.props.subcategory,
    }
    return { ...info, object }
  }

  renderLayers() {
    const baseUrl = GFWAPI.generateUrl(this.props.tilesUrl as string, { absolute: true })
    const params = {
      'date-range': [this.props.start, this.props.end],
      'max-cluster-zoom': this.props.maxClusterZoom,
    }
    const url = `${baseUrl}&${stringify(params, { arrayFormat: 'indices' })}`
    const color = hexToDeckColor(this.props.color)

    return new MVTLayer<TileLayerProps<ClusterFeature>>({
      data: url,
      loadOptions: {
        ...getFetchLoadOptions(),
      },
      maxRequests: 100,
      debounceTime: 500,
      pickable: true,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Cluster, params),
      getFillColor: color,
      getIconColor: color,
      getPointRadius: (d: any) =>
        d.properties.count > 1 ? 11 + Math.sqrt(d.properties.count) / 3 : 0,
      iconAtlas: `${PATH_BASENAME}/events-sprite.png`,
      iconMapping: ICON_MAPPING,
      getIcon: (d: ClusterFeature) => d.properties.count === 1 && this.props.eventType,
      getIconSize: 16,
      pointRadiusMinPixels: 0,
      pointRadiusMaxPixels: 40,
      pointType: 'circle+icon+text',
      pointRadiusUnits: 'pixels',
      getText: (d: ClusterFeature) => d.properties.count > 1 && d.properties.count.toString(),
      getTextSize: 12,
      getTextColor: [22, 63, 137],
    })
  }
}
