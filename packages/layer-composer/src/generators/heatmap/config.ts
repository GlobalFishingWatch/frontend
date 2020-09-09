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

const opacitySteps = [0, 0.2, 0.4, 0.6, 0.8, 1]
const hex2Rgb = (hex: string) => {
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return `${color.r}, ${color.g}, ${color.b}`
}

const getColorRampByOpacitySteps = (finalColor: string) => {
  const color = finalColor.includes('#') ? hex2Rgb(finalColor) : finalColor
  return opacitySteps.map((opacity) => `rgba(${color}, ${opacity})`)
}

export const HEATMAP_COLOR_RAMPS: Record<ColorRampsIds, string[]> = {
  fishing: [DEFAULT_BASEMAP_COLOR, '#3B9088', '#EEFF00', '#ffffff'],
  presence: [DEFAULT_BASEMAP_COLOR, '#163F89', '#0F6F97', '#07BBAE', '#00FFC3', '#FFFFFF'],
  reception: ['rgb(255, 69, 115, 1)', '#7b2e8d', '#093b76', DEFAULT_BASEMAP_COLOR],
  teal: getColorRampByOpacitySteps('#00FFBC'),
  magenta: getColorRampByOpacitySteps('#FF64CE'),
  lilac: getColorRampByOpacitySteps('#9CA4FF'),
  salmon: getColorRampByOpacitySteps('#FFAE9B'),
  sky: getColorRampByOpacitySteps('#00EEFF'),
  red: getColorRampByOpacitySteps('#FF6854'),
  yellow: getColorRampByOpacitySteps('#FFEA00'),
  green: getColorRampByOpacitySteps('#A6FF59'), // 166,255,89
  orange: getColorRampByOpacitySteps('#FFAA0D'),
}
