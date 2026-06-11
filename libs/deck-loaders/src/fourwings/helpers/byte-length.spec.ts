import { describe, expect, it } from 'vitest'

import type { FourwingsFeature } from '../lib/types'

import { assignFourwingsFeaturesByteLength, estimateFourwingsFeaturesByteLength } from './byte-length'

const createFeature = (overrides: Partial<FourwingsFeature['properties']> = {}): FourwingsFeature =>
  ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {
      values: [[1, 2]],
      tileStartFrame: 0,
      ...overrides,
    },
  }) as FourwingsFeature

describe('fourwings byte length', () => {
  it('estimates heatmap feature byte length from values arrays', () => {
    const features = [createFeature({ values: [[1, 2, 3]] })]

    expect(estimateFourwingsFeaturesByteLength(features)).toBe(250 + 3 * 8)
  })

  it('includes vector velocities and directions in the estimate', () => {
    const features = [
      createFeature({
        values: [[]],
        velocities: [1, 2],
        directions: [3],
      }),
    ]

    expect(estimateFourwingsFeaturesByteLength(features)).toBe(250 + 2 * 8 + 1 * 8)
  })

  it('assigns byteLength on the features array', () => {
    const features = [createFeature()]

    assignFourwingsFeaturesByteLength(features)

    expect((features as FourwingsFeature[] & { byteLength: number }).byteLength).toBe(
      estimateFourwingsFeaturesByteLength(features)
    )
  })
})
