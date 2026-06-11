import type { FourwingsFeature } from '../lib/types'

// Rough per-feature heap cost outside the values arrays: feature and
// properties objects, coordinates array and fixed scalar props
const FEATURE_BYTES_OVERHEAD = 250
const BYTES_PER_VALUE = 8

export function estimateFourwingsFeaturesByteLength(features: FourwingsFeature[]) {
  let bytes = 0
  for (const feature of features) {
    bytes += FEATURE_BYTES_OVERHEAD
    for (const values of feature.properties.values) {
      if (values) {
        bytes += values.length * BYTES_PER_VALUE
      }
    }
    if (feature.properties.velocities) {
      bytes += feature.properties.velocities.length * BYTES_PER_VALUE
    }
    if (feature.properties.directions) {
      bytes += feature.properties.directions.length * BYTES_PER_VALUE
    }
  }
  return bytes
}

export function assignFourwingsFeaturesByteLength(features: FourwingsFeature[]) {
  // deck.gl Tileset2D reads content.byteLength for maxCacheByteSize cache
  // accounting. Plain assignment keeps the property enumerable so it survives
  // the structured clone back from the loader worker
  ;(features as FourwingsFeature[] & { byteLength: number }).byteLength =
    estimateFourwingsFeaturesByteLength(features)
  return features
}
