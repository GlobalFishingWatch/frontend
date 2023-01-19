import { CompositeLayer } from '@deck.gl/core/typed'
import { MVTLayer, MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers/typed'
// import { mvtloader } from 'loaders/context/contextLoader'
import { API_PATH, CONTEXT_LAYERS_OBJECT } from './context.config'

export type ContextsLayerProps = TileLayerProps & MVTLayerProps & { ids: string[] }

export class ContextsLayer extends CompositeLayer<ContextsLayerProps> {
  static layerName = 'ContextLayer'
  // layers = []
  // getPickingInfo(info) {
  //   console.log('🚀 ~ file: ContextLayer.ts:10 ~ ContextLayer ~ getPickingInfo ~ info', info)

  //   return info.info
  // }

  // onHover(event) {
  //   // console.log('🚀 ~ file: ContextLayer.ts:18 ~ ContextLayer ~ onHover ~ event', event)
  //   const Deck = event.layer?.context?.deck
  //   const objects = Deck?.pickMultipleObjects({ x: event.x, y: event.y })
  //   console.log('🚀 ~ file: ContextLayer.ts:18 ~ ContextLayer ~ onHover ~ objects', objects)
  //   return event
  // }

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
          // loaders: [mvtloader],
          getLineColor: CONTEXT_LAYERS_OBJECT[id].lineColor,
          getPickingInfo: this.getPickingInfo,
          getFillColor: [0, 0, 0, 0],
          lineWidthMinPixels: 1,
          pickable: true,
          highlightColor: [...CONTEXT_LAYERS_OBJECT[id].lineColor, 50],
          autoHighlight: true,
          binary: true,
        })
      )
  )

  renderLayers() {
    return this.layers
  }
}
