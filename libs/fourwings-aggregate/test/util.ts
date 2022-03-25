import { aggregate } from '../src/aggregate-tile'

const aggregateWith = (intArray, baseConfig, configOverrides) =>
  aggregate(intArray, { ...baseConfig, ...configOverrides }).main

export const getAt = (intArray, baseConfig, configOverrides, featureIndex, frame) => {
  const agg = aggregateWith(intArray, baseConfig, configOverrides)
  const at = agg.features[featureIndex].properties[frame]
  return at
}
