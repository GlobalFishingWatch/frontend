import { Feature, Polygon, MultiPolygon, Point } from 'geojson'
import { PickingInfo } from '@deck.gl/core'
import { FeatureWithProps } from '@deck.gl-community/editable-layers'
import { DeckPickingObject } from '../../types'

export type DrawFeatureProperties = {
  index: number
}

export type DrawFeature = Feature<Polygon | MultiPolygon | Point, DrawFeatureProperties>

export type DrawPickingObject = DeckPickingObject<DrawFeature & DrawFeatureProperties>
export type DrawPickingInfo = PickingInfo<DrawPickingObject>

// Copied from 👇 to fix build
// import { EditHandleType } from '@deck.gl-community/editable-layers/dist/edit-modes/types'
export type EditHandleType =
  | 'existing'
  | 'intermediate'
  | 'snap-source'
  | 'snap-target'
  | 'scale'
  | 'rotate'

export type EditHandleFeature = FeatureWithProps<
  Point,
  {
    guideType: 'editHandle'
    editHandleType: EditHandleType
    featureIndex: number
    positionIndexes?: number[]
    shape?: string
  }
>
