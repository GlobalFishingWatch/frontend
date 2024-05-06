import {
  EditableGeoJsonLayer,
  CompositeMode,
  DrawPolygonMode,
  GeoJsonEditMode,
  ModifyMode,
  ViewMode,
  FeatureCollection,
  Geometry,
  ClickEvent,
  EditAction,
} from '@deck.gl-community/editable-layers'
import { PathStyleExtension } from '@deck.gl/extensions'
import { PickingInfo } from '@deck.gl/core'
import kinks from '@turf/kinks'
import { LayerGroup, getLayerGroupOffset } from '../../utils'
import { DeckLayerCategory, DeckLayerPickingObject } from '../../types'
import { DrawPickingInfo, DrawPickingObject } from './draw.types'

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

const INITIAL_DRAW_MODE = new DrawPolygonMode()
const INITIAL_FEATURE_COLLECTION: FeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

type DrawLayerMode = DrawPolygonMode | ViewMode | ModifyMode
type DrawLayerState = EditableGeoJsonLayer['state'] & {
  data: FeatureCollection
  mode: DrawLayerMode
  hasOverlappingFeatures: boolean
  selectedFeatureIndexes?: number[]
}

const isDrawFeature = (feature: DeckLayerPickingObject) => {
  return feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Polygon'
}

const isDrawHandle = (feature: DeckLayerPickingObject) => {
  return feature.category === 'draw' && (feature as DrawPickingObject).geometry?.type === 'Point'
}

export class DrawLayer extends EditableGeoJsonLayer {
  static layerName = 'draw-layer'
  state!: DrawLayerState

  initializeState() {
    super.initializeState()
    this.state = {
      ...this.state,
      mode: INITIAL_DRAW_MODE,
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
      mode: INITIAL_DRAW_MODE,
    })
  }

  deleteSelectedFeature = () => {
    const { selectedFeatureIndexes } = this.state
    const { data } = this.state
    const features = data.features.filter((_, index) => !selectedFeatureIndexes?.includes(index))
    this.setState({ data: { ...data, features } })
  }

  // onLayerClick(event: ClickEvent): void {
  //   event.sourceEvent.preventDefault()
  //   event.sourceEvent.stopPropagation()

  //   console.log(event)
  // }

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

  setMode = (mode: DrawLayerMode) => {
    this.setState({ mode })
  }

  onEdit = (editAction: EditAction<FeatureCollection>) => {
    const { mode } = this.state
    console.log('🚀 ~ mode:', mode)
    const { updatedData, editType, editContext } = editAction
    if (editType === 'addFeature' || editType === 'addPosition') {
      debugger
      console.log('🚀 ~ editAction:', editAction.updatedData)

      this.setState({
        features: updatedData,
      })
    }

    return

    if (editType === 'addFeature' || editType === 'addPosition') {
      this.setState({
        mode: new ViewMode(),
        data: updatedData,
        featuresIndexes: [],
      })
    }
    if (editType === 'movePosition') {
      this.setState({
        data: updatedData,
      })
    }
    if (editType === 'updateTentativeFeature') {
      const hasOverlappingFeatures = kinks(editContext.feature.geometry).features.length > 0
      this.setState({ hasOverlappingFeatures })
    }

    // const drawFeature = updatedData.features?.find(isDrawFeature) as DrawPickingObject
    // const drawHandle = updatedData.features?.find(isDrawHandle) as DrawPickingObject
    // if (mode instanceof ViewMode) {
    //   if (drawFeature) {
    //     this.setState({ mode: new ModifyMode() })
    //   } else {
    //     this.setState({ mode: new ViewMode() })
    //   }
    // }
    // if (mode instanceof ModifyMode) {
    //   // if (drawFeature) {
    //   //   setDrawFeaturesIndexes([(drawFeature as DrawPickingObject).index])
    //   // }
    //   // if (drawHandle) {
    //   //   setUpdatedPoint({
    //   //     coordinates: drawHandle.geometry.coordinates,
    //   //     index: drawHandle.index,
    //   //   })
    //   // }
    //   if (!drawFeature || !drawHandle) {
    //     this.setState({ mode: new ViewMode() })
    //   }
    // }
    // if (this.props.onEdit) {
    //   this.props.onEdit(editAction)
    // }
  }

  renderLayers() {
    const { selectedFeatureIndexes, onEdit } = this.props
    const { mode, data, features } = this.state
    console.log('🚀 ~ renderLayers ~ data:', features)
    return [
      new EditableGeoJsonLayer({
        id: 'draw',
        data: features,
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
