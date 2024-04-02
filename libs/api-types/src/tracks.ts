export enum Field {
  lonlat = 'lonlat',
  longitude = 'longitude',
  latitude = 'latitude',
  timestamp = 'timestamp',
  fishing = 'fishing',
  speed = 'speed',
  course = 'course',
  night = 'night',
  distanceFromPort = 'distance_from_port',
  elevation = 'elevation',
  id = 'id',
  color = 'color',
}

export type PointProperties = Record<string, any>
export type Point = Partial<Record<Field, number | null>> & {
  properties?: PointProperties
  coordinateProperties?: PointProperties
}

export type Segment = Point[]

export type TrackResourceData = Segment[]
