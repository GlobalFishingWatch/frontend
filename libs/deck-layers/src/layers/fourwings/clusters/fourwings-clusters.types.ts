import type { PickingInfo } from '@deck.gl/core'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { ClusterFeature, PointFeature } from 'supercluster'

import type {
  ClusterMaxZoomLevelConfig,
  EventTypes,
  FourwingsGeolocation,
} from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'

import type { DeckLayerPickingObject, DeckLayerProps, DeckPickingObject } from '../../../types'

export type FourwingsClusterEventType =
  | `${EventTypes.Encounter}`
  | `${EventTypes.Gap}`
  | `${EventTypes.Port}`
  | `${EventTypes.Loitering}`

export type FourwingsClusterMode = FourwingsGeolocation | 'positions'

export type FourwingsClustersLayerProps = DeckLayerProps<{
  startTime: number
  endTime: number
  color: string
  datasetId: string
  eventType?: FourwingsClusterEventType
  tilesUrl: string
  visible: boolean
  clusterMaxZoomLevels?: ClusterMaxZoomLevelConfig
  maxZoom: number
  highlightedFeatures?: DeckLayerPickingObject[]
  temporalAggregation?: boolean
}>

export type FourwingsClusterProperties = {
  id: string
  value: number
  col: number
  row: number
  tile: Tile2DHeader['index']
  /**
   * Timestamp of the start of the cluster in seconds
   */
  stime: number
}
export type FourwingsClusterFeature = ClusterFeature<FourwingsClusterProperties>

export type FourwingsPointFeature = PointFeature<Record<string, unknown>>
export type FourwingsClusterPickingObject = FourwingsClusterFeature &
  DeckPickingObject<{
    startTime: number
    endTime: number
    expansionZoom?: number
    expansionBounds?: Bbox
    datasetId?: string
    eventId?: string
    eventType?: FourwingsClusterEventType
    clusterMode: FourwingsClusterMode
  }>

export type FourwingsClusterPickingInfo = PickingInfo<
  FourwingsClusterPickingObject,
  { tile?: Tile2DHeader }
>
