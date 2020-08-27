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
