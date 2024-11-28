import type { Feature, FeatureCollection, LineString, MultiLineString } from 'geojson'

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

export type UserTrackFeatureProperties = {
  id?: string
  coordinateProperties: Record<string, any>
} & Record<string, any>
export type UserTrackFeature = Feature<LineString | MultiLineString, UserTrackFeatureProperties>
export type UserTrackRawData = FeatureCollection<
  UserTrackFeature['geometry'],
  UserTrackFeatureProperties
>

export type UserTrackData = {
  data: UserTrackRawData
  binary: UserTrackBinaryData
}
