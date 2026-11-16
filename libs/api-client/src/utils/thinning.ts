import type { ThinningConfig } from '@globalfishingwatch/api-types'

export enum ThinningLevels {
  Footprint = 'Footprint',
  Insane = 'Insane',
  VeryAggressive = 'VeryAggressive',
  Aggressive = 'Aggressive',
  Medium = 'Medium',
  Default = 'Default',
  None = 'None',
}

export const THINNING_LEVELS: Record<ThinningLevels, ThinningConfig> = {
  [ThinningLevels.Footprint]: {
    'distance-transit': 1000,
    'bearing-val-transit': 200,
    'change-speed-transit': 5000,
    'min-accuracy-transit': 5000,
  },
  [ThinningLevels.Insane]: {
    'distance-transit': 20,
    'bearing-val-transit': 20,
    'change-speed-transit': 1000,
    'min-accuracy-transit': 800,
  },
  [ThinningLevels.VeryAggressive]: {
    'distance-transit': 20,
    'bearing-val-transit': 10,
    'change-speed-transit': 500,
    'min-accuracy-transit': 200,
  },
  [ThinningLevels.Aggressive]: {
    'distance-transit': 2,
    'bearing-val-transit': 5,
    'change-speed-transit': 200,
    'min-accuracy-transit': 100,
  },
  [ThinningLevels.Medium]: {
    'distance-transit': 1,
    'bearing-val-transit': 3,
    'change-speed-transit': 200,
    'min-accuracy-transit': 70,
  },
  [ThinningLevels.Default]: {
    'distance-transit': 0.5,
    'bearing-val-transit': 1,
    'change-speed-transit': 200,
    'min-accuracy-transit': 30,
  },
  [ThinningLevels.None]: {},
}
