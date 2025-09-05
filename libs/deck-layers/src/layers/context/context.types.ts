import type { PickingInfo } from '@deck.gl/core'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { Feature, LineString, MultiLineString, MultiPolygon, Polygon } from 'geojson'

import type { DeckLayerProps, DeckPickingObject } from '../../types'
import type { FilterOperators } from '../user/user.types'

export type ContextSublayerCallbackParams<T = Record<string, any>> = {
  layer: ContextLayerConfig
  sublayer: ContextSubLayerConfig
} & T

export enum ContextLayerId {
  EEZ = 'eez-areas',
  HighSeas = 'high-seas',
  EEZBoundaries = 'eez-boundaries',
  MPA = 'mpa',
  MPAtlas = 'mpatlas',
  MPANoTake = 'mpa-no-take',
  MPARestricted = 'mpa-restricted',
  TunaRfmo = 'tuna-rfmo',
  WPPNRI = 'wpp-nri',
  Graticules = 'graticules',
  FAO = 'fao',
  ProtectedSeas = 'protected-seas',
}

export type ContextLayerConfigFilter = Record<string, any>
export type ContextSubLayerConfig = {
  id: string
  dataviewId: string
  color: string
  unit?: string
  thickness?: number
  filters?: ContextLayerConfigFilter
  filterOperators?: FilterOperators
}
export type ContextLayerConfig<Id = string> = {
  id: Id
  datasetId: string
  tilesUrl: string
  pickable?: boolean
  idProperty?: string
  valueProperties?: string[]
  sublayers: ContextSubLayerConfig[]
}

export type ContextLayerProps<Id = ContextLayerId> = DeckLayerProps<{
  id: string
  layers: ContextLayerConfig<Id>[]
  pickable?: boolean
  highlightedFeatures?: ContextPickingObject[]
}>

export type ContextFeatureProperties = {
  id: string
  title: string
  color: string
  value: string | number
  layerId: ContextLayerId
  datasetId: string
  link?: string
}

export type ContextFeature = Feature<
  Polygon | MultiPolygon | LineString | MultiLineString,
  Record<string, any>
>

export type ContextPickingObject = DeckPickingObject<ContextFeature & ContextFeatureProperties>

export type ContextPickingInfo = PickingInfo<ContextPickingObject, { tile?: Tile2DHeader }>
