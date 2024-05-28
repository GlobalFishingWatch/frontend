import { Workspace, WorkspaceUpsert } from '@globalfishingwatch/api-types'
import { PUBLIC_SUFIX } from 'data/config'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { WorkspaceState } from 'types'

export const MIN_WORKSPACE_PASSWORD_LENGTH = 5

export const parseUpsertWorkspace = (workspace: AppWorkspace): WorkspaceUpsert<WorkspaceState> => {
  const { id, ownerId, createdAt, ownerType, viewAccess, editAccess, ...restWorkspace } = workspace
  return restWorkspace
}

export const getWorkspaceLabel = (workspace: AppWorkspace | Workspace<WorkspaceState, string>) => {
  const isPrivate = !workspace.id.endsWith(`-${PUBLIC_SUFIX}`)
  return `${isPrivate ? '🔒 ' : ''}${workspace.name}`
}
