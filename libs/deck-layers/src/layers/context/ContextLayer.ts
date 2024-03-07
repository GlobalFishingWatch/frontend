import { CompositeLayer, Color, PickingInfo, Layer, COORDINATE_SYSTEM } from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { Feature, GeoJsonProperties, Geometry, MultiPolygon } from 'geojson'
import { MVTLoader } from '@loaders.gl/mvt'
import { Matrix4 } from '@math.gl/core'
import { ClipExtension } from '@deck.gl/extensions/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
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

type ContextFeature = Feature<Geometry, GeoJsonProperties>

const WORLD_SIZE = 512

export class ContextLayer extends CompositeLayer<TileLayerProps & ContextLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = {}
  layers: Layer[] = []

  getLineColor(d: ContextFeature): Color {
    const { hoveredFeatures = [], clickedFeatures = [] } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures) ||
      getPickedFeatureToHighlight(d, hoveredFeatures)
      ? [255, 255, 255]
      : [0, 0, 0, 0]
  }

  getFillColor(d: ContextFeature): Color {
    const { clickedFeatures = [] } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures) ? [0, 0, 0, 50] : [0, 0, 0, 0]
  }

  _getBaseLayer() {
    return new TileLayer<TileLayerProps>({
      id: `${this.id}-base-layer`,
      data: `${API_PATH}/${this.props.datasetId}/context-layers/{z}/{x}/{y}`,
      pickable: true,
      loaders: [{ ...MVTLoader, mimeTypes: [...MVTLoader.mimeTypes, 'application/octet-stream'] }],
      onDataLoad: () => this.props.onDataLoad,
      // We need binary to be false to avoid
      // selecting too many objects
      // https://github.com/visgl/deck.gl/issues/6362
      // binary: false,
      // uniqueIdProperty: 'gfw_id',
      renderSubLayers: (props) => {
        const { x, y, z } = props.tile.index
        const worldScale = Math.pow(2, z)
        const xScale = WORLD_SIZE / worldScale
        const yScale = -xScale
        const xOffset = (WORLD_SIZE * x) / worldScale
        const yOffset = WORLD_SIZE * (1 - y / worldScale)
        const modelMatrix = new Matrix4().scale([xScale, yScale, 1])
        if (!this.context.viewport.resolution) {
          props.modelMatrix = modelMatrix
          props.coordinateOrigin = [xOffset, yOffset, 0]
          props.coordinateSystem = COORDINATE_SYSTEM.CARTESIAN
          props.extensions = [...(props.extensions || []), new ClipExtension()]
        }
        return [
          new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
            id: `${props.id}-lines`,
            lineWidthMinPixels: 1,
            zIndex: this.props.zIndex || GROUP_ORDER.indexOf(Group.OutlinePolygons),
            getLineColor: hexToDeckColor(this.props.color),
            getFillColor: [0, 0, 0, 0],
          }),
          new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
            id: `${props.id}-highlight-fills`,
            lineWidthMinPixels: 1,
            zIndex: this.props.zIndex || GROUP_ORDER.indexOf(Group.OutlinePolygonsFill),
            getFillColor: (d) => this.getFillColor(d),
            getLineColor: [0, 0, 0, 0],
            updateTriggers: {
              getFillColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
            },
          }),
          new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
            id: `${props.id}-highlight-lines`,
            lineWidthMinPixels: 1,
            zIndex: this.props.zIndex || GROUP_ORDER.indexOf(Group.OutlinePolygonsHighlighted),
            getLineColor: (d) => this.getLineColor(d),
            getFillColor: [0, 0, 0, 0],
            updateTriggers: {
              getLineColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
            },
          }),
        ]
      },
    })
  }

  renderLayers() {
    this.layers = [this._getBaseLayer()]

    return this.layers
  }
}
