import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  APIPagination,
  Dataset,
  Report,
  VesselGroup,
  Workspace,
} from '@globalfishingwatch/api-types'
import { DatasetStatus } from '@globalfishingwatch/api-types'
import type {
  AssistantContextToolOutput,
  AssistantResourceVisibility,
} from '@globalfishingwatch/skills/context-tools'

import {
  APP_NAME,
  AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX,
  DEFAULT_PAGINATION_PARAMS,
} from 'data/map/config'
import { isPrivateDataset, isPrivateVesselGroup } from 'features/_map/datasets/datasets.utils'
import { selectGroupsWithoutDatasetPermission } from 'features/_user/selectors/user.groups.selectors'
import {
  selectUserGroupsClean,
  selectUserId,
} from 'features/_user/selectors/user.permissions.selectors'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'

/**
 * `get_user_resources`: what the user owns, workspaces, datasets, vessel groups and saved reports,
 * on every page. The one context tool that fetches: the user page is the only one that lists them.
 *
 * Fetched here, not through the store thunks: those flip the shared `status` of each slice to
 * loading, and pages like vessel search show a spinner while the datasets status is not finished.
 */

// ponytail: most recent N per type plus `total`; add arguments when the agent needs more.
const MAX_ITEMS = 20
const MAX_NAME_LENGTH = 80

const name = (value = '') => value.slice(0, MAX_NAME_LENGTH)
const byNewest = <T extends { createdAt?: string }>(a: T, b: T) =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '')
const summary = <T>(items: T[]) => ({ total: items.length, items: items.slice(0, MAX_ITEMS) })

async function fetchEntries<T>(path: string, params: Record<string, unknown>) {
  const query = stringify({ ...params, ...DEFAULT_PAGINATION_PARAMS }, { arrayFormat: 'comma' })
  const response = await GFWAPI.fetch<APIPagination<T>>(`${path}?${query}`)
  return response.entries ?? []
}

async function fetchUserContext(
  userId: number
): Promise<AssistantContextToolOutput<'get_user_resources'>> {
  const owned = <T extends { ownerId?: number }>(entries: T[]) =>
    entries.filter((entry) => entry.ownerId === userId)
  const [workspaces, datasets, vesselGroups, reports] = await Promise.all([
    fetchEntries<Workspace>('/workspaces', { app: APP_NAME, 'logged-user-or-gfw': true }),
    fetchEntries<Dataset>('/datasets', { 'logged-user': true }),
    fetchEntries<VesselGroup>('/vessel-groups', { 'logged-user': true, exclude: ['vessels'] }),
    fetchEntries<Report>('/reports', { 'logged-user': true }),
  ])
  return {
    workspaces: summary(
      owned(workspaces)
        .filter((w) => !w.name.startsWith(AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX))
        .sort(byNewest)
        .map((w) => ({
          id: w.id,
          name: name(w.name),
          category: w.category,
          visibility: w.viewAccess as AssistantResourceVisibility,
        }))
    ),
    datasets: summary(
      owned(datasets)
        .filter((d) => d.status !== DatasetStatus.Deleted)
        // same order as selectUserDatasets: the API returns them oldest first
        .reverse()
        .map((d) => ({
          id: d.id,
          name: name(d.name),
          category: d.category,
          type: d.type,
          visibility: (isPrivateDataset(d) ? 'private' : 'public') as AssistantResourceVisibility,
        }))
    ),
    vesselGroups: summary(
      owned(vesselGroups)
        .sort(byNewest)
        .map((g) => ({
          id: g.id,
          name: name(g.name),
          vessels: g.vesselsSummary?.totalVessels,
          visibility: (isPrivateVesselGroup(g.id)
            ? 'private'
            : 'public') as AssistantResourceVisibility,
        }))
    ),
    reports: summary(
      owned(reports)
        .filter((r) => !r.name.startsWith(AUTO_GENERATED_FEEDBACK_WORKSPACE_PREFIX))
        .sort(byNewest)
        .map((r) => ({
          id: r.id,
          name: name(r.name),
          areaId: r.areaId,
          datasetId: r.datasetId,
          visibility: (r.public ? 'public' : 'private') as AssistantResourceVisibility,
        }))
    ),
  }
}

/** Fetched when the agent asks, so a resource created a moment ago is already there */
async function getUserResources({ reduxStore }: AssistantContextDeps) {
  const state = reduxStore.getState()
  const userId = selectUserId(state)
  if (!userId) return undefined
  return {
    groups: selectUserGroupsClean(state),
    groupsWithoutDatasetPermission: selectGroupsWithoutDatasetPermission(state),
    ...(await fetchUserContext(userId)),
  }
}

export const tools: AssistantContextModule['tools'] = { get_user_resources: getUserResources }
