import { CompositeLayer, Color, PickingInfo } from '@deck.gl/core/typed'
import { MVTLayer, MVTLayerProps, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { Feature } from 'geojson'
import { Group, GROUP_ORDER } from '@globalfishingwatch/layer-composer'
// import { getPickedFeatureToHighlight } from './utils/layers'
import { API_PATH } from './context.config'

const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return [color.r, color.g, color.b]
}

export type ContextLayerProps = TileLayerProps &
  MVTLayerProps & {
    id: string
    hoveredFeatures: PickingInfo[]
    clickedFeatures: PickingInfo[]
  }

export class ContextLayer extends CompositeLayer<ContextLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}
  layers = []

  // getLineColor(d: Feature): Color {
  //   const { hoveredFeatures, clickedFeatures } = this.props
  //   return getPickedFeatureToHighlight(d, clickedFeatures) ||
  //     getPickedFeatureToHighlight(d, hoveredFeatures)
  //     ? [255, 255, 255]
  //     : [0, 0, 0, 0]
  // }

  // getFillColor(d: Feature): Color {
  //   const { clickedFeatures } = this.props
  //   return getPickedFeatureToHighlight(d, clickedFeatures) ? [0, 0, 0, 50] : [0, 0, 0, 0]
  // }

  _getBaseLayer() {
    return new MVTLayer({
      id: `base-layer`,
      // data: `${API_PATH}${this.props.generator.tilesUrl}`,
      data: `${API_PATH}/${this.props.generator.datasetId}/user-context-layer-v1/{z}/{x}/{y}`,
      // data: ['https://tiles-a.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt'],
      zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygons),
      // getLineColor: CONTEXT_LAYERS_OBJECT[this.props.id].lineColor,
      // getLineColor: hexToRgb(this.props.generator.color),
      getFillColor: hexToRgb(this.props.generator.color),
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
      id: `highlight-line-layer`,
      data: `${API_PATH}/${this.props.generator.datasetId}/user-context-layer-v1/{z}/{x}/{y}`,
      // data: ['https://tiles-a.basemaps.cartocdn.com/vectortiles/carto.streets/v1/{z}/{x}/{y}.mvt'],
      zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygonsHighlighted),
      getLineColor: [255, 255, 255, 255],
      getFillColor: [0, 0, 0, 0],

      // getLineColor: (d) => this.getLineColor(d),
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
      id: `highlight-fill-layer`,
      data: `${API_PATH}/${this.props.generator.datasetId}/user-context-layer-v1/{z}/{x}/{y}`,
      zIndex: GROUP_ORDER.indexOf(Group.OutlinePolygonsFill),
      getFillColor: [0, 0, 0, 0],
      // getFillColor: (d) => this.getFillColor(d),
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
    return [this._getBaseLayer(), this._getHighlightFillLayer(), this._getHighlightLineLayer()]
    // return this.layers
  }
}
