import { DATASET_PUBLIC_PREFIX } from '@globalfishingwatch/datasets-client/constants'

// Note: erasable-syntax-only package (loaded by plain node via type stripping) — const object instead of enum
export const WorkspaceCategory = {
  FishingActivity: 'fishing-activity',
  MarineManager: 'marine-manager',
  Reports: 'reports',
} as const
export type WorkspaceCategory = (typeof WorkspaceCategory)[keyof typeof WorkspaceCategory]

const DEFAULT_WORKSPACE_KEY = 'default'
export const DEFAULT_WORKSPACE_ID = `${DEFAULT_WORKSPACE_KEY}-${DATASET_PUBLIC_PREFIX}`
export const DEFAULT_WORKSPACE_CATEGORY = WorkspaceCategory.FishingActivity

export const DEEP_SEA_MINING_WORKSPACE_ID = 'deep-sea-mining-public' as const
export const LONGLINE_SETS_WORKSPACE_ID = 'seabird_safe_longline_sets-public' as const
export const GAPS_EVENTS_WORKSPACE_ID = 'private_gap_events-public' as const

export const ARCHIVED_WORKSPACE_SUFFIX = '_archive'
export const PIPE_4_WORKSPACE_ID = 'default_v4_archive-public' as const
