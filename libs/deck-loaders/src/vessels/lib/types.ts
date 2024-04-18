import { ApiEvent, EventTypes } from '@globalfishingwatch/api-types'

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
  }
}

export type VesselDeckLayersEventData = Partial<ApiEvent> & {
  type: EventTypes
  coordinates: [number, number]
  start: number
  end: number
}
