import { LoaderOptions } from '@loaders.gl/loader-utils'
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
    getTimestamps: { value: Float32Array; size: number }
  }
}

export type ParseVesselTrackFormat = 'PARQUET' | 'VALUE_ARRAY'
export type ParseVesselTrackOptions = {
  format: ParseVesselTrackFormat
}

export type VesselTrackLoaderOptions = LoaderOptions & {
  track?: ParseVesselTrackOptions
}

export type VesselDeckLayersEventData = Partial<ApiEvent> & {
  type: EventTypes
  coordinates: [number, number]
  start: number
  end: number
}
