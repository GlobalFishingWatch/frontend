import { format } from 'd3-format'

export const formatSliderNumber = (num: number): string => {
  const absNum = Math.abs(num)
  if (absNum >= 1000) return format('.2s')(num)
  if (absNum > 9) return format('.0f')(num)
  return Number.isInteger(num) ? format('.0f')(num) : format('.1f')(num)
}

type SliderTrackBackground = {
  min: number
  max: number
  values: number[]
  colors: string[]
}

// Builds a horizontal `linear-gradient` for the slider track, replicating the
// output of react-range's `getTrackBackground` (n colors require n-1 values).
export const getSliderTrackBackground = ({
  min,
  max,
  values,
  colors,
}: SliderTrackBackground): string => {
  const progress = values
    .slice(0)
    .sort((a, b) => a - b)
    .map((value) => ((value - min) / (max - min)) * 100)
  const middle = progress.reduce(
    (acc, point, index) => `${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
    ''
  )
  return `linear-gradient(to right, ${colors[0]} 0%${middle}, ${colors[colors.length - 1]} 100%)`
}
