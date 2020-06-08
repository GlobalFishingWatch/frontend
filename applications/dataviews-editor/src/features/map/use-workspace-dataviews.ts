import { useMemo } from 'react'
import { Dataview, Workspace } from '@globalfishingwatch/dataviews-client'

/**
 * Filters list of dataviews by those present in the workspace, and applies any viewParams or datasetParams from it.
 * @param dataviews
 * @param workspace
 */
const useWorkspaceDataviews = (dataviews: Dataview[], workspace?: Workspace): Dataview[] => {
  const newDataviews = useMemo(() => {
    return dataviews.map((dataview) => {
      const newDataview = { ...dataview }
      newDataview.viewParams = newDataview.defaultViewParams
      newDataview.datasetsParams = newDataview.defaultDatasetsParams
      const workspaceDataview =
        workspace &&
        workspace.workspaceDataviews.find(
          (workspaceDataview) => workspaceDataview.id === dataview.id
        )

      if (workspaceDataview) {
        newDataview.viewParams = {
          ...newDataview.viewParams,
          ...workspaceDataview.viewParams,
        }
        newDataview.datasetsParams = newDataview.datasetsParams?.map((datasetParams, index) => {
          if (
            workspaceDataview &&
            workspaceDataview.datasetsParams &&
            workspaceDataview.datasetsParams[index]
          ) {
            return {
              ...datasetParams,
              ...workspaceDataview.datasetsParams[index],
            }
          }
          return datasetParams
        })
      }
      return newDataview
    })
  }, [dataviews, workspace])
  return newDataviews
}

export default useWorkspaceDataviews
