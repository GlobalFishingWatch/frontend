import { CompositeLayer } from '@deck.gl/core/typed'
import { MVTLayer, MVTLayerProps, TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { mvtloader } from 'loaders/context/contextLoader'
import { CONTEXT_LAYERS_CONFIG } from './context.config'

export class ContextLayer extends CompositeLayer<TileLayerProps & MVTLayerProps> {
  static layerName = 'ContextLayer'

  getPickingInfo(info) {
    console.log('🚀 ~ file: ContextLayer.ts:10 ~ ContextLayer ~ getPickingInfo ~ info', info)

    return info.info
  }

  // onHover(event) {
  //   // console.log('🚀 ~ file: ContextLayer.ts:18 ~ ContextLayer ~ onHover ~ event', event)
  //   const Deck = event.layer?.context?.deck
  //   const objects = Deck?.pickMultipleObjects({ x: event.x, y: event.y })
  //   console.log('🚀 ~ file: ContextLayer.ts:18 ~ ContextLayer ~ onHover ~ objects', objects)
  //   return event
  // }

  _getBaseLayer() {
    return CONTEXT_LAYERS_CONFIG.map((l) => {
      return new MVTLayer(
        this.getSubLayerProps({
          id: l.id,
          data: l.apiPath,
          // loaders: [mvtloader],
          getLineColor: l.lineColor,
          getPickingInfo: this.getPickingInfo,
          getFillColor: [0, 0, 0, 0],
          lineWidthMinPixels: 1,
          pickable: true,
          highlightColor: [...l.lineColor, 50],
          autoHighlight: true,
          binary: true,
        })
      )
    })
  }

  _getLabelsLayer() {
    return new TileLayer(
      this.getSubLayerProps({
        id: 'labels',
        data: 'https://gateway.api.dev.globalfishingwatch.org/v2/tileset/nslabels/tile/{z}/{x}/{y}',
      })
    )
  }

  renderLayers() {
    console.log(this._getBaseLayer())
    return [...this._getBaseLayer()]
  }
}
