import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { selectUrlDataviewInstances } from 'routes/routes.selectors'
import { UrlDataviewInstance } from 'types'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceDataviewInstances } from './workspace.selectors'

export const useDataviewInstancesConnect = () => {
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const { dispatchQueryParams } = useLocationConnect()

  const removeDataviewInstance = useCallback(
    (id: string) => {
      const dataviewInstances = urlDataviewInstances?.filter(
        (urlDataviewInstance) => urlDataviewInstance.id !== id
      )
      dispatchQueryParams({ dataviewInstances })
    },
    [dispatchQueryParams, urlDataviewInstances]
  )

  // TODO review if this is still needed or we switch to add / update
  const upsertDataviewInstance = useCallback(
    (dataviewInstance: Partial<UrlDataviewInstance>) => {
      const otherUrlDataviewInstances = (urlDataviewInstances || [])?.filter(
        (urlDataviewInstance) => urlDataviewInstance.id !== dataviewInstance.id
      )
      const urlDataviewInstance =
        urlDataviewInstances?.find(
          (urlDataviewInstance) => urlDataviewInstance.id === dataviewInstance.id
        ) || ({} as UrlDataviewInstance)
      const dataviewInstanceUpdated = {
        ...urlDataviewInstance,
        ...dataviewInstance,
        config: {
          ...urlDataviewInstance.config,
          ...dataviewInstance.config,
        },
      } as UrlDataviewInstance
      dispatchQueryParams({
        dataviewInstances: [...otherUrlDataviewInstances, dataviewInstanceUpdated],
      })
    },
    [dispatchQueryParams, urlDataviewInstances]
  )

  const workspaceDataviewInstances = useSelector(selectWorkspaceDataviewInstances)
  const deleteDataviewInstance = useCallback(
    (id: string) => {
      const dataviewInstances = (urlDataviewInstances || []).filter(
        (urlDataviewInstance) => urlDataviewInstance.id !== id
      )
      const workspaceDataviewInstance = workspaceDataviewInstances?.find(
        (dataviewInstance) => dataviewInstance.id === id
      )
      if (workspaceDataviewInstance) {
        dataviewInstances.push({ id, deleted: true })
      }
      dispatchQueryParams({ dataviewInstances })
    },
    [dispatchQueryParams, urlDataviewInstances, workspaceDataviewInstances]
  )
  return {
    upsertDataviewInstance,
    removeDataviewInstance,
    deleteDataviewInstance,
  }
}
