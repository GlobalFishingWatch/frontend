import { typedKeys } from './shared'

const baseColors = {
  // Removed since now they are in use on TRACK_COLORS setting and hauling
  // lime: '#00ff00',
  // magenta: '#ff00ff',
  maroon: '#800000',
  navy: '#000080',
  olive: '#808000',
  orange: '#ffa500',
  pink: '#ffc0cb',
  purple: '#800080',
  violet: '#800080',
  red: '#ff0000',
  silver: '#c0c0c0',
  yellow: '#ffff00',
  aqua: '#00ffff',
  black: '#000000',
  blue: '#0000ff',
  brown: '#a52a2a',
  cyan: '#00ffff',
  fuchsia: '#ff00ff',
  gold: '#ffd700',
  green: '#008000',
  indigo: '#4b0082',
  khaki: '#f0e68c',
  lightblue: '#add8e6',
  lightcyan: '#e0ffff',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightyellow: '#ffffe0',
}

export const getFixedColorForUnknownLabel = (index: number): string => {
  const color = typedKeys(baseColors)
    .filter((_, i) => index === i)
    .map((key) => baseColors[key])
    .shift()

  return color || '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
}
