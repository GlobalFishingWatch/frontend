import { useMemo } from 'react'
import { resolveDataviews } from '@globalfishingwatch/dataviews-client'
import { Dataview, DataviewInstance } from '@globalfishingwatch/api-types'

/**
 * Gets list of dataviews and those present in the workspace, and applies any view or datasetParams from it (merges dataview.defaultView with dataview.view and workspace's dataview.view).
 * @param dataviews
 * @param workspace
 */
const useWorkspace = (
  dataviews: Dataview[],
  dataviewInstances?: DataviewInstance[]
): Dataview[] | undefined => {
  const newDataviews = useMemo(() => {
    return resolveDataviews(dataviews, dataviewInstances)
  }, [dataviews, dataviewInstances])
  return newDataviews
}

export default useWorkspace
