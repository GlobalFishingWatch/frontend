import { aggregateTile } from '../dist/index.js'

export const aggregateWith = (intArray, baseConfig, configOverrides) =>
  aggregateTile(intArray, { ...baseConfig, ...configOverrides }).main

export const getAt = (intArray, baseConfig, configOverrides, featureIndex, frame) => {
  const agg = aggregateWith(intArray, baseConfig, configOverrides)
  const at = agg.features[featureIndex].properties[frame]
  return at
}
