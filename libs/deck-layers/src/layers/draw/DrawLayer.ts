import type { LayerContext, PickingInfo } from '@deck.gl/core'
import { CompositeLayer } from '@deck.gl/core'
import { PathStyleExtension } from '@deck.gl/extensions'
import type { EditAction,FeatureCollection } from '@deck.gl-community/editable-layers'
import {
  CompositeMode,
  EditableGeoJsonLayer,
  ImmutableFeatureCollection,
  TranslateMode,
} from '@deck.gl-community/editable-layers'
import kinks from '@turf/kinks'
import type { Feature, Point, Polygon, Position } from 'geojson'

import type { DeckLayerCategory } from '../../types'
import { COLOR_HIGHLIGHT_LINE, getLayerGroupOffset,LayerGroup } from '../../utils'

import type { DrawLayerMode } from './draw.modes'
import {
  CustomDrawPointMode,
  CustomDrawPolygonMode,
  CustomModifyMode,
  CustomViewMode,
} from './draw.modes'
import type { DrawPickingInfo, DrawPickingObject } from './draw.types'

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

function getDrawDataParsed(data: FeatureCollection) {
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
  selectedPositionIndexes?: number[]
  hasTentativeOverlappingFeatures: boolean
}

export type DrawFeatureType = 'polygons' | 'points'
export type DrawLayerProps = {
  featureType: DrawFeatureType
  onStateChange?: (instance: DrawLayer) => void
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
      selectedPositionIndexes: undefined,
      hasTentativeOverlappingFeatures: false,
    }
  }

  setData = (data: FeatureCollection) => {
    if (data && this.state) {
      return this._setState({ data })
    }
  }

  getData = () => {
    return this.state?.tentativeData || this.state?.data
  }

  getMode = () => {
    return this.state?.mode
  }

  _setState(state: Partial<DrawLayerState>) {
    this.setState(state)
    if (this.props.onStateChange) {
      this.props.onStateChange(this)
    }
  }

  getHasOverlappingFeatures = () => {
    return (
      this.state?.hasTentativeOverlappingFeatures ||
      this.state?.data?.features?.some(
        (feature: any) => feature.properties.hasOverlappingFeatures
      ) ||
      this.state?.tentativeData?.features?.some(
        (feature: any) => feature.properties.hasOverlappingFeatures
      ) ||
      false
    )
  }

  getSelectedFeatureIndexes = () => {
    return this.state?.selectedFeatureIndexes
  }

  getSelectedPositionIndexes = () => {
    return this.state?.selectedPositionIndexes
  }

  getSelectedPointCoordinates = () => {
    let currentPointCoordinates: Position | undefined
    const data = this.getData()
    const currentFeatureIndex = this?.getSelectedFeatureIndexes()?.[0]
    const currentPointIndexes = this?.getSelectedPositionIndexes()
    if (data?.features?.length && currentFeatureIndex !== undefined) {
      const isPointFeature = data?.features[currentFeatureIndex]?.geometry.type === 'Point'
      if (isPointFeature) {
        currentPointCoordinates = (data?.features as Feature<Point>[])[currentFeatureIndex]
          ?.geometry.coordinates
      } else if (currentPointIndexes !== undefined) {
        const currentPointIndex = currentPointIndexes?.[currentPointIndexes.length - 1] || 0
        currentPointCoordinates = (data?.features as Feature<Polygon>[])[currentFeatureIndex]
          ?.geometry?.coordinates[0][currentPointIndex]
      }
    }
    return currentPointCoordinates
  }

  getDataWithReplacedPosition = (pointPosition: [number, number]) => {
    const featureIndexes = this?.getSelectedFeatureIndexes()
    const coordinateIndex = this?.getSelectedPositionIndexes()
    if (!featureIndexes) {
      return
    }
    let data = new ImmutableFeatureCollection(this.getData())
    featureIndexes.forEach((featureIndex) => {
      data = data.replacePosition(featureIndex, coordinateIndex ?? [], pointPosition)
    })
    return getDrawDataParsed(data.getObject())
  }

  setCurrentPointCoordinates = (pointPosition: [number, number]) => {
    const data = this.getDataWithReplacedPosition(pointPosition)
    if (data) {
      this._setState({ data })
    }
  }

  setTentativeCurrentPointCoordinates = (pointPosition: [number, number]) => {
    const tentativeData = this.getDataWithReplacedPosition(pointPosition)
    if (tentativeData) {
      this._setState({ tentativeData })
    }
  }

  reset = () => {
    if (this.state) {
      this._setState({
        data: INITIAL_FEATURE_COLLECTION,
        tentativeData: undefined,
        selectedFeatureIndexes: [],
        selectedPositionIndexes: undefined,
        mode: this._getDrawingMode(),
        hasTentativeOverlappingFeatures: false,
      })
    }
  }

  resetSelectedPoint = () => {
    if (this.state) {
      this._setState({
        tentativeData: undefined,
        selectedFeatureIndexes: [],
        selectedPositionIndexes: undefined,
      })
    }
  }

  deleteSelectedFeature = () => {
    const { data, selectedFeatureIndexes } = this.state
    let updatedData = new ImmutableFeatureCollection(data)
    selectedFeatureIndexes?.forEach((featureIndex) => {
      updatedData = updatedData.deleteFeature(featureIndex)
    })
    if (this.state) {
      this._setState({
        data: getDrawDataParsed(updatedData.getObject()),
        selectedFeatureIndexes: [],
        selectedPositionIndexes: undefined,
        hasTentativeOverlappingFeatures: false,
        mode: new CustomViewMode(),
      })
    }
  }

  deleteSelectedPosition = () => {
    const { data, selectedFeatureIndexes, selectedPositionIndexes } = this.state
    let updatedData: ImmutableFeatureCollection | undefined
    selectedFeatureIndexes?.forEach((featureIndex) => {
      try {
        if (this.props.featureType === 'points') {
          updatedData = new ImmutableFeatureCollection(data).deleteFeature(featureIndex)
        } else {
          updatedData = new ImmutableFeatureCollection(data).removePosition(
            featureIndex,
            selectedPositionIndexes
          )
        }
      } catch (ignore) {
        // ignore
      }
    })
    if (updatedData && this.state) {
      this._setState({
        data: getDrawDataParsed(updatedData.getObject()),
        selectedPositionIndexes: undefined,
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
      this._setState({ mode: mode === 'modify' ? this._getModifyMode() : this._getDrawingMode() })
    }
  }

  onEdit = (editAction: EditAction<FeatureCollection>) => {
    const { updatedData, editType, editContext } = editAction
    const { featureType } = this.props
    switch (editType) {
      case 'addPosition':
      case 'addFeature': {
        this._setState({
          data: getDrawDataParsed(updatedData),
          tentativeData: undefined,
          mode: this._getModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedPositionIndexes: undefined,
          hasTentativeOverlappingFeatures: false,
        })
        break
      }
      case 'customUpdateSelectedFeaturesIndexes': {
        this._setState({
          data: getDrawDataParsed(updatedData),
          selectedFeatureIndexes: editContext.featureIndexes,
        })
        break
      }
      case 'customUpdateSelectedPositionIndexes': {
        this._setState({
          data: getDrawDataParsed(updatedData),
          selectedPositionIndexes: editContext.positionIndexes,
        })
        break
      }
      case 'customClickOutside': {
        this._setState({
          mode: new CustomViewMode(),
          tentativeData: undefined,
          selectedFeatureIndexes: [],
          selectedPositionIndexes: undefined,
        })
        break
      }
      case 'customClickInFeature': {
        let selectedPositionIndexes = this.state.selectedPositionIndexes
        if (featureType === 'points') {
          selectedPositionIndexes = []
        }
        this._setState({
          mode: this._getModifyMode(),
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedPositionIndexes,
        })
        break
      }
      // default action for clicking on a polygon corner, used for us to select the point and update manually
      case 'removePosition': {
        this._setState({
          selectedFeatureIndexes: editContext.featureIndexes,
          selectedPositionIndexes: editContext.positionIndexes,
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
          this._setState({
            data: getDrawDataParsed(updatedData),
          })
        }
        break
      }
      case 'movePosition': {
        this.isMoving = true
        if (!this.isTranslating) {
          this._setState({
            data: getDrawDataParsed(updatedData),
          })
        }
        break
      }
      case 'updateTentativeFeature': {
        if (featureType === 'polygons' && editContext.feature.geometry.type !== 'Point') {
          const hasTentativeOverlappingFeatures =
            kinks(editContext.feature.geometry).features.length > 0
          this._setState({ hasTentativeOverlappingFeatures })
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
