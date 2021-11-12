export type ColorBarOption = {
  id: string
  value: string
}

export const FillColorBarOptions: ColorBarOption[] = [
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

export const LineColorBarOptions: ColorBarOption[] = [
  { id: 'carnation', value: '#F95E5E' },
  { id: 'jungle-green', value: '#33B679' },
  { id: 'tangerine', value: '#F09300' },
  { id: 'dolly', value: '#FBFF8B' },
  { id: 'spring-green', value: '#1AFF6B' },
  // { id: 'wisteria', value: '#9E6AB0' }, // Not compatible with loitering events
  { id: 'pomegranate', value: '#F4511F' },
  // { id: 'cold-purple', value: '#B39DDB' }, // Not compatible with loitering events
  { id: 'salem', value: '#0B8043' },
  { id: 'aquamarine', value: '#67FBFE' },
  // { id: 'electric-violet', value: '#BB00FF' }, // Not compatible with loitering events
  { id: 'gossamer', value: '#069688' },
  { id: 'cornflower-blue', value: '#4184F4' },
  { id: 'jazzberry-jam', value: '#AD1457' },
  // { id: 'blush-pink', value: '#FE81E5' }, // Not compatible with loitering events
  { id: 'earls-green', value: '#C0CA33' },
  { id: 'seance', value: '#8E24A9' },
  { id: 'green-yellow', value: '#ABFF34' },
  { id: 'atomic-tangerine', value: '#FCA26F' },
]
