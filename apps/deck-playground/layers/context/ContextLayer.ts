import { CompositeLayer, PickingInfo } from '@deck.gl/core/typed'
import { MVTLayer, MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { getPickedFeatureToHighlight } from 'utils/layers'
import { API_PATH, CONTEXT_LAYERS_OBJECT } from './context.config'

export type ContextLayerProps = TileLayerProps &
  MVTLayerProps & { id: string; hoveredFeatures: PickingInfo[]; clickedFeatures: PickingInfo[] }

export class ContextLayer extends CompositeLayer<ContextLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}

  layers = []
  _getBaseLayer() {
    return new MVTLayer(
      this.getSubLayerProps({
        id: `base-layer`,
        data: `${API_PATH}/${CONTEXT_LAYERS_OBJECT[this.props.id].dataset}/{z}/{x}/{y}`,
        zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygons),
        getLineColor: CONTEXT_LAYERS_OBJECT[this.props.id].lineColor,
        getFillColor: [0, 0, 0, 0],
        lineWidthMinPixels: 1,
        pickable: true,
        onDataLoad: this.props.onDataLoad,
        highlightColor: [...CONTEXT_LAYERS_OBJECT[this.props.id].lineColor, 50],
        autoHighlight: true,
        // We need binary to be false to avoid
        // selecting too many objects
        // https://github.com/visgl/deck.gl/issues/6362
        binary: false,
        uniqueIdProperty: 'gfw_id',
      })
    )
  }

  _getHighlightLineLayer() {
    return new MVTLayer(
      this.getSubLayerProps({
        id: `highlight-line-layer`,
        hoveredFeatures: this.props.hoveredFeatures,
        clickedFeatures: this.props.clickedFeatures,
        data: `${API_PATH}/${CONTEXT_LAYERS_OBJECT[this.props.id].dataset}/{z}/{x}/{y}`,
        zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygonsHighlighted),
        getFillColor: [0, 0, 0, 0],
        getLineColor: (d) =>
          getPickedFeatureToHighlight(d, this.props?.clickedFeatures) ||
          getPickedFeatureToHighlight(d, this.props?.hoveredFeatures)
            ? [255, 255, 255]
            : [0, 0, 0, 0],
        lineWidthMinPixels: 1,
        binary: true,
        uniqueIdProperty: 'gfw_id',
        onDataLoad: this.props.onDataLoad,
        updateTriggers: {
          getLineColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
        },
      })
    )
  }

  _getHighlightFillLayer() {
    return new MVTLayer(
      this.getSubLayerProps({
        id: `highlight-fill-layer`,
        clickedFeatures: this.props.clickedFeatures,
        data: `${API_PATH}/${CONTEXT_LAYERS_OBJECT[this.props.id].dataset}/{z}/{x}/{y}`,
        zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygonsFill),
        getLineColor: [0, 0, 0, 0],
        getFillColor: (d) =>
          this.props?.clickedFeatures?.find(
            (f) => f.object.type === 'Feature' && f.object.properties.gfw_id === d.properties.gfw_id
          )
            ? [0, 0, 0, 50]
            : [0, 0, 0, 0],

        lineWidthMinPixels: 1,
        binary: true,
        uniqueIdProperty: 'gfw_id',
        onDataLoad: this.props.onDataLoad,
        updateTriggers: {
          getFillColor: [this.props.clickedFeatures],
        },
      })
    )
  }

  renderLayers() {
    this.layers = [
      this._getBaseLayer(),
      this._getHighlightFillLayer(),
      this._getHighlightLineLayer(),
    ]
    return this.layers
  }
}
