// month only supported in environmental layers
export type Interval = 'year' | 'month' | 'day' | 'hour'

export type GeomGl = 'heatmap' | 'fill' | 'fill-extrusion' | 'symbol'

export type HeatmapGeomGL = {
  [key: string]: GeomGl
}

export type Stats = {
  max: number
  min: number
  median: number
  avg: number
  zoom: number
  area: number
}

export type StatsByZoom = {
  [key: number]: Stats
}
