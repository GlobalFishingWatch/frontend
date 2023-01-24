import { CompositeLayer } from '@deck.gl/core/typed'
import { MVTLayer, MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { API_PATH, CONTEXT_LAYERS_OBJECT } from './context.config'

export type ContextsLayerProps = TileLayerProps & MVTLayerProps & { ids: string[] }

export class ContextsLayer extends CompositeLayer<ContextsLayerProps> {
  static layerName = 'ContextLayer'
  // layers = []

  // _getLabelsLayer() {
  //   return new TileLayer(
  //     this.getSubLayerProps({
  //       id: 'labels',
  //       data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/nslabels/tile/{z}/{x}/{y}',
  //     })
  //   )
  // }

  layers = this.props?.ids?.map(
    (id) =>
      new MVTLayer(
        this.getSubLayerProps({
          id,
          data: `${API_PATH}/${CONTEXT_LAYERS_OBJECT[id].dataset}/{z}/{x}/{y}`,
          zIndex: 1,
          getLineColor: CONTEXT_LAYERS_OBJECT[id].lineColor,
          getPickingInfo: this.getPickingInfo,
          getFillColor: [0, 0, 0, 0],
          lineWidthMinPixels: 1,
          pickable: true,
          highlightColor: [...CONTEXT_LAYERS_OBJECT[id].lineColor, 50],
          autoHighlight: true,
          // We need binary to be false to avoid
          // selecting too many objects
          // https://github.com/visgl/deck.gl/issues/6362
          binary: false,
          uniqueIdProperty: 'gfw_id',
        })
      )
  )

  renderLayers() {
    return this.layers
  }
}
