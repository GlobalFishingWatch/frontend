import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { UrlDataviewInstance } from 'types'
import { selectDataviewInstances } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceDataviewInstances } from './workspace.selectors'

export const useDataviewInstancesConnect = () => {
  const urlDataviewInstances = useSelector(selectDataviewInstances)
  const workspaceDataviewInstances = useSelector(selectWorkspaceDataviewInstances)
  const { dispatchQueryParams } = useLocationConnect()

  const upsertDataviewInstance = useCallback(
    (dataviewInstance: Partial<UrlDataviewInstance>) => {
      const currentDataviewInstance = urlDataviewInstances?.find(
        (urlDataviewInstance) => urlDataviewInstance.id === dataviewInstance.id
      )
      if (currentDataviewInstance) {
        const dataviewInstances = urlDataviewInstances.map((urlDataviewInstance) => {
          if (urlDataviewInstance.id !== dataviewInstance.id) return urlDataviewInstance
          return {
            ...urlDataviewInstance,
            ...dataviewInstance,
          }
        })
        dispatchQueryParams({ dataviewInstances })
      } else {
        dispatchQueryParams({
          dataviewInstances: [...(urlDataviewInstances || []), dataviewInstance],
        })
      }
    },
    [dispatchQueryParams, urlDataviewInstances]
  )

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
  return { upsertDataviewInstance, deleteDataviewInstance }
}
