import { Workspace } from '@globalfishingwatch/api-types'
import { PUBLIC_SUFIX } from 'data/config'
import { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import { WorkspaceState } from 'types'

export const getWorkspaceLabel = (workspace: AppWorkspace | Workspace<WorkspaceState, string>) => {
  const isPrivate = !workspace.id.endsWith(`-${PUBLIC_SUFIX}`)
  return `${isPrivate ? '🔒 ' : ''}${workspace.name}`
}
