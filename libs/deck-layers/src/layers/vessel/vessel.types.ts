import type { Color, PickingInfo } from '@deck.gl/core'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'

import type { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'

import type { DeckLayerSubcategory, DeckPickingObject } from '../../types'

import type { TRACK_LAYER_TYPE } from './vessel.config'

export interface VesselDeckLayersEvent {
  type: EventTypes
  url: string
}

export type VesselDataType = typeof TRACK_LAYER_TYPE | EventTypes

export type _VesselLayerProps = {
  name: string
  color: Color
  singleTrack: boolean
  visible: boolean
}

// type VesselTrackProperties = {
//   timestamp: number
// }
// export type VesselTrackFeature = Feature<LineString | MultiLineString, VesselTrackProperties>
// export type VesselTrackPickingInfo = PickingInfo<VesselTrackPickingObject, { tile?: Tile2DHeader }>

export type VesselEventProperties = ApiEvent & {
  id: string
  color: string
  title: string
  vesselId: string
}

export type VesselTrackInteractionType = 'segment' | 'point'

export type VesselTrackProperties = {
  color: string
  title: string
  vesselId: string
  timestamp?: number
  course?: number
  speed?: number
  depth?: number
  subcategory?: DeckLayerSubcategory
  interactionType?: VesselTrackInteractionType
}

export type VesselPositionProperties = {
  interactionType?: VesselTrackInteractionType
  properties: {
    timestamp?: number
    speed?: number
    depth?: number
    course?: number
  }
}

export type TrackLabelerPoint = {
  position: number[]
  course?: number
  speed?: number
  depth?: number
  timestamp: number
  action: string
  color: string
}

export type VesselEventPickingObject = VesselEventProperties &
  DeckPickingObject<Record<string, unknown>>
export type VesselEventPickingInfo = PickingInfo<VesselEventPickingObject, { tile?: Tile2DHeader }>

export type VesselTrackPickingObject = VesselTrackProperties &
  DeckPickingObject<Record<string, unknown>>
export type VesselTrackPickingInfo = PickingInfo<VesselTrackPickingObject, { tile?: Tile2DHeader }>

export type VesselPositionPickingObject = VesselPositionProperties &
  DeckPickingObject<Record<string, unknown>>
export type VesselPositionPickingInfo = PickingInfo<
  VesselPositionPickingObject,
  { tile?: Tile2DHeader }
>
