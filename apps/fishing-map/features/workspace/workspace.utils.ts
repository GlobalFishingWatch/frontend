import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  Workspace,
  WorkspaceUpsert,
} from '@globalfishingwatch/api-types'
import { PUBLIC_SUFIX } from 'data/config'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { WorkspaceState } from 'types'

export const MIN_WORKSPACE_PASSWORD_LENGTH = 5

export const parseUpsertWorkspace = (workspace: AppWorkspace): WorkspaceUpsert<WorkspaceState> => {
  const { id, ownerId, createdAt, ownerType, viewAccess, editAccess, ...restWorkspace } = workspace
  return restWorkspace
}

export const isPrivateWorkspaceNotAllowed = (
  workspace: AppWorkspace | Workspace<WorkspaceState> | null
): boolean => {
  if (!workspace) {
    return false
  }
  return workspace.viewAccess === WORKSPACE_PRIVATE_ACCESS && !workspace?.dataviewInstances.length
}

export const getWorkspaceLabel = (workspace: AppWorkspace | Workspace<WorkspaceState, string>) => {
  const isPrivate = !workspace.id.endsWith(`-${PUBLIC_SUFIX}`)
  const isPasswordProtected = workspace.viewAccess === WORKSPACE_PASSWORD_ACCESS
  const prefix = isPasswordProtected ? '🔐' : isPrivate ? '🔒 ' : ''
  return `${prefix}${workspace.name}`
}
