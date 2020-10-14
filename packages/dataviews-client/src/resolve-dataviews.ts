import { Dataview, DataviewInstance } from './types'

/**
 * Gets list of dataviews and those present in the workspace, and applies any config or datasetConfig
 * from it (merges dataview.config and workspace's dataviewConfig and datasetConfig).
 * @param dataviews
 * @param dataviewInstances
 */
export default function resolveDataviews(
  dataviews: Dataview[],
  dataviewInstances?: DataviewInstance[]
) {
  if (!dataviews) {
    console.warn('Empty dataviews to resolve')
    return
  }

  return dataviews.map((d) => {
    const dataview = { ...d }
    // retrieve workspace dataview that matches dataview so that we can collect overrides
    const workspaceDataview = dataviewInstances?.find(
      (workspaceDataview) => workspaceDataview.dataviewId === dataview.id
    )

    if (workspaceDataview) {
      // if workspace dataview exist, we'll overwrite original config
      if (workspaceDataview.config) {
        dataview.config = {
          ...dataview.config,
          ...workspaceDataview.config,
        }
      }

      if (dataview.datasetsConfig && workspaceDataview.datasetsConfig?.length) {
        dataview.datasetsConfig = dataview.datasetsConfig?.map((datasetConfig) => {
          const workspaceDatasetConfig = workspaceDataview.datasetsConfig?.find(
            (workspaceDatasetConfig) => datasetConfig.datasetId === workspaceDatasetConfig.datasetId
          )
          if (!workspaceDatasetConfig) return datasetConfig
          const { datasetId, ...rest } = workspaceDatasetConfig
          return {
            ...datasetConfig,
            ...rest,
          }
        })
      }
    }
    return dataview
  })
}
