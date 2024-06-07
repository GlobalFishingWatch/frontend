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
import { CompositeLayer, LayerContext, PickingInfo } from '@deck.gl/core'
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

type DrawLayerMode = DrawPolygonMode | ViewMode | ModifyMode | 'draw'
type DrawLayerState = {
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

export class EditableLayer extends EditableGeoJsonLayer {
  static layerName = 'gfw-editable-layer'
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
}
