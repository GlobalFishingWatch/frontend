import type { GeoJSON } from 'geojson'

export interface AOI {
  id: string
  name: string
  area: number
  geometry?: GeoJSON
  bbox: number[]
}
