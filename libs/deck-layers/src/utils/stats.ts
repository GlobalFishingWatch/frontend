import { ckmeans, mean, standardDeviation } from 'simple-statistics'

import { COLOR_RAMP_DEFAULT_NUM_STEPS } from './colorRamps'

export function getSteps(values: number[], numSteps = COLOR_RAMP_DEFAULT_NUM_STEPS) {
  if (!values?.length) return []
  const steps = Math.min(values.length, numSteps)
  const buckets = ckmeans(values, steps).map((step) => step[0])
  const filteredBuckets = buckets.filter((bucket, index) => bucket !== buckets[index - 1])
  if (filteredBuckets.length < numSteps) {
    // add one at the end to avoid using white when only one value is present
    filteredBuckets.push(filteredBuckets[filteredBuckets.length - 1] + 0.5)
    for (let i = filteredBuckets.length; i < numSteps; i++) {
      // add values at the beginning so more opaque colors are used for lower values
      filteredBuckets.unshift(filteredBuckets[0] - 0.1)
    }
  }
  return filteredBuckets
}

export function removeOutliers({
  allValues,
  aggregationOperation,
}: {
  allValues: number[]
  /* FourwingsAggregationOperation */
  aggregationOperation?: 'avg' | 'sum'
}) {
  const allValuesCleaned = allValues.filter(Boolean)
  if (!allValuesCleaned.length) return []
  const meanValue = mean(allValuesCleaned)
  const deviationScale = aggregationOperation === 'avg' ? 2 : 1
  const standardDeviationValue = standardDeviation(allValuesCleaned)
  const upperCut = meanValue + standardDeviationValue * deviationScale
  const lowerCut = meanValue - standardDeviationValue * deviationScale
  return allValuesCleaned.filter((a) => a >= lowerCut && a <= upperCut)
}
