import {
  DATASET_VERSION_SEPARATOR,
  PIPE_DATASET_ID,
} from '@globalfishingwatch/datasets-client/constants'

export const GLOBAL_VESSELS_DATASET_ID = 'public-global-all-vessels' as const
export const SKYLIGHT_VIIRS_DATASET_ID = 'public-global-skylight-viirs:v1.0' as const

export const DEFAULT_FISHING_DATASET_ID =
  `public-global-fishing-effort${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
export const DEFAULT_PRESENCE_DATASET_ID =
  `public-global-presence${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
export const DEFAULT_IDENTITY_DATASET_ID =
  `public-global-vessel-identity${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const

// Longline sets insight: Prototype dataset that doesn't follow the dataviews -> dataset workflow versioning and loading
// it's hardcoded here for simplicity, but at some point the content should be included in the fishing events dataset and removed from here
export const LONGLINE_FISHING_EVENTS_DATASET =
  `public-global-longline-fishing-events${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
