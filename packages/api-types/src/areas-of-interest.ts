import type { GeoJSON } from 'geojson'

export interface AOI {
  id: number
  name: string
  area: number
  geometry?: GeoJSON
  bbox: number[]
}
