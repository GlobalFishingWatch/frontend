import { normal, screen } from 'color-blend'
import type { RGBA } from 'color-blend/dist/types'

import { COLOR_RAMP_DEFAULT_NUM_STEPS, COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE } from '../config'

export const hexToRgb = (hex: string) => {
  const cleanHex = hex?.replace?.('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return color
}

export const rgbToRgbString = ({ r, g, b }: { r: number; g: number; b: number }) => {
  return `${r}, ${g}, ${b}`
}

export const hexToRgbString = (hex: string) => {
  const color = hexToRgb(hex)
  return rgbToRgbString(color)
}

export const hexToComponents = (hex: string): [number, number, number] => {
  const { r, g, b } = hexToRgb(hex)
  return [r, g, b]
}

export const rgbaStringToObject = (rgba: string) => {
  const [r, g, b, a] = rgba
    .substring(5, rgba.length - 1)
    .replace(/ /g, '')
    .split(',')

  return {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
    a: parseFloat(a),
  }
}

export const rgbaToString = ({ r, g, b, a = 1 }: RGBA) => {
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export const rgbaStringToComponents = (color: string) => {
  const rgba = color.match(/[.?\d]+/g)
  if (rgba)
    return [
      parseInt(rgba[0]),
      parseInt(rgba[1]),
      parseInt(rgba[2]),
      Math.round((parseFloat(rgba[3]) || 0) * 255),
    ]
  return []
}

export const BLEND_BACKGROUND = '#0f2e5f'
export const getBlend = (color1: RGBA, color2: RGBA) => {
  return normal({ ...hexToRgb(BLEND_BACKGROUND), a: 1 }, screen(color1 as RGBA, color2 as RGBA))
}

export const getColorRampByOpacitySteps = (
  finalColor: string,
  numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS
) => {
  const color = finalColor?.includes('#') ? hexToRgbString(finalColor) : finalColor
  const opacitySteps = [...Array(numSteps)].map((_, i) => (i + 1) / numSteps)
  return opacitySteps.map((opacity) => `rgba(${color}, ${opacity})`)
}

export const getColorRampToWhite = (
  hexColor: string,
  numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE[1]
) => {
  const rgbColor = hexToRgb(hexColor)
  const steps = [...Array(numSteps - 1)].map((_, i) => {
    const ratio = (i + 1) / numSteps
    const rgb = {
      r: Math.floor(rgbColor.r + (255 - rgbColor.r) * ratio),
      g: Math.floor(rgbColor.g + (255 - rgbColor.g) * ratio),
      b: Math.floor(rgbColor.b + (255 - rgbColor.b) * ratio),
    }
    return `rgba(${rgbToRgbString(rgb)}, 1)`
  })

  const ramp = [...steps, 'rgba(255, 255, 255, 1)']

  return ramp
}

export const getMixedOpacityToWhiteColorRamp = (
  finalColor: string,
  numStepsOpacity = COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE[0],
  numStepsTopWhite = COLOR_RAMP_DEFAULT_NUM_STEPS_TO_WHITE[1]
) => {
  return [
    ...getColorRampByOpacitySteps(finalColor, numStepsOpacity),
    ...getColorRampToWhite(finalColor, numStepsTopWhite),
  ]
}
