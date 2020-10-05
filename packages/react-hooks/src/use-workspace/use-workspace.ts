import { useMemo } from 'react'
import {
  Dataview,
  WorkspaceDataviewConfig,
  resolveDataviews,
} from '@globalfishingwatch/dataviews-client'

/**
 * Gets list of dataviews and those present in the workspace, and applies any view or datasetParams from it (merges dataview.defaultView with dataview.view and workspace's dataview.view).
 * @param dataviews
 * @param workspace
 */
const useWorkspace = (
  dataviews: Dataview[],
  workspaceDataviews?: WorkspaceDataviewConfig[]
): Dataview[] | undefined => {
  const newDataviews = useMemo(() => {
    return resolveDataviews(dataviews, workspaceDataviews)
  }, [dataviews, workspaceDataviews])
  return newDataviews
}

export default useWorkspace
