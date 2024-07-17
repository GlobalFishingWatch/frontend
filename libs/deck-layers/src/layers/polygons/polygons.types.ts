import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { PickingInfo } from '@deck.gl/core'
import { DeckLayerProps, DeckPickingObject } from '../../types'
import { LayerGroup } from '../../utils'

export type PolygonFeature = Feature<
  Polygon | MultiPolygon,
  Record<string, any> & { highlighted: boolean }
>

export type PolygonPickingObject = DeckPickingObject<PolygonFeature>

export type PolygonPickingInfo = PickingInfo<PolygonPickingObject>

export type PolygonsLayerProps = DeckLayerProps<{
  id: string
  color: string
  data: string | FeatureCollection
  pickable?: boolean
  group?: LayerGroup
  highlightedFeatures: PolygonPickingObject[]
}>
