import { ThinningConfig } from '@globalfishingwatch/api-types'

export enum ThinningLevels {
  Footprint = 'Footprint',
  Insane = 'Insane',
  VeryAggressive = 'VeryAggressive',
  Aggressive = 'aggressive',
  Default = 'default',
}

export const THINNING_LEVELS: Record<ThinningLevels, ThinningConfig> = {
  [ThinningLevels.Footprint]: {
    'distance-fishing': 1000,
    'bearing-val-fishing': 200,
    'change-speed-fishing': 5000,
    'min-accuracy-fishing': 5000,
    'distance-transit': 1000,
    'bearing-val-transit': 200,
    'change-speed-transit': 5000,
    'min-accuracy-transit': 5000,
  },
  [ThinningLevels.Insane]: {
    'distance-fishing': 10,
    'bearing-val-fishing': 20,
    'change-speed-fishing': 1000,
    'min-accuracy-fishing': 400,
    'distance-transit': 20,
    'bearing-val-transit': 20,
    'change-speed-transit': 1000,
    'min-accuracy-transit': 800,
  },
  [ThinningLevels.VeryAggressive]: {
    'distance-fishing': 10,
    'bearing-val-fishing': 10,
    'change-speed-fishing': 500,
    'min-accuracy-fishing': 100,
    'distance-transit': 20,
    'bearing-val-transit': 10,
    'change-speed-transit': 500,
    'min-accuracy-transit': 200,
  },
  [ThinningLevels.Aggressive]: {
    'distance-fishing': 1,
    'bearing-val-fishing': 5,
    'change-speed-fishing': 200,
    'min-accuracy-fishing': 50,
    'distance-transit': 2,
    'bearing-val-transit': 5,
    'change-speed-transit': 200,
    'min-accuracy-transit': 100,
  },
  [ThinningLevels.Default]: {
    'distance-fishing': 0.5,
    'bearing-val-fishing': 1,
    'change-speed-fishing': 200,
    'min-accuracy-fishing': 30,
    'distance-transit': 0.5,
    'bearing-val-transit': 1,
    'change-speed-transit': 200,
    'min-accuracy-transit': 30,
  },
}
