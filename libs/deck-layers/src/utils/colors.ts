import type { Color } from '@deck.gl/core'
import type { RGBA } from 'color-blend/dist/types'

export const COLOR_TRANSPARENT: Color = [0, 0, 0, 0]
export const COLOR_HIGHLIGHT_LINE: Color = [255, 255, 255, 255]
export const COLOR_HIGHLIGHT_FILL: Color = [0, 0, 0, 120]
export const DEFAULT_BACKGROUND_COLOR: Color = [0, 36, 87]
export const DEFAULT_LINE_COLOR: Color = [...DEFAULT_BACKGROUND_COLOR, 0.5]

export const hexToRgb = (hex: string) => {
  if (!hex) {
    return { r: 0, g: 0, b: 0 }
  }
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return color
}

export const hexToDeckColor = (hex: string, opacity = 1): Color => {
  if (!hex) {
    return COLOR_TRANSPARENT
  }
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return [color.r, color.g, color.b, opacity * 255]
}

export const rgbaToDeckColor = (rgbaString: string): Color => {
  const { r, g, b, a } = rgbaStringToObject(rgbaString)
  return [r, g, b, a]
}

function componentToHex(c: number) {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export const deckToHexColor = ([r, g, b]: Color) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export const deckToRgbaColor = ([r, g, b, a]: Color) => {
  return `rgba(${r},${g}, ${b}, ${a ? a : 1})`
}

export function colorToVec(c: number) {
  return parseFloat((c / 255).toFixed(2))
}
export const deckToVecColor = ([r, g, b, a]: Color) => {
  return `vec4(${colorToVec(r)}, ${colorToVec(g)}, ${colorToVec(b)}, ${a ? colorToVec(a) : 1})`
}

export const EMPTY_RGBA_COLOR = { r: 0, g: 0, b: 0, a: 0 }
export const rgbaStringToObject = (rgba?: string) => {
  if (!rgba) return EMPTY_RGBA_COLOR
  const startIndex = rgba.startsWith('rgb') ? 4 : 0
  const colorHasAlpha = rgba.includes('rgba')
  const [r, g, b, a] = rgba
    .substring(startIndex + (colorHasAlpha ? 1 : 0), rgba.length - 1)
    .replace(/ /g, '')
    .split(',')

  return {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
    a: colorHasAlpha ? parseFloat(a) : 1,
  }
}

export const rgbaStringToComponents = (color: string) => {
  if (!color) return []
  const rgba = color.match(/[.?\d]+/g)
  if (rgba)
    return [
      parseInt(rgba[0]),
      parseInt(rgba[1]),
      parseInt(rgba[2]),
      Math.round(parseFloat(rgba[3] || '1') * 255),
    ]
  return []
}

export const rgbaToString = ({ r, g, b, a = 1 }: RGBA) => {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const hexToRgbString = (hex: string) => {
  const color = hexToRgb(hex)
  return rgbToRgbString(color)
}

export const rgbToRgbString = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return `${r}, ${g}, ${b}`
}
