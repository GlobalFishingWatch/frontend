import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { PickingInfo } from '@deck.gl/core'
import { BaseLayerProps, BasePickingObject } from '../../types'
import { LayerGroup } from '../../utils'

export type PolygonFeature = Feature<
  Polygon | MultiPolygon,
  Record<string, any> & { highlighted: boolean }
>

export type PolygonPickingObject = BasePickingObject & PolygonFeature

export type PolygonPickingInfo = PickingInfo<PolygonPickingObject>

export type PolygonsLayerProps = BaseLayerProps & {
  id: string
  color: string
  data: string | FeatureCollection
  group?: LayerGroup
  highlightedFeatures: PolygonPickingObject[]
}
