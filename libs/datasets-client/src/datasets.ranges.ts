import { scaleLinear } from 'd3-scale'

import { COLOR_RAMP_DEFAULT_NUM_STEPS } from './datasets.config'

export const getDatasetRangeSteps = ({ min, max }: { min: number; max: number }) => {
  const rampScale = scaleLinear()
    .range([min, max || min + 0.00001])
    .domain([0, 1])
  const numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS
  const steps = [...Array(numSteps)]
    .map((_, i) => i / (numSteps - 1))
    .map((value) => rampScale(value) as number)
  return steps
}
