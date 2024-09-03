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
  eventType?: FourwingsClusterEventType
  maxClusterZoom?: number
  tilesUrl: string
  visible: boolean
}>

export type FourwingsClusterProperties = {
  id: string
  count: number
  col: number
  row: number
  tile: Tile2DHeader['index']
}
export type FourwingsClusterFeature = ClusterFeature<FourwingsClusterProperties>

export type FourwingsPointFeature = PointFeature<{}>
export type FourwingsClusterPickingObject = FourwingsClusterFeature &
  DeckPickingObject<{
    startTime: number
    endTime: number
    expansionZoom?: number
    datasetId?: string
  }>

export type FourwingsClusterPickingInfo = PickingInfo<
  FourwingsClusterPickingObject,
  { tile?: Tile2DHeader }
>