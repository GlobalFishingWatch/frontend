import { Workspace } from '@globalfishingwatch/api-types'
import { TEMPLATE_VESSEL_DATAVIEW_ID } from 'data/workspaces'

export const parseLegacyWorkspaceEndpoints = (workspace: Workspace) => {
  return {
    ...workspace,
    dataviewInstances: workspace.dataviewInstances?.map((dv) => ({
      ...dv,
      dataviewId: dv.dataviewId === 92 ? TEMPLATE_VESSEL_DATAVIEW_ID : dv.dataviewId,
      ...(dv.datasetsConfig && {
        datasetsConfig: dv.datasetsConfig.map((dc) => ({
          ...dc,
          endpoint: dc.endpoint.replace('carriers-', ''),
        })),
      }),
    })),
  }
}
