import { CompositeLayer } from '@deck.gl/core'
import { TileLayer } from '@deck.gl/geo-layers'
import { PathLayer, TextLayer } from '@deck.gl/layers'

import { getLayerGroupOffset, LayerGroup } from '../../utils'
import {
  FOURWINGS_TILE_SIZE,
  HEATMAP_HIGH_RES_ID,
  HEATMAP_ID,
  HEATMAP_LOW_RES_ID,
} from '../fourwings/fourwings.config'
import type { FourwingsVisualizationMode } from '../fourwings/fourwings.types'
import {
  getResolutionByVisualizationMode,
  getZoomOffsetByResolution,
} from '../fourwings/heatmap/fourwings-heatmap.utils'

const colorByVisualizationMode = {
  [HEATMAP_ID]: [255, 0, 0, 100],
  [HEATMAP_HIGH_RES_ID]: [0, 255, 0, 100],
  [HEATMAP_LOW_RES_ID]: [0, 0, 255, 100],
}

export type TilesBoundariesLayerProps = {
  id: string
  visualizationMode: FourwingsVisualizationMode
}

export class TilesBoundariesLayer extends CompositeLayer<TilesBoundariesLayerProps> {
  static layerName = 'TilesBoundariesLayer'

  renderLayers() {
    const { visualizationMode = HEATMAP_ID } = this.props
    const resolution = getResolutionByVisualizationMode(visualizationMode)
    return new TileLayer({
      id: `${this.props.id}-${visualizationMode}-tiles`,
      minZoom: 0,
      maxZoom: 9,
      maxRequests: 100,
      debounceTime: 200,
      tileSize: FOURWINGS_TILE_SIZE,
      getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Label, params),
      zoomOffset: getZoomOffsetByResolution(resolution!, this.context.viewport.zoom),
      renderSubLayers: (props: any) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile
        return [
          new PathLayer(
            props,
            this.getSubLayerProps({
              id: `${props.id}-${visualizationMode}-debug-tile-boundary`,
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
              getColor:
                colorByVisualizationMode[
                  visualizationMode as keyof typeof colorByVisualizationMode
                ],
              getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
            })
          ),
          new TextLayer(
            props,
            this.getSubLayerProps({
              id: `${props.id}-${visualizationMode}-debug-tile-id`,
              data: [
                {
                  text: `${visualizationMode.replace('heatmap-', '')}: ${props.tile.index.z}/${props.tile.index.x}/${props.tile.index.y}`,
                },
              ],
              getText: (d: any) => d.text,
              getPixelOffset: [
                0,
                visualizationMode === HEATMAP_ID
                  ? 0
                  : visualizationMode === HEATMAP_LOW_RES_ID
                    ? 15
                    : 30,
              ],
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
