import { PickingInfo } from '@deck.gl/core'
import { Feature, Point } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { EventTypes } from '@globalfishingwatch/api-types'
import { BaseLayerProps, BasePickingInfo } from '../../types'

export type ClusterEventType =
  | `${EventTypes.Encounter}`
  | `${EventTypes.Gap}`
  | `${EventTypes.Port}`

export type ClusterLayerProps = BaseLayerProps & {
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

export type ClusterFeature = Feature<Point, ClusterFeatureProps>
export type ClusterPickingObject = ClusterFeature & BasePickingInfo

export type ClusterPickingInfo = PickingInfo<ClusterPickingObject, { tile?: Tile2DHeader }>
