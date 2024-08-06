import { ClusterFeature, PointFeature } from 'supercluster'
import { PickingInfo } from '@deck.gl/core'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { EventTypes } from '@globalfishingwatch/api-types'
import { DeckLayerProps, DeckPickingObject } from '../../../types'

export type FourwingsClusterEventType =
  | `${EventTypes.Encounter}`
  | `${EventTypes.Gap}`
  | `${EventTypes.Port}`

export type FourwingsClustersLayerProps = DeckLayerProps<{
  startTime: number
  endTime: number
  color: string
  datasetId: string
  filters: string
  eventType?: FourwingsClusterEventType
  maxClusterZoom?: number
  tilesUrl: string
  visible: boolean
  extentStart?: number
  extentEnd?: number
}>

export type FourwingsClusterProperties = {
  id: string
  count: number
  expansionZoom: number
  cols: number
  rows: number
}
export type FourwingsClusterFeature = ClusterFeature<FourwingsClusterProperties>

export type FourwingsPointFeature = PointFeature<{}>
export type FourwingsClusterPickingObject = FourwingsClusterFeature &
  DeckPickingObject<{
    cols: number
    rows: number
    startTime: number
    endTime: number
    expansionZoom?: number
  }>

export type FourwingsClusterPickingInfo = PickingInfo<
  FourwingsClusterPickingObject,
  { tile?: Tile2DHeader }
>
