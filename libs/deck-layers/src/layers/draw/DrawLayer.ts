import {
  EditableGeoJsonLayer,
  FeatureCollection,
  EditAction,
  CompositeMode,
  TranslateMode,
} from '@deck.gl-community/editable-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { CompositeLayer, LayerContext, PickingInfo } from '@deck.gl/core'
import kinks from '@turf/kinks'
import { Position } from 'geojson'
import { COLOR_HIGHLIGHT_LINE, LayerGroup, getLayerGroupOffset } from '../../utils'
import { DeckLayerCategory } from '../../types'
import { DrawPickingInfo, DrawPickingObject } from './draw.types'
import {
  CustomDrawPointMode,
  CustomDrawPolygonMode,
  CustomModifyMode,
  CustomViewMode,
  DrawLayerMode,
} from './draw.modes'
import { updateFeatureCoordinateByIndex } from './draw.utils'

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
    return kinks(feature.geometry).features.length > 0 ? ERROR_COLOR : LINE_COLOR
  },
  getDashArray: [4, 2],
  editHandlePointOutline: false,
  extensions: [new PathStyleExtension({ dash: true, highPrecisionDash: true })],
}
const POINTS_STYLES = {
  lineWidthMaxPixels: 0,
  pointRadiusMinPixels: 10,
  getFillColor: HANDLE_COLOR,
  getEditHandlePointRadius: 10,
  getEditHandlePointColor: COLOR_HIGHLIGHT_LINE as any,
}

function getFeaturesWithOverlapping(features: FeatureCollection['features']) {
  return features.map((feature: any) => ({
    ...feature,
    properties: {
      ...feature.properties,
      hasOverlappingFeatures:
        feature.geometry.type !== 'Point' ? kinks(feature.geometry).features.length > 0 : false,
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
  tentativeData?: FeatureCollection
  mode: DrawLayerMode
  selectedFeatureIndexes?: number[]
  selectedCoordinateIndex?: number
  hasTentativeOverlappingFeatures: boolean
}

export type DrawFeatureType = 'polygons' | 'points'
export type DrawLayerProps = {
  featureType: DrawFeatureType
}

export class DrawLayer extends CompositeLayer<DrawLayerProps> {
  static layerName = 'draw-layer'
  state!: DrawLayerState
  isTranslating = false
  isMoving = false

  _getModifyMode = () => {
    // return new CustomModifyMode()
    return new CompositeMode([new CustomModifyMode(), new TranslateMode()])
  }

  _getDrawingMode = () => {
    return this.props.featureType === 'points'
      ? new CustomDrawPointMode()
      : new CustomDrawPolygonMode()
  }

  initializeState(context: LayerContext) {
    super.initializeState(context)
    this.state = {
      mode: this._getDrawingMode(),
      data: INITIAL_FEATURE_COLLECTION,
      selectedFeatureIndexes: [],
      selectedCoordinateIndex: undefined,
      hasTentativeOverlappingFeatures: false,
    }
  }

  setData = (data: FeatureCollection) => {
    if (data && this.state) {
      return this.setState({ data })
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

  getSelectedCoordinateIndex = () => {
    return this.state?.selectedCoordinateIndex
  }

  getSelectedPointCoordinates = () => {
    const data = this.getData()
    const currentFeatureIndex = this?.getSelectedFeatureIndexes()?.[0]
    const currentPointIndex = this?.getSelectedCoordinateIndex()
    let currentPointCoordinates: Position | undefined = []
    if (
      data?.features.length &&
      currentFeatureIndex !== undefined &&
      currentPointIndex !== undefined
    ) {
      currentPointCoordinates = (
        data?.features[currentFeatureIndex]?.geometry.type === 'Point'
          ? data?.features[currentPointIndex]?.geometry?.coordinates
          : data?.features[currentFeatureIndex]?.geometry?.coordinates[currentPointIndex]
      ) as Position
    }
    return currentPointCoordinates
  }

  getFeaturesWithCustomPointCoordinates = (pointPosition: [number, number]) => {
    const data = this.getData()
    const featureIndex = this?.getSelectedFeatureIndexes()?.[0]
    const coordinateIndex = this?.getSelectedCoordinateIndex()
    if (data?.features?.length && featureIndex !== undefined && coordinateIndex !== undefined) {
      const features = updateFeatureCoordinateByIndex(data?.features, {
        featureIndex,
        coordinateIndex,
        pointPosition,
      })
      return features
    }
    return data?.features
  }

  setCurrentPointCoordinates = (pointPosition: [number, number]) => {
    const data = this.getData()
    const features = this.getFeaturesWithCustomPointCoordinates(pointPosition)
    this.setState({ data: { ...data, features } })
  }

  setTentativeCurrentPointCoordinates = (pointPosition: [number, number]) => {
    const data = this.getData()
    const features = this.getFeaturesWithCustomPointCoordinates(pointPosition)
    this.setState({ tentativeData: { ...data, features } })
  }

  reset = () => {
    if (this.state) {
      this.setState({
        data: INITIAL_FEATURE_COLLECTION,
        tentativeData: undefined,
        selectedFeatureIndexes: [],
        mode: this._getDrawingMode(),
        hasTentativeOverlappingFeatures: false,
      })
    }
  }

  resetSelectedPoint = () => {
    if (this.state) {
      this.setState({
        tentativeData: undefined,
        selectedFeatureIndexes: [],
        selectedCoordinateIndex: undefined,
      })
    }
  }

  deleteSelectedFeature = () => {
    const { data, selectedFeatureIndexes } = this.state
    const features = data.features.filter((_, index) => !selectedFeatureIndexes?.includes(index))
    if (this.state) {
      this.setState({
        data: { ...data, features },
        selectedFeatureIndexes: [],
        hasTentativeOverlappingFeatures: false,
        mode: new CustomViewMode(),
      })
    }
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

  setMode = (mode: 'modify' | 'draw' = 'draw') => {
    if (this.state) {
      this.setState({ mode: mode === 'modify' ? this._getModifyMode() : this._getDrawingMode() })
    }
  }

  onEdit = (editAction: EditAction<FeatureCollection>) => {
    const { updatedData, editType, editContext } = editAction
    const { featureType } = this.props
    switch (editType) {
      case 'addPosition':
      case 'addFeature': {
        this.setState({
          data: getDrawDataParsed(updatedData, featureType),
          tentativeData: undefined,
          mode: this._getModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedCoordinateIndex: undefined,
          hasTentativeOverlappingFeatures: false,
        })
        break
      }
      case 'customUpdateSelectedIndexes': {
        this.setState({
          data: getDrawDataParsed(updatedData, featureType),
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
        let selectedCoordinateIndex = this.state.selectedCoordinateIndex
        if (featureType === 'points') {
          selectedCoordinateIndex = 0
        }
        this.setState({
          data: updatedData,
          mode: this._getModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedCoordinateIndex,
        })
        break
      }
      case 'translated': {
        this.isTranslating = false
        break
      }
      case 'finishMovePosition': {
        this.isMoving = false
        break
      }
      case 'translating': {
        this.isTranslating = !this.isMoving
        if (!this.isMoving) {
          this.setState({
            data: getDrawDataParsed(updatedData, featureType),
          })
        }
        break
      }
      case 'movePosition': {
        this.isMoving = true
        if (!this.isTranslating) {
          this.setState({
            data: getDrawDataParsed(updatedData, featureType),
          })
        }
        break
      }
      case 'updateTentativeFeature': {
        if (featureType === 'polygons' && editContext.feature.geometry.type !== 'Point') {
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
    const { data, tentativeData, mode, selectedFeatureIndexes, hasTentativeOverlappingFeatures } =
      this.state
    const { featureType } = this.props

    const layer = [
      new EditableGeoJsonLayer({
        id: 'draw',
        data: tentativeData || data,
        mode,
        onEdit: this.onEdit,
        selectedFeatureIndexes,
        ...POLYGON_STYLES,
        ...(featureType === 'polygons' ? LINE_STYLES : POINTS_STYLES),
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
            ...(featureType === 'polygons' ? POLYGON_STYLES : POINTS_STYLES),
          },
          guides: {
            ...LINE_STYLES,
          },
        },
      }),
    ]
    return layer
  }
}
