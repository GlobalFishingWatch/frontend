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
  teal: '#00FFBC',
  magenta: '#FF64CE',
  lilac: '#9CA4FF',
  salmon: '#FFAE9B',
  sky: '#00EEFF',
  red: '#FF6854',
  yellow: '#FFEA00',
  green: '#A6FF59',
  orange: '#FFAA0D',
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
  [HEATMAP_COLOR_RAMPS.teal]: [
    'rgba(22, 63, 137, 0)',
    '#004F6B',
    '#007B7F',
    '#00A793',
    '#00D3A7',
    '#00FFBC',
  ],
  [HEATMAP_COLOR_RAMPS.magenta]: [
    'rgba(22, 63, 137, 0)',
    '#33306E',
    '#663D86',
    '#994A9E',
    '#994A9E',
    '#FF64CE',
  ],
  [HEATMAP_COLOR_RAMPS.lilac]: [
    'rgba(22, 63, 137, 0)',
    '#1F3D78',
    '#3E579A',
    '#5E70BB',
    '#7D8ADD',
    '#9CA4FF',
  ],
  [HEATMAP_COLOR_RAMPS.salmon]: [
    'rgba(22, 63, 137, 0)',
    '#333F64',
    '#665B72',
    '#665B72',
    '#CC928D',
    '#FFAE9B',
  ],
  [HEATMAP_COLOR_RAMPS.sky]: [
    'rgba(22, 63, 137, 0)',
    '#004C78',
    '#00749A',
    '#009DBB',
    '#00C5DD',
    '#00EEFF',
  ],
  [HEATMAP_COLOR_RAMPS.red]: [
    'rgba(22, 63, 137, 0)',
    '#333156',
    '#663E56',
    '#994C54',
    '#CC5A54',
    '#FF6854',
  ],
  [HEATMAP_COLOR_RAMPS.yellow]: [
    'rgba(22, 63, 137, 0)',
    '#334B45',
    '#667334',
    '#999A22',
    '#CCC211',
    '#FFEA00',
  ],
  [HEATMAP_COLOR_RAMPS.green]: [
    'rgba(22, 63, 137, 0)',
    '#214F57',
    '#427B58',
    '#64A757',
    '#85D358',
    '#A6FF59',
  ],
  [HEATMAP_COLOR_RAMPS.orange]: [
    'rgba(22, 63, 137, 0)',
    '#333E48',
    '#665939',
    '#99742A',
    '#CC8F1B',
    '#FFAA0D',
  ],
}
