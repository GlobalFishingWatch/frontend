import { PickingInfo } from '@deck.gl/core'
import { Feature, Polygon, MultiPolygon, Geometry, Point } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { EventTypes } from '@globalfishingwatch/api-types'

export type ClusterEventType =
  | `${EventTypes.Encounter}`
  | `${EventTypes.Gap}`
  | `${EventTypes.Port}`

export type ClusterLayerProps = {
  color: string
  datasetId: string
  end: string
  eventType?: ClusterEventType
  id: string
  maxClusterZoom?: number
  start: string
  tilesUrl: string
  visible: boolean
}

type ClusterFeatureProps = {
  count: number
  event_id: string
  expansionZoom: number
  lat: number
  lon: number
}

export type ClusterPickingObject = Feature<Point, ClusterFeatureProps>

export type ClusterPickingInfo = PickingInfo<ClusterPickingObject, { tile?: Tile2DHeader }>
