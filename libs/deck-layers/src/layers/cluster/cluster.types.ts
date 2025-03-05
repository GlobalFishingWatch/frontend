import type { PickingInfo } from '@deck.gl/core'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { Feature, Point } from 'geojson'

import type { EventTypes } from '@globalfishingwatch/api-types'

import type { DeckLayerProps,DeckPickingObject } from '../../types'

export type ClusterEventType =
  | `${EventTypes.Encounter}`
  | `${EventTypes.Gap}`
  | `${EventTypes.Port}`

export type ClusterLayerProps = DeckLayerProps<{
  color: string
  datasetId: string
  end: string
  eventType?: ClusterEventType
  id: string
  maxClusterZoom?: number
  start: string
  tilesUrl: string
  visible: boolean
}>

type ClusterFeatureProps = {
  count: number
  event_id: string
  expansionZoom: number
  lat: number
  lon: number
}

type ClusterProperties = {
  datasetId: string
  color: string
}

export type ClusterFeature = Feature<Point, ClusterFeatureProps>
export type ClusterPickingObject = ClusterFeature & DeckPickingObject<ClusterProperties>

export type ClusterPickingInfo = PickingInfo<ClusterPickingObject, { tile?: Tile2DHeader }>
