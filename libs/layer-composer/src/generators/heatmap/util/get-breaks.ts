import { scalePow } from 'd3-scale'

const roundNumber = (number: number) => {
  const precision = Array.from(Math.round(number).toString()).reduce((acc) => acc * 10, 0.1)
  const rounded = Math.floor(number / precision) * precision
  return rounded
}

export const getCleanBreaks = (breaks: number[]): number[] => {
  const prevStepValues: number[] = []
  return breaks.map((stop, index) => {
    let roundValue = roundNumber(stop)
    if (prevStepValues.indexOf(roundValue) > -1) {
      roundValue = prevStepValues[index - 1] + 1
    }
    prevStepValues.push(roundValue)
    return roundValue
  })
}

/**
 * Generates a breaks array made of:
 * - 0 --> might need to revise if its always the base value, ie to we have diverging scales at some point?
 * - minimum value
 * - a number of steps along an exponential scale.
 *    - intermediateBreakRatios represent the ratios on the scale and should be in ascending order
 *    - scalePowExponent defines the exponential curve
 * - the max value
 *
 * NOTE: With the default params, a total of 6 values will be produced. This is how it is used by the Heatmap generator as it treats each value to be a bucket/class
 * HeatmapAnimated differs in that it considers each value to be a break, meaning it represents values below the first value and above the last value. Which is why HeatmapAnimated
 * calls getBreaks with 2 intermediateBreakRatios, not 3, and generates 5 values instead of 6 (ie last color ramp value is for values > last break).
 */
const getBreaks = (
  min: number,
  max: number,
  avg: number,
  scalePowExponent = 1,
  // intermediateBreakRatios = [0.25, 0.5, 0.75],
  numBreaks = 6,
  multiplier = 1
) => {
  const roundedMax = roundNumber(max)
  const scale = scalePow()
    .exponent(scalePowExponent)
    // TODO Could this be [0, 1] or even omitted?
    .domain([0, 0.5, 1])
    .range([min, avg, roundedMax])

  const numIntermediateBreaks = numBreaks - 3
  // [0.25, 0.5, 0.75]
  const intermediateBreakRatios = [...Array(numIntermediateBreaks)].map(
    (_, i) => (i + 1) / (numIntermediateBreaks + 1)
  )

  const intermediateBreaks = intermediateBreakRatios.map((ratio) => scale(ratio))
  let breaks: number[] = [0, min, ...intermediateBreaks, roundedMax]

  breaks = getCleanBreaks(breaks)

  // apply multiplier
  breaks = breaks.map((number) => number * multiplier)

  // Round to 2 decimals
  // TODO this is not good enough, revise with the 'k' suffix and why it produces decimals when changing delta
  breaks = breaks.map((number) => Math.round(number * 100) / 100)

  return breaks
}

export default getBreaks
