import { CompositeLayer, Color, PickingInfo, Layer } from '@deck.gl/core/typed'
import { MVTLayer, MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { Feature } from 'geojson'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
import { getPickedFeatureToHighlight } from '../../utils/layers'
import { hexToDeckColor } from '../../utils/colors'
import { API_PATH } from './context.config'

export type ContextLayerProps = {
  id: string
  color: string
  datasetId: string
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
  zIndex: number
}

export class ContextLayer extends CompositeLayer<
  TileLayerProps & MVTLayerProps & ContextLayerProps
> {
  static layerName = 'ContextLayer'
  static defaultProps = {}
  layers: Layer[] = []

  getLineColor(d: Feature): Color {
    const { hoveredFeatures = [], clickedFeatures = [] } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures) ||
      getPickedFeatureToHighlight(d, hoveredFeatures)
      ? [255, 255, 255]
      : [0, 0, 0, 0]
  }

  getFillColor(d: Feature): Color {
    const { clickedFeatures = [] } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures) ? [0, 0, 0, 50] : [0, 0, 0, 0]
  }

  _getBaseLayer() {
    return new MVTLayer({
      id: `${this.id}-base-layer`,
      data: `${API_PATH}/${this.props.datasetId}/context-layers/{z}/{x}/{y}`,
      zIndex: this.props.zIndex || GROUP_ORDER.indexOf(Group.OutlinePolygons),
      getLineColor: hexToDeckColor(this.props.color),
      getFillColor: [0, 0, 0, 0],
      lineWidthMinPixels: 1,
      pickable: true,
      onDataLoad: this.props.onDataLoad,
      // We need binary to be false to avoid
      // selecting too many objects
      // https://github.com/visgl/deck.gl/issues/6362
      binary: false,
      uniqueIdProperty: 'gfw_id',
    })
  }

  _getHighlightLineLayer() {
    return new MVTLayer({
      id: `${this.id}-highlight-line-layer`,
      data: `${API_PATH}/${this.props.datasetId}/context-layers/{z}/{x}/{y}`,
      zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygonsHighlighted),
      getFillColor: [0, 0, 0, 0],
      getLineColor: (d: any) => this.getLineColor(d),
      lineWidthMinPixels: 1,
      binary: true,
      uniqueIdProperty: 'gfw_id',
      onDataLoad: this.props.onDataLoad,
      updateTriggers: {
        getLineColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
      },
    })
  }

  _getHighlightFillLayer() {
    return new MVTLayer({
      id: `${this.id}-highlight-fill-layer`,
      data: `${API_PATH}/${this.props.datasetId}/context-layers/{z}/{x}/{y}`,
      zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygonsFill),
      getLineColor: [255, 255, 255, 0],
      getFillColor: (d: any) => this.getFillColor(d),
      lineWidthMinPixels: 1,
      binary: true,
      uniqueIdProperty: 'gfw_id',
      onDataLoad: this.props.onDataLoad,
      updateTriggers: {
        getFillColor: [this.props.clickedFeatures],
      },
    })
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
