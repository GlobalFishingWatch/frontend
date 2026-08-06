import type { PickingInfo } from '@deck.gl/core'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

import type { LayerGroup } from '../../config/sort.config'
import type { DeckLayerProps, DeckPickingObject } from '../../types'

export type PolygonFeature = Feature<
  Polygon | MultiPolygon,
  Record<string, any> & { highlighted: boolean }
>

export type PolygonPickingObject = DeckPickingObject<PolygonFeature>

export type PolygonPickingInfo = PickingInfo<PolygonPickingObject>

export type PolygonsLayerProps = DeckLayerProps<{
  id: string
  data?: FeatureCollection
  dataUrl?: string
  debounceTime?: number
  color: string
  pickable?: boolean
  group?: LayerGroup
}>
