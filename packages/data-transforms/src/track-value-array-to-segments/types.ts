export enum Field {
  lonlat = 'lonlat',
  longitude = 'longitude',
  latitude = 'latitude',
  timestamp = 'timestamp',
  fishing = 'fishing',
  speed = 'speed',
  course = 'course',
  night = 'night',
}

export type Point = Partial<Record<Field, number | null>>
export type Segment = Point[]
