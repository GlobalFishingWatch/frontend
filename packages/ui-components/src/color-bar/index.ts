export { default } from './ColorBar'

export type ColorBarIds =
  | 'teal'
  | 'magenta'
  | 'lilac'
  | 'salmon'
  | 'sky'
  | 'red'
  | 'yellow'
  | 'green'
  | 'orange'

export type ColorBarValues =
  | '#00FFBC'
  | '#FF64CE'
  | '#9CA4FF'
  | '#FFAE9B'
  | '#00EEFF'
  | '#FF6854'
  | '#FFEA00'
  | '#A6FF59'
  | '#FFAA0D'

export type ColorBarOption = {
  id: ColorBarIds
  value: ColorBarValues
}

export const ColorBarOptions: ColorBarOption[] = [
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
