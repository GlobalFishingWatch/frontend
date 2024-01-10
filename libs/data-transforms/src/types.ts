export type BBox = [number, number, number, number]

export type SegmentColumns = {
  latitude: string | number
  longitude: string | number
  startTime?: string | number
  endTime?: string | number
  segmentId?: string | number
  lineId?: string | number
}

export type PointColumns = {
  latitude: string | number
  longitude: string | number
  startTime?: string | number
  endTime?: string | number
  id?: string | number
}
