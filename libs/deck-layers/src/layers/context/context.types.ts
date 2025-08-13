import type { PickingInfo } from '@deck.gl/core'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { Feature, LineString, MultiLineString, MultiPolygon, Polygon } from 'geojson'

import type { DeckLayerProps, DeckPickingObject } from '../../types'

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

type ConterLayerConfigFilter = Record<string, any>
type ConterSubLayerConfig = {
  id: string
  dataviewId: string
  color: string
  thickness?: number
  filters?: ConterLayerConfigFilter
}
export type ContextLayerConfig<Id = ContextLayerId> = {
  id: Id
  datasetId: string
  tilesUrl: string
  idProperty?: string
  valueProperties?: string[]
  sublayers: ConterSubLayerConfig[]
}

export type ContextLayerProps = DeckLayerProps<{
  id: string
  layers: ContextLayerConfig[]
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
