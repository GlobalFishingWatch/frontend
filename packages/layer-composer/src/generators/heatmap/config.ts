import { ColorRampsIds } from '../types'
import { DEFAULT_BASEMAP_COLOR } from '..'
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

export const HEATMAP_COLOR_RAMPS: Record<ColorRampsIds, string[]> = {
  fishing: [DEFAULT_BASEMAP_COLOR, '#3B9088', '#EEFF00', '#ffffff'],
  presence: [DEFAULT_BASEMAP_COLOR, '#163F89', '#0F6F97', '#07BBAE', '#00FFC3', '#FFFFFF'],
  reception: ['rgb(255, 69, 115, 1)', '#7b2e8d', '#093b76', DEFAULT_BASEMAP_COLOR],
  teal: [DEFAULT_BASEMAP_COLOR, '#004F6B', '#007B7F', '#00A793', '#00D3A7', '#00FFBC'],
  magenta: [DEFAULT_BASEMAP_COLOR, '#33306E', '#663D86', '#994A9E', '#994A9E', '#FF64CE'],
  lilac: [DEFAULT_BASEMAP_COLOR, '#1F3D78', '#3E579A', '#5E70BB', '#7D8ADD', '#9CA4FF'],
  salmon: [DEFAULT_BASEMAP_COLOR, '#333F64', '#665B72', '#665B72', '#CC928D', '#FFAE9B'],
  sky: [DEFAULT_BASEMAP_COLOR, '#004C78', '#00749A', '#009DBB', '#00C5DD', '#00EEFF'],
  red: [DEFAULT_BASEMAP_COLOR, '#333156', '#663E56', '#994C54', '#CC5A54', '#FF6854'],
  yellow: [DEFAULT_BASEMAP_COLOR, '#334B45', '#667334', '#999A22', '#CCC211', '#FFEA00'],
  green: [DEFAULT_BASEMAP_COLOR, '#214F57', '#427B58', '#64A757', '#85D358', '#A6FF59'],
  orange: [DEFAULT_BASEMAP_COLOR, '#333E48', '#665939', '#99742A', '#CC8F1B', '#FFAA0D'],
}
