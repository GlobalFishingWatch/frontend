export type Geoms = 'blob' | 'gridded' | 'extruded'
export type HeatmapGeoms = {
  [key: string]: Geoms
}

export type GeomGl = 'heatmap' | 'fill' | 'fill-extrusion' | 'symbol'
export type HeatmapGeomGL = {
  [key: string]: GeomGl
}

export type stats = {
  max: number
  min: number
  median: number
  avg: number
  zoom: number
  area: number
}

export type statsByZoom = {
  [key: number]: stats
}
