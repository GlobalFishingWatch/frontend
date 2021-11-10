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
}

export type Point = Partial<Record<Field, number | null>>

export type Segment = Point[]
