import { PickingInfo } from '@deck.gl/core'
import { Feature, Polygon, MultiPolygon } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DataviewCategory } from '@globalfishingwatch/api-types'

export enum ContextLayerId {
  EEZ = 'eez-areas',
  HighSeas = 'high-seas',
  EEZBoundaries = 'eez-boundaries',
  MPA = 'mpa',
  MPANoTake = 'mpa-no-take',
  MPARestricted = 'mpa-restricted',
  TunaRfmo = 'tuna-rfmo',
  WPPNRI = 'wpp-nri',
  Graticules = 'graticules',
  FAO = 'fao',
  ProtectedSeas = 'protected-seas',
}

export type ContextLayerConfig = {
  id: ContextLayerId
  datasetId: string
  tilesUrl: string
}

export type ContextLayerProps = {
  id: string
  layers: ContextLayerConfig[]
  category: DataviewCategory
  color: string
  idProperty?: string
  valueProperties?: string[]
  hoveredFeatures?: PickingInfo[]
  clickedFeatures?: PickingInfo[]
}

export type ContextFeatureProperties = {
  id: string
  title: string
  value: string | number
  layerId: ContextLayerId
  datasetId: string
  category: string
  link?: string
}
export type ContextFeature = Feature<Polygon | MultiPolygon, Record<string, any>> &
  ContextFeatureProperties

export type ContextPickingInfo = PickingInfo<ContextFeature, { tile?: Tile2DHeader }>
