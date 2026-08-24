export const PIPE_DATASET_VERSION = (import.meta.env?.VITE_PIPE_DATASET_VERSION || '4') as '4'
export const PIPE_DATASET_MINOR_VERSION = (import.meta.env?.VITE_PIPE_DATASET_MINOR_VERSION ||
  '0') as '0'

export const PIPE_DATASET_ID = `v${PIPE_DATASET_VERSION}.${PIPE_DATASET_MINOR_VERSION}` as const

export const DATASET_VERSION_SEPARATOR = ':' as const

export const DATASET_PUBLIC_PREFIX = 'public' as const
export const DATASET_FULL_PREFIX = 'full' as const
export const DATASET_PRIVATE_PREFIX = 'private' as const

export const ALL_DATASETS_PREFIX = [
  DATASET_PUBLIC_PREFIX,
  DATASET_FULL_PREFIX,
  DATASET_PRIVATE_PREFIX,
]

/**
 * Suffix marking a dataset-comparison dataview instance (e.g. `sar-v-4__dataset-comparison`).
 *
 * Lives here, in the lowest package of the three that need it, because both
 * `@globalfishingwatch/dataviews-client` and `@globalfishingwatch/deck-layer-composer` already
 * depend on this package. It used to be declared three times over — the composer exported a copy it
 * never used itself, dataviews-client kept a private one, and the platform app declared a third —
 * because importing either of those packages for one string cost the entry chunk of every page.
 * Declaring it here is what removes the duplication without inverting any dependency: the composer
 * depends on dataviews-client, so hosting it there instead would be a cycle.
 */
export const DATASET_COMPARISON_SUFFIX = 'dataset-comparison' as const
