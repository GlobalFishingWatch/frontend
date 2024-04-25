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
export type TrackPoint = Partial<Record<TrackField, number | null>> & {
  properties?: TrackPointProperties
  coordinateProperties?: TrackPointProperties
}

export type TrackSegment = TrackPoint[]

export type TrackResourceData = TrackSegment[]
