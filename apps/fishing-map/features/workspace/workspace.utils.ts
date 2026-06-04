import type { ColorCyclingType, Workspace, WorkspaceUpsert } from '@globalfishingwatch/api-types'
import { WORKSPACE_PASSWORD_ACCESS, WORKSPACE_PRIVATE_ACCESS } from '@globalfishingwatch/api-types'
import type { ColorBarOption } from '@globalfishingwatch/ui-components'
import { FillColorBarOptions, LineColorBarOptions } from '@globalfishingwatch/ui-components'

import { PRIVATE_ICON, PRIVATE_PASSWORD_ICON, PUBLIC_SUFIX } from 'data/config'
import { cleanAggregateByPropertyDataviewFromReport } from 'features/reports/report-area/area-reports.utils'
import { cleanPortClusterDataviewFromReport } from 'features/reports/report-port/ports-report.utils'
import { DEFAULT_REPORT_STATE } from 'features/reports/reports.config'
import { cleanDatasetComparisonDataviewInstances } from 'features/reports/tabs/activity/reports-activity-timeseries.utils'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'
import type { QueryParams, WorkspaceState } from 'types'

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
    return `${isPasswordProtected ? PRIVATE_PASSWORD_ICON : PRIVATE_ICON} ${workspace.name}`
  }
  return workspace.name
}

export const getNextColor = (colorCyclingType: ColorCyclingType, currentColors?: string[]) => {
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

export function cleanReportQuery(query: QueryParams) {
  return {
    ...query,
    ...Object.keys(DEFAULT_REPORT_STATE).reduce(
      (acc, key) => {
        acc[key] = undefined
        return acc
      },
      {} as Record<string, undefined>
    ),
    ...(query?.dataviewInstances?.length && {
      dataviewInstances: cleanDatasetComparisonDataviewInstances(
        query?.dataviewInstances?.map((dI) =>
          cleanPortClusterDataviewFromReport(cleanAggregateByPropertyDataviewFromReport(dI))
        )
      ),
    }),
  }
}

export function cleanReportPayload(payload: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { areaId, datasetId, reportId, ...rest } = payload || {}
  return rest
}

export function getWorkspaceReport(workspace: Workspace<WorkspaceState>, daysFromLatest?: number) {
  const { ownerId, createdAt, ownerType, viewAccess, editAccess, state, ...workspaceProperties } =
    workspace

  return { ...workspaceProperties, state: { ...state, daysFromLatest } }
}
