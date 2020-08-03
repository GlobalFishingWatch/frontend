import { HeatmapColorRampColors, HeatmapColorRamp } from '../types'
import { HeatmapGeomGL, HeatmapGeoms } from './types'

export const API_TILES_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://fourwings.api.globalfishingwatch.org/v1'
    : 'https://fourwings.api.dev.globalfishingwatch.org/v1'
export const API_ENDPOINTS = {
  tiles: 'tile/heatmap/{z}/{x}/{y}',
  statistics: 'statistics',
}

export const HEATMAP_DEFAULT_MAX_ZOOM = 12

export const HEATMAP_GEOM_TYPES: HeatmapGeoms = {
  BLOB: 'blob',
  GRIDDED: 'gridded',
  EXTRUDED: 'extruded',
}

export const HEATMAP_DEFAULT_GEOM_TYPE = HEATMAP_GEOM_TYPES.GRIDDED

export const HEATMAP_GEOM_TYPES_GL_TYPES: HeatmapGeomGL = {
  [HEATMAP_GEOM_TYPES.BLOB]: 'heatmap',
  [HEATMAP_GEOM_TYPES.GRIDDED]: 'fill',
  [HEATMAP_GEOM_TYPES.EXTRUDED]: 'fill-extrusion',
}

export const HEATMAP_COLOR_RAMPS: HeatmapColorRamp = {
  FISHING: 'fishing',
  PRESENCE: 'presence',
  RECEPTION: 'reception',
}

export const HEATMAP_COLOR_RAMPS_RAMPS: HeatmapColorRampColors = {
  [HEATMAP_COLOR_RAMPS.FISHING]: ['rgba(22, 63, 137, 1)', '#3B9088', '#EEFF00', '#ffffff'],
  [HEATMAP_COLOR_RAMPS.PRESENCE]: [
    'rgba(22, 63, 137, 0)',
    '#163F89',
    '#0F6F97',
    '#07BBAE',
    '#00FFC3',
    '#FFFFFF',
  ],
  [HEATMAP_COLOR_RAMPS.RECEPTION]: ['rgb(255, 69, 115)', '#7b2e8d', '#093b76', '#0c276c'],
}
