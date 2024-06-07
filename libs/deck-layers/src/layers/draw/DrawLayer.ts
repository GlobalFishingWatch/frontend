import {
  EditableGeoJsonLayer,
  DrawPolygonMode,
  FeatureCollection,
  EditAction,
  DrawPointMode,
} from '@deck.gl-community/editable-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { CompositeLayer, LayerContext, PickingInfo } from '@deck.gl/core'
import kinks from '@turf/kinks'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { DeckLayerCategory } from '../../types'
import { DrawPickingInfo, DrawPickingObject } from './draw.types'
import { CustomModifyMode, CustomViewMode, DrawLayerMode } from './draw.modes'

type Color = [number, number, number, number]
const FILL_COLOR: Color = [189, 189, 189, 25]
const LINE_COLOR: Color = [38, 181, 242, 255]
const HANDLE_COLOR: Color = [122, 202, 67, 255]
const POLYGON_STYLES = {
  getFillColor: FILL_COLOR,
}
const LINE_STYLES = {
  lineJointRounded: true,
  getLineWidth: 2,
  getPointRadius: 10,
  getEditHandlePointColor: HANDLE_COLOR,
  getLineColor: LINE_COLOR,
  getDashArray: [4, 2],
  editHandlePointOutline: false,
  extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
}

const INITIAL_FEATURE_COLLECTION: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}
export type DrawLayerState = {
  data: FeatureCollection
  mode: DrawLayerMode
  hasOverlappingFeatures: boolean
  selectedFeatureIndexes?: number[]
}

export type DrawFeatureType = 'polygons' | 'points'
export type DrawLayerProps = {
  featureType: DrawFeatureType
}

export class DrawLayer extends CompositeLayer<DrawLayerProps> {
  static layerName = 'draw-layer'
  state!: DrawLayerState

  _getDrawingMode = () => {
    return this.props.featureType === 'points' ? new DrawPointMode() : new DrawPolygonMode()
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      mode: this._getDrawingMode(),
      data: INITIAL_FEATURE_COLLECTION,
      selectedFeatureIndexes: [],
      hasOverlappingFeatures: false,
    }
  }

  getData = () => {
    return this.state?.data
  }

  getHasOverlappingFeatures = () => {
    return this.state?.hasOverlappingFeatures
  }

  getSelectedFeatureIndexes = () => {
    return this.state?.selectedFeatureIndexes
  }

  reset = () => {
    this.setState({
      data: INITIAL_FEATURE_COLLECTION,
      mode: this._getDrawingMode(),
    })
  }

  deleteSelectedFeature = () => {
    const { data, selectedFeatureIndexes } = this.state
    const features = data.features.filter((_, index) => !selectedFeatureIndexes?.includes(index))
    this.setState({
      data: { ...data, features },
      selectedFeatureIndexes: [],
      mode: new CustomViewMode(),
    })
  }

  getPickingInfo({ info }: { info: PickingInfo }): DrawPickingInfo {
    const object = {
      ...info.object,
      id: this.props.id,
      layerId: 'draw-layer',
      category: 'draw' as DeckLayerCategory,
      index: info.index,
    } as DrawPickingObject

    return {
      ...info,
      object,
    }
  }

  setDrawingMode = () => {
    this.setState({ mode: this._getDrawingMode() })
  }

  onEdit = (editAction: EditAction<FeatureCollection>) => {
    const { updatedData, editType, editContext } = editAction
    const { featureType } = this.props
    switch (editType) {
      case 'addFeature': {
        this.setState({
          data: updatedData,
          mode: new CustomModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
        })
        break
      }
      case 'customClickOutside': {
        this.setState({
          data: updatedData,
          mode: new CustomViewMode(),
          selectedFeatureIndexes: [],
        })
        break
      }
      case 'customClickInFeature': {
        this.setState({
          data: updatedData,
          mode: new CustomModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
        })
        break
      }
      case 'movePosition': {
        const hasOverlappingFeatures =
          featureType === 'polygons'
            ? updatedData.features.some((feature: any) => kinks(feature).features.length > 0)
            : false
        this.setState({
          data: updatedData,
          hasOverlappingFeatures,
        })
        break
      }
      case 'updateTentativeFeature': {
        if (featureType === 'polygons') {
          const hasOverlappingFeatures = kinks(editContext.feature.geometry).features.length > 0
          this.setState({ hasOverlappingFeatures })
        }
        break
      }
      default:
        break
    }
  }

  renderLayers() {
    const { data, mode, selectedFeatureIndexes } = this.state

    return [
      new EditableGeoJsonLayer({
        id: 'draw',
        data,
        mode,
        onEdit: this.onEdit,
        selectedFeatureIndexes,
        ...POLYGON_STYLES,
        ...LINE_STYLES,
        getPolygonOffset: (params: any) => getLayerGroupOffset(LayerGroup.Tool, params),
        _subLayerProps: {
          geojson: {
            ...POLYGON_STYLES,
          },
          guides: {
            ...LINE_STYLES,
          },
        },
      }),
    ]
  }
}
