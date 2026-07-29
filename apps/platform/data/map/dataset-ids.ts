import {
  DATASET_VERSION_SEPARATOR,
  PIPE_DATASET_ID,
  PIPE_DATASET_VERSION,
} from '@globalfishingwatch/datasets-client'

/**
 * Plain dataset/dataview id constants.
 *
 * Split out of `data/workspaces` because that module imports @globalfishingwatch/deck-layers for
 * BasemapType, and modules that only need an id string must not pay for it. `utils/info` (reachable
 * from `routes/__root` via router.meta) used to pull deck-layers into every page's entry chunk
 * through exactly this edge. Guarded by scripts/check-store-graph.mjs.
 */
export const GLOBAL_VESSELS_DATASET_ID = 'public-global-all-vessels'
export const SKYLIGHT_VIIRS_DATASET_ID = 'public-global-skylight-viirs:v1.0'

export const PRESENCE_REALTIME_DATAVIEW_SLUG =
  `presence-realtime-v-${PIPE_DATASET_VERSION}` as const

export const DEFAULT_FISHING_DATASET_ID =
  `public-global-fishing-effort${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
export const DEFAULT_PRESENCE_DATASET_ID =
  `public-global-presence${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
export const DEFAULT_IDENTITY_DATASET_ID =
  `public-global-vessel-identity${DATASET_VERSION_SEPARATOR}${PIPE_DATASET_ID}` as const
