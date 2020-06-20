import { Dataview, WorkspaceDataview, ResolvedDataview, DatasetParams } from './types'

/**
 * Gets list of dataviews and those present in the workspace, and applies any view or datasetParams from it (merges dataview.defaultView with dataview.view and workspace's dataview.view).
 * @param dataviews
 * @param workspace
 */
export default (dataviews: Dataview[], workspaceDataviews?: WorkspaceDataview[]) => {
  return dataviews.map((dataview) => {
    const newDataview: ResolvedDataview = {
      uid: '',
      datasetsParamIds: [],
      ...dataview,
    }

    // collect everything to generate a generator unique id
    const generatedUidComponents: (string | number | undefined)[] = [dataview.id, dataview.name]

    // copy defaultView|defaultDatasetsParams to view|datasetsParams
    newDataview.view = newDataview.defaultView
    newDataview.datasetsParams = newDataview.defaultDatasetsParams

    // retrieve workspace dataview that matches dataview so that we can collect overrides
    const workspaceDataview =
      workspaceDataviews &&
      workspaceDataviews.find((workspaceDataview) => workspaceDataview.id === dataview.id)

    // if workspace dataview exist, we'll overwrite original view|datasetsParams if they exist in workspace dataview
    if (workspaceDataview) {
      newDataview.view = {
        ...newDataview.view,
        ...workspaceDataview.view,
      }
      newDataview.datasetsParams = newDataview.datasetsParams?.map((datasetParams, index) => {
        // add id linked to dataset (ie vessel id) to identify generator uniquely
        const workspaceDatasetParams =
          (workspaceDataview.datasetsParams && workspaceDataview.datasetsParams[index]) || {}

        const newDatasetParams = {
          ...datasetParams,
          ...workspaceDatasetParams,
        }

        generatedUidComponents.push((newDatasetParams.params as DatasetParams).id as string)
        newDataview.datasetsParamIds.push((newDatasetParams.params as DatasetParams).id as string)

        return newDatasetParams
      })
    } else {
      // add id linked to datasets (ie vessel id) to identify generator uniquely
      newDataview.datasetsParams?.forEach((datasetParams) => {
        generatedUidComponents.push((datasetParams.params as DatasetParams).id as string)
        newDataview.datasetsParamIds.push(datasetParams.id as string)
      })
    }

    newDataview.uid = generatedUidComponents
      .filter((component) => component !== undefined)
      .join('_')
    return newDataview
  })
}
