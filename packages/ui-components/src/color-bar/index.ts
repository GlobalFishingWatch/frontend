export { default } from './ColorBar'

export type ColorBarOption = {
  id: string
  value: string
}

export type HeatmapColorBarIds =
  | 'teal'
  | 'magenta'
  | 'lilac'
  | 'salmon'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'green'
  | 'orange'

export type HeatmapColorBarValues =
  | '#00FFBC'
  | '#FF64CE'
  | '#9CA4FF'
  | '#FFAE9B'
  | '#00EEFF'
  | '#FF6854'
  | '#FFEA00'
  | '#A6FF59'
  | '#FFAA0D'

export const HeatmapColorBarOptions: ColorBarOption[] = [
  { id: 'teal', value: '#00FFBC' },
  { id: 'magenta', value: '#FF64CE' },
  { id: 'lilac', value: '#9CA4FF' },
  { id: 'salmon', value: '#FFAE9B' },
  { id: 'sky', value: '#00EEFF' },
  { id: 'red', value: '#FF6854' },
  { id: 'yellow', value: '#FFEA00' },
  { id: 'green', value: '#A6FF59' },
  { id: 'orange', value: '#FFAA0D' },
]

export type TrackColorBarValues =
  | '#F95E5E'
  | '#33B679'
  | '#F09300'
  | '#FBFF8B'
  | '#1AFF6B'
  | '#9E6AB0'
  | '#F4511F'
  | '#B39DDB'
  | '#0B8043'
  | '#67FBFE'
  | '#BB00FF'
  | '#069688'
  | '#4184F4'
  | '#AD1457'
  | '#FE81E5'
  | '#C0CA33'
  | '#8E24A9'
  | '#ABFF34'
  | '#FCA26F'

export const TrackColorBarOptions: ColorBarOption[] = [
  { id: 'carnation', value: '#F95E5E' },
  { id: 'jungle-green', value: '#33B679' },
  { id: 'tangerine', value: '#F09300' },
  { id: 'dolly', value: '#FBFF8B' },
  { id: 'spring-green', value: '#1AFF6B' },
  { id: 'wisteria', value: '#9E6AB0' },
  { id: 'pomegranate', value: '#F4511F' },
  { id: 'cold-purple', value: '#B39DDB' },
  { id: 'salem', value: '#0B8043' },
  { id: 'aquamarine', value: '#67FBFE' },
  { id: 'electric-violet', value: '#BB00FF' },
  { id: 'gossamer', value: '#069688' },
  { id: 'cornflower-blue', value: '#4184F4' },
  { id: 'jazzberry-jam', value: '#AD1457' },
  { id: 'blush-pink', value: '#FE81E5' },
  { id: 'earls-green', value: '#C0CA33' },
  { id: 'seance', value: '#8E24A9' },
  { id: 'green-yellow', value: '#ABFF34' },
  { id: 'atomic-tangerine', value: '#FCA26F' },
]
