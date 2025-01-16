import { CompositeLayer } from '@deck.gl/core'
import type { TileLayerProps } from '@deck.gl/geo-layers';
import { TileLayer } from '@deck.gl/geo-layers'
import { PathLayer, TextLayer } from '@deck.gl/layers'

import { getLayerGroupOffset,LayerGroup } from '../../utils'

export class TilesBoundariesLayer extends CompositeLayer<TileLayerProps> {
  static layerName = 'TilesBoundariesLayer'
  renderLayers() {
    return new TileLayer({
      id: `${TilesBoundariesLayer.layerName}-tiles`,
      minZoom: 0,
      maxZoom: 9,
      maxRequests: 100,
      debounceTime: 200,
      tileSize: 256,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
      renderSubLayers: (props: any) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile
        return [
          new PathLayer(
            props,
            this.getSubLayerProps({
              id: `${props.id}-debug-tile-boundary`,
              data: [
                {
                  path: [
                    [west, north],
                    [west, south],
                    [east, south],
                    [east, north],
                    [west, north],
                  ],
                },
              ],
              getPath: (d: any) => d.path,
              widthMinPixels: 1,
              getColor: [255, 0, 0, 100],
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
            })
          ),
          new TextLayer(
            props,
            this.getSubLayerProps({
              id: `${props.id}-debug-tile-id`,
              data: [
                {
                  text: `${props.tile.index.z}/${props.tile.index.x}/${props.tile.index.y}`,
                },
              ],
              getText: (d: any) => d.text,
              getPosition: [west, north],
              getColor: [255, 255, 255],
              getSize: 12,
              getAngle: 0,
              getTextAnchor: 'start',
              getAlignmentBaseline: 'top',
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
            })
          ),
        ]
      },
    })
  }
}
