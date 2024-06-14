import { ckmeans, mean, standardDeviation } from 'simple-statistics'
import { COLOR_RAMP_DEFAULT_NUM_STEPS } from './colorRamps'

export function getSteps(values: number[], numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS) {
  if (!values?.length) return []
  const steps = Math.min(values.length, numSteps)
  const buckets = ckmeans(values, steps).map((step) => step[0])
  if (buckets.length < numSteps) {
    for (let i = buckets.length; i < numSteps; i++) {
      buckets.push(buckets[i - 1] + 1)
    }
  }
  return buckets
}

export function removeOutliers({
  allValues,
  aggregationOperation,
}: {
  allValues: number[]
  /* FourwingsAggregationOperation */
  aggregationOperation?: 'avg' | 'sum'
}) {
  const meanValue = mean(allValues)
  const deviationScale = aggregationOperation === 'avg' ? 2 : 0.75
  const standardDeviationValue = standardDeviation(allValues)
  const upperCut = meanValue + standardDeviationValue * deviationScale
  const lowerCut = meanValue - standardDeviationValue * deviationScale
  return allValues.filter((a) => a >= lowerCut && a <= upperCut)
}
