import { Feature, Polygon, MultiPolygon, Geometry, Point } from 'geojson'
import { PickingInfo } from '@deck.gl/core'
import { BasePickingInfo } from '../../types'

export type DrawFeatureProperties = {
  index: number
}

export type DrawFeature = Feature<Polygon | MultiPolygon | Point, DrawFeatureProperties>

export type DrawPickingObject = BasePickingInfo & DrawFeature & DrawFeatureProperties
export type DrawPickingInfo = PickingInfo<DrawPickingObject>
