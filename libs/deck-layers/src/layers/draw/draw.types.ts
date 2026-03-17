import type { PickingInfo } from '@deck.gl/core'
import type { Feature, MultiPolygon, Point,Polygon } from 'geojson'

import type { DeckPickingObject } from '../../types'

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

export type EditHandleFeature = Feature<
  Point,
  {
    guideType: 'editHandle'
    editHandleType: EditHandleType
    featureIndex: number
    positionIndexes?: number[]
    shape?: string
  }
>
