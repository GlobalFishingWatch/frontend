import { Feature, Polygon, MultiPolygon, Point } from 'geojson'
import { PickingInfo } from '@deck.gl/core'
import { BasePickingObject } from '../../types'

export type DrawFeatureProperties = {
  index: number
}

export type DrawFeature = Feature<Polygon | MultiPolygon | Point, DrawFeatureProperties>

export type DrawPickingObject = BasePickingObject & DrawFeature & DrawFeatureProperties
export type DrawPickingInfo = PickingInfo<DrawPickingObject>
