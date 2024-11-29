import type { ColorCyclingType } from '@globalfishingwatch/api-types'
import type {
  ColorBarOption} from '@globalfishingwatch/ui-components';
import {
  FillColorBarOptions,
  LineColorBarOptions,
} from '@globalfishingwatch/ui-components'

export const getNextColor = (
  colorCyclingType: ColorCyclingType,
  currentColors: string[] | undefined
) => {
  const palette = colorCyclingType === 'fill' ? FillColorBarOptions : LineColorBarOptions
  if (!currentColors || !currentColors?.length) {
    return palette[0]
  }

  let minRepeat = Number.POSITIVE_INFINITY
  const availableColors: (ColorBarOption & { num: number })[] = palette.map((color) => {
    const num = currentColors.filter((c) => c === color.value).length
    if (num < minRepeat) minRepeat = num
    return {
      ...color,
      num,
    }
  })
  const nextColor = availableColors.find((c) => c.num === minRepeat) || availableColors[0]
  return nextColor
}
