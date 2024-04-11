import { Color, PickingInfo } from '@deck.gl/core'
import { Feature, LineString, MultiLineString, Point } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { ApiEvent, EventTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import { BasePickingInfo } from '../../types'
import { TRACK_LAYER_TYPE } from './vessel.config'

export interface VesselDeckLayersEvent {
  type: EventTypes
  url: string
}

export type VesselDataType = typeof TRACK_LAYER_TYPE | EventTypes

export type VesselDataStatus = {
  type: VesselDataType
  status: ResourceStatus
}
export type _VesselLayerProps = {
  name: string
  color: Color
  visible: boolean
  onVesselDataLoad?: (layers: VesselDataStatus[]) => void
}

// type VesselTrackProperties = {
//   timestamp: number
// }
// export type VesselTrackFeature = Feature<LineString | MultiLineString, VesselTrackProperties>
// export type VesselTrackPickingObject = VesselTrackFeature & BasePickingInfo
// export type VesselTrackPickingInfo = PickingInfo<VesselTrackPickingObject, { tile?: Tile2DHeader }>

export type VesselEventProperties = ApiEvent & {
  color: string
  title: string
  vesselId: string
}

export type VesselEventPickingObject = VesselEventProperties & BasePickingInfo
export type VesselEventPickingInfo = PickingInfo<VesselEventPickingObject, { tile?: Tile2DHeader }>
