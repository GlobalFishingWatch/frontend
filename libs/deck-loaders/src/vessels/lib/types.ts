import type { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'

export const EVENTS_COLORS: Record<`${EventTypes}` | 'partially' | 'unmatched' | 'port', string> = {
  partially: '#F59E84',
  unmatched: '#CE2C54',
  port: '#99EEFF',
  encounter: '#FAE9A0',
  loitering: '#cfa9f9',
  port_visit: '#99EEFF',
  fishing: '#ffffff',
  gap: '#f95e5e',
  gaps: '#f95e5e',
}

export type VesselTrackGraphExtent = [number, number]

export type VesselTrackData = {
  // Number of geometries
  length: number
  // Indices into positions where each path starts
  startIndices: number[]
  // Flat coordinates array
  attributes: {
    // Populated automatically by deck.gl
    positions?: { value: Float32Array; size: number }
    getPath: { value: Float32Array; size: number }
    getTimestamp: { value: Float32Array; size: number }
    getSpeed: { value: Float32Array; size: number; extent: VesselTrackGraphExtent }
    getElevation: { value: Float32Array; size: number; extent: VesselTrackGraphExtent }
    getGap?: { value: Float32Array; size: number }
  }
}

export type VesselDeckLayersEventData = Partial<ApiEvent> & {
  type: EventTypes
  coordinates: [number, number]
  start: number
  end: number
}
