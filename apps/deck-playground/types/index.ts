import { EncounterEvent, EventType, GapEvent, LoiteringEvent, PortVisitEvent } from "@globalfishingwatch/api-types"
export type WorkspaceParam = 'zoom' | 'latitude' | 'longitude' | 'start' | 'end' | 'sidebarOpen'

export type QueryParams = {
  [query in WorkspaceParam]?: string | number | boolean | null
}

export type MapCoordinates = {
  latitude: number
  longitude: number
  zoom: number
}

export type VesselLayerEvent = {
  coordinates: [number, number]
  start: number
  endTime: number
  id: string
  type: EventType
  shapeIndex: number // Used on the shader to define the shape of the point
  port_visit?: PortVisitEvent
  encounter?: EncounterEvent
  loitering?: LoiteringEvent
  gap?: GapEvent
  fishing?: Record<string,string>
}

export type VesselLayerTrack = {
  waypoints: Waypoint[]
}

export type Waypoint = {
  coordinates: [number, number]
  timestamp: number
}
