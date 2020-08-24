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

      if (newDataview.datasetsConfig) {
        const datasetsConfig: DataviewDatasetConfigDict = {}
        Object.entries(newDataview.datasetsConfig).forEach(([key, value]) => {
          // replace default dataviewDatasetsConfig if exists in workspace datasetsConfig
          const workspaceDataviewDatasetConfig =
            workspaceDataview.datasetsConfig && workspaceDataview.datasetsConfig[key]
          if (workspaceDataviewDatasetConfig) {
            datasetsConfig[key] = {
              ...value,
              ...workspaceDataviewDatasetConfig,
            }
          }
        })
        newDataview.datasetsConfig = datasetsConfig
      }
    }
    return newDataview
  })
}
