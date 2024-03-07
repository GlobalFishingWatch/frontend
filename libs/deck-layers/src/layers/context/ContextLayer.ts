import {
  CompositeLayer,
  Color,
  PickingInfo,
  Layer,
  COORDINATE_SYSTEM,
  DefaultProps,
} from '@deck.gl/core/typed'
import { TileLayer, TileLayerProps } from '@deck.gl/geo-layers/typed'
import { Feature, GeoJsonProperties, Geometry, MultiPolygon } from 'geojson'
import { MVTLoader } from '@loaders.gl/mvt'
import { Matrix4 } from '@math.gl/core'
import { ClipExtension } from '@deck.gl/extensions/typed'
import { GeoJsonLayer } from '@deck.gl/layers/typed'
import { getPickedFeatureToHighlight } from '../../utils/layers'
import { hexToDeckColor } from '../../utils/colors'
import { LayerGroup, getLayerGroupOffset } from '../../utils/sort'
import { API_PATH } from './context.config'

export type ContextLayerProps = {
  id: string
  idProperty: string
  color: string
  datasetId: string
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
}

const defaultProps: DefaultProps<ContextLayerProps> = {
  idProperty: 'gfw_id',
}

type ContextFeature = Feature<Geometry, GeoJsonProperties>

const WORLD_SIZE = 512

export class ContextLayer extends CompositeLayer<TileLayerProps & ContextLayerProps> {
  static layerName = 'ContextLayer'
  static defaultProps = defaultProps
  layers: Layer[] = []

  getLineColor(d: ContextFeature): Color {
    const { hoveredFeatures = [], clickedFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, clickedFeatures, idProperty) ||
      getPickedFeatureToHighlight(d, hoveredFeatures, idProperty)
      ? [255, 255, 255]
      : [0, 0, 0, 0]
  }

  getFillColor(d: ContextFeature): Color {
    const { hoveredFeatures = [], idProperty } = this.props
    return getPickedFeatureToHighlight(d, hoveredFeatures, idProperty)
      ? [0, 0, 0, 50]
      : [0, 0, 0, 0]
  }

  _getBaseLayer() {
    return new TileLayer<TileLayerProps>({
      id: `${this.id}-base-layer`,
      data: `${API_PATH}/${this.props.datasetId}/context-layers/{z}/{x}/{y}`,
      loaders: [{ ...MVTLoader, mimeTypes: [...MVTLoader.mimeTypes, 'application/octet-stream'] }],
      // onViewportLoad: this.onViewportLoad,
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
            id: `${props.id}-highlight-fills`,
            lineWidthMinPixels: 1,
            getPolygonOffset: (params) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygonsBackground, params),
            pickable: true,
            getFillColor: (d) => this.getFillColor(d),
            getLineColor: [0, 0, 0, 0],
            updateTriggers: {
              getFillColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
            },
          }),
          new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
            id: `${props.id}-lines`,
            lineWidthMinPixels: 1,
            getPolygonOffset: (params) => getLayerGroupOffset(LayerGroup.OutlinePolygons, params),
            getLineColor: hexToDeckColor(this.props.color),
            getFillColor: [0, 0, 0, 0],
          }),
          new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
            id: `${props.id}-highlight-lines`,
            lineWidthMinPixels: 1,
            getPolygonOffset: (params) =>
              getLayerGroupOffset(LayerGroup.OutlinePolygonsHighlighted, params),
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
    // if (this.state.tiles?.length) {
    //   this.layers.push(
    //     ...this.state.tiles.flatMap((tile) => {
    //       const props = { ...this.props, tile, data: tile.data }
    //       const { x, y, z } = props.tile.index
    //       const worldScale = Math.pow(2, z)
    //       const xScale = WORLD_SIZE / worldScale
    //       const yScale = -xScale
    //       const xOffset = (WORLD_SIZE * x) / worldScale
    //       const yOffset = WORLD_SIZE * (1 - y / worldScale)
    //       const modelMatrix = new Matrix4().scale([xScale, yScale, 1])
    //       if (!this.context.viewport.resolution) {
    //         props.modelMatrix = modelMatrix
    //         props.coordinateOrigin = [xOffset, yOffset, 0]
    //         props.coordinateSystem = COORDINATE_SYSTEM.CARTESIAN
    //         props.extensions = [...(props.extensions || []), new ClipExtension()]
    //       }
    //       return [
    //         new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
    //           id: `${props.id}-${x}-${y}-${z}-highlight-fills`,
    //           lineWidthMinPixels: 1,
    //           pickable: true,
    //           getFillColor: (d) => this.getFillColor(d),
    //           getLineColor: [0, 0, 0, 0],
    //           updateTriggers: {
    //             getFillColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
    //           },
    //         }),
    //         new GeoJsonLayer<TileLayerProps & ContextLayerProps>(props, {
    //           id: `${props.id}-${x}-${y}-${z}-highlight-lines`,
    //           lineWidthMinPixels: 1,
    //           getLineColor: (d) => this.getLineColor(d),
    //           getFillColor: [0, 0, 0, 0],
    //           updateTriggers: {
    //             getLineColor: [this.props.clickedFeatures, this.props.hoveredFeatures],
    //           },
    //         }),
    //       ]
    //     })
    //   )
    // }

    return this.layers
  }
}
