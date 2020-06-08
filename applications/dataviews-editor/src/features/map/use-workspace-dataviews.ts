import { useMemo } from 'react'
import { Dataview, Workspace } from '@globalfishingwatch/dataviews-client'

export interface UniqueDataview extends Dataview {
  uid: string
}

/**
 * Gets list of dataviews and those present in the workspace, and applies any viewParams or datasetParams from it.
 * @param dataviews
 * @param workspace
 */
const useWorkspaceDataviews = (dataviews: Dataview[], workspace?: Workspace): UniqueDataview[] => {
  const newDataviews = useMemo(() => {
    return dataviews.map((dataview) => {
      const newDataview: UniqueDataview = {
        uid: '',
        ...dataview,
      }

      // collect everything to generate a generator unique id
      const generatedUidComponents: (string | number | undefined)[] = [dataview.id, dataview.name]

      // copy defaultViewParams|defaultDatasetsParams to viewParams|datasetsParams
      newDataview.viewParams = newDataview.defaultViewParams
      newDataview.datasetsParams = newDataview.defaultDatasetsParams

      // retrieve workspace dataview that matches dataview so that we can collect overrides
      const workspaceDataview =
        workspace &&
        workspace.workspaceDataviews.find(
          (workspaceDataview) => workspaceDataview.id === dataview.id
        )

      // if workspace dataview exist, we'll overwrite original viewParams|datasetsParams if they exist in workspace dataview
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
            // add id linked to dataset (ie vessel id) to identify generator uniquely
            generatedUidComponents.push(workspaceDataview.datasetsParams[index].id as string)
            return {
              ...datasetParams,
              ...workspaceDataview.datasetsParams[index],
            }
          }
          return datasetParams
        })
      } else {
        // add id linked to datasets (ie vessel id) to identify generator uniquely
        newDataview.datasetsParams?.forEach((datasetParams) =>
          generatedUidComponents.push(datasetParams.id as string)
        )
      }

      newDataview.uid = generatedUidComponents
        .filter((component) => component !== undefined)
        .join('_')
      return newDataview
    })
  }, [dataviews, workspace])
  return newDataviews
}

export default useWorkspaceDataviews
