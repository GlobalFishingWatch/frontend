import type { FeatureCollection, LineString } from 'geojson'

export enum TrackField {
  lonlat = 'lonlat',
  longitude = 'longitude',
  latitude = 'latitude',
  timestamp = 'timestamp',
  fishing = 'fishing',
  speed = 'speed',
  depth = 'depth',
  course = 'course',
  night = 'night',
  distanceFromPort = 'distance_from_port',
  elevation = 'elevation',
  id = 'id',
  color = 'color',
}

export type TrackPointProperties = Record<string, any>
export type GeojsonTrackProperties = {
  properties?: TrackPointProperties
  coordinateProperties?: TrackPointProperties
}
export type TrackPoint = Partial<Record<TrackField, number | null>> & GeojsonTrackProperties

export type TrackSegment = TrackPoint[]

export type TrackResourceData = TrackSegment[]

export type UserTrack = FeatureCollection<LineString, GeojsonTrackProperties>
