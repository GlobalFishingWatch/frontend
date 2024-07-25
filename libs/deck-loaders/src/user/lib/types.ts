import { FeatureCollection, LineString, MultiLineString } from 'geojson'

export type UserTrackBinaryData = {
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

export type UserTrackRawData = FeatureCollection<LineString | MultiLineString>

export type UserTrackData = {
  data: UserTrackRawData
  binary: UserTrackBinaryData
}
