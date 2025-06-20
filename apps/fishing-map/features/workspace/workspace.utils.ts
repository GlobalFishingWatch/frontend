import type { ColorCyclingType, Workspace, WorkspaceUpsert } from '@globalfishingwatch/api-types'
import { WORKSPACE_PASSWORD_ACCESS, WORKSPACE_PRIVATE_ACCESS } from '@globalfishingwatch/api-types'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { FillColorBarOptions, LineColorBarOptions } from '@globalfishingwatch/ui-components'

import { PUBLIC_SUFIX } from 'data/config'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import type { WorkspaceState } from 'types'

export const MIN_WORKSPACE_PASSWORD_LENGTH = 5

export const parseUpsertWorkspace = (
  workspace: AppWorkspace | Partial<AppWorkspace>
): WorkspaceUpsert<WorkspaceState> => {
  const { id, ownerId, createdAt, ownerType, viewAccess, ...restWorkspace } = workspace
  return restWorkspace as WorkspaceUpsert<WorkspaceState>
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
  if (isPrivate || isPasswordProtected) {
    return `${isPasswordProtected ? '🔐' : '🔒'} ${workspace.name}`
  }
  return workspace.name
}

export const getNextColor = (
  colorCyclingType: ColorCyclingType,
  currentColors: string[] | undefined
) => {
  const palette = colorCyclingType === 'fill' ? FillColorBarOptions : LineColorBarOptions
  if (!currentColors) {
    return palette[Math.floor(Math.random() * palette.length)]
  }
  let minRepeat = Number.POSITIVE_INFINITY
  const availableColors: (ColorBarOption & { num: number })[] = palette.map((color) => {
    const num = currentColors.filter((c) => c === color.value).length
    if (num < minRepeat) minRepeat = num
    return {
      ...color,
      num,
    }
  })
  const nextColor = availableColors.find((c) => c.num === minRepeat) || availableColors[0]
  return nextColor
}
