import { Dataview, WorkspaceDataviewConfigDict, DataviewDatasetConfigDict } from './types'

/**
 * Gets list of dataviews and those present in the workspace, and applies any config or datasetConfig
 * from it (merges dataview.config and workspace's dataviewConfig and datasetConfig).
 * @param dataviews
 * @param workspaceDataviewsConfig
 */
export default function resolveDataviews(
  dataviews: Dataview[],
  workspaceDataviewsConfig?: WorkspaceDataviewConfigDict
) {
  if (!dataviews) {
    console.warn('Empty dataviews to resolve')
    return
  }

  return dataviews.map((dataview) => {
    const newDataview = { ...dataview }
    // retrieve workspace dataview that matches dataview so that we can collect overrides
    const workspaceDataview = workspaceDataviewsConfig && workspaceDataviewsConfig[dataview.id]

    if (workspaceDataview) {
      // if workspace dataview exist, we'll overwrite original config
      if (workspaceDataview.config) {
        newDataview.config = {
          ...newDataview.config,
          ...workspaceDataview.config,
        }
      }

      if (workspaceDataview.datasetsConfig) {
        const datasetsConfig: DataviewDatasetConfigDict = {}
        Object.entries(workspaceDataview.datasetsConfig).forEach(([key, value]) => {
          datasetsConfig[key] = value
          // TODO once we support multiple datasetsConfig in same dataview
          // replace default dataviewDatasetsConfig if exists in workspace datasetsConfig
          // datasetsConfig[key] = {
          //   ...newDataview.datasetsConfig,
          //   ...value,
          // }
        })
        newDataview.datasetsConfig = datasetsConfig
      }
    }
    return newDataview
  })
}
