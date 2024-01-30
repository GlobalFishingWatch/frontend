import { FILL_COLOR_BAR_OPTIONS, LINE_COLOR_BAR_OPTIONS } from '@globalfishingwatch/layer-composer'

export type ColorBarOption = {
  id: string
  value: string
}

export const FillColorBarOptions: ColorBarOption[] = FILL_COLOR_BAR_OPTIONS

export const LineColorBarOptions: ColorBarOption[] = LINE_COLOR_BAR_OPTIONS
