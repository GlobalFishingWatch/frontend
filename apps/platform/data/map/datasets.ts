import { DATASET_VERSION_SEPARATOR, PIPE_DATASET_ID } from '@globalfishingwatch/datasets-client'

export const GLOBAL_VESSELS_DATASET_ID = 'public-global-all-vessels'
export const SKYLIGHT_VIIRS_DATASET_ID = 'public-global-skylight-viirs:v1.0'

export const DEFAULT_FISHING_DATASET_ID =
  `public-global-fishing-effort${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
export const DEFAULT_PRESENCE_DATASET_ID =
  `public-global-presence${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
export const DEFAULT_IDENTITY_DATASET_ID =
  `public-global-vessel-identity${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
