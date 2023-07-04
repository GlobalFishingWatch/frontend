import { Color } from '@deck.gl/core/typed'

export const hexToRgb = (hex: string) => {
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return color
}

export const hexToDeckColor = (hex: string, opacity = 1): Color => {
  const cleanHex = hex.replace('#', '')
  const color = {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  }
  return [color.r, color.g, color.b, opacity * 255]
}

function componentToHex(c: number) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export const deckToHexColor = ([r, g, b]: Color) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}
