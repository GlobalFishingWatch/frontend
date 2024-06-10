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
const ERROR_COLOR: Color = [360, 62, 98, 255]
const HANDLE_COLOR: Color = [122, 202, 67, 255]

const POLYGON_STYLES = {
  getFillColor: FILL_COLOR,
}
const LINE_STYLES = {
  lineJointRounded: true,
  getLineWidth: 2,
  getPointRadius: 10,
  getEditHandlePointColor: HANDLE_COLOR,
  getLineColor: (feature: any) => {
    return feature.properties.hasOverlappingFeatures ? ERROR_COLOR : LINE_COLOR
  },
  getDashArray: [4, 2],
  editHandlePointOutline: false,
  extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
}

function getFeaturesWithOverlapping(features: FeatureCollection['features']) {
  return features.map((feature: any) => ({
    ...feature,
    properties: {
      ...feature.properties,
      hasOverlappingFeatures: kinks(feature.geometry).features.length > 0,
    },
  }))
}

function getDrawDataParsed(data: FeatureCollection, featureType: 'polygons' | 'points') {
  if (featureType === 'points') return data
  return {
    ...data,
    features: getFeaturesWithOverlapping(data.features),
  }
}

const INITIAL_FEATURE_COLLECTION: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}
export type DrawLayerState = {
  data: FeatureCollection
  mode: DrawLayerMode
  selectedFeatureIndexes?: number[]
  hasTentativeOverlappingFeatures: boolean
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
      hasTentativeOverlappingFeatures: false,
    }
  }

  getData = () => {
    return this.state?.data
  }

  getHasOverlappingFeatures = () => {
    return (
      this.state?.hasTentativeOverlappingFeatures ||
      this.state?.data.features.some((feature: any) => feature.properties.hasOverlappingFeatures)
    )
  }

  getSelectedFeatureIndexes = () => {
    return this.state?.selectedFeatureIndexes
  }

  reset = () => {
    this.setState({
      data: INITIAL_FEATURE_COLLECTION,
      selectedFeatureIndexes: [],
      mode: this._getDrawingMode(),
      hasTentativeOverlappingFeatures: false,
    })
  }

  deleteSelectedFeature = () => {
    const { data, selectedFeatureIndexes } = this.state
    const features = data.features.filter((_, index) => !selectedFeatureIndexes?.includes(index))
    this.setState({
      data: { ...data, features },
      selectedFeatureIndexes: [],
      hasTentativeOverlappingFeatures: false,
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
          data: getDrawDataParsed(updatedData, featureType),
          mode: new CustomModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          hasTentativeOverlappingFeatures: false,
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
        this.setState({
          data: getDrawDataParsed(updatedData, featureType),
        })
        break
      }
      case 'updateTentativeFeature': {
        if (featureType === 'polygons') {
          const hasTentativeOverlappingFeatures =
            kinks(editContext.feature.geometry).features.length > 0
          this.setState({ hasTentativeOverlappingFeatures })
        }
        break
      }
      default:
        break
    }
  }

  renderLayers() {
    const { data, mode, selectedFeatureIndexes, hasTentativeOverlappingFeatures } = this.state

    return [
      new EditableGeoJsonLayer({
        id: 'draw',
        data,
        mode,
        onEdit: this.onEdit,
        selectedFeatureIndexes,
        ...POLYGON_STYLES,
        ...LINE_STYLES,
        getLineColor: (feature: any) => {
          return hasTentativeOverlappingFeatures || feature.properties.hasOverlappingFeatures
            ? ERROR_COLOR
            : LINE_COLOR
        },
        updateTriggers: {
          getLineColor: [hasTentativeOverlappingFeatures],
        },
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
