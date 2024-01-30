import { LINE_COLOR_BAR_OPTIONS } from '@globalfishingwatch/layer-composer'

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

export const LineColorBarOptions: ColorBarOption[] = LINE_COLOR_BAR_OPTIONS
