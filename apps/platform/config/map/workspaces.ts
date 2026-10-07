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
export const GAPS_EVENTS_WORKSPACE_ID = 'private_gap_events-public' as const

export const ARCHIVED_WORKSPACE_SUFFIX = '_archive'
export const PIPE_4_WORKSPACE_ID = 'default_v4_archive-public' as const

// Workspaces built for a specific pipe carry it in the id, e.g. `brazil_private_v4` or
// `default_v4_archive-public`. Returns the pipe major version ('4') or undefined.
const WORKSPACE_PIPE_VERSION_REGEX = /_v(\d+)(?=[_-]|$)/
export const getWorkspacePipeVersion = (workspaceId?: string) =>
  workspaceId?.match(WORKSPACE_PIPE_VERSION_REGEX)?.[1]
