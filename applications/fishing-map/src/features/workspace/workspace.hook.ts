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

  const upsertDataviewInstance = useCallback(
    (dataviewInstance_: Partial<UrlDataviewInstance> | Partial<UrlDataviewInstance>[]) => {
      const newDataviewInstances = Array.isArray(dataviewInstance_)
        ? dataviewInstance_
        : [dataviewInstance_]

      const updatedDataviewInstances = (urlDataviewInstances || []).map((urlDataviewInstance) => {
        const newDataviewInstanceIndex = newDataviewInstances.findIndex(
          (d) => d.id === urlDataviewInstance.id
        )
        const newDataviewInstance = newDataviewInstances.splice(newDataviewInstanceIndex, 1)[0]
        if (!newDataviewInstance) return urlDataviewInstance
        return {
          ...urlDataviewInstance,
          ...newDataviewInstance,
          config: {
            ...urlDataviewInstance.config,
            ...newDataviewInstance.config,
          },
        }
      })

      const upsertedDataviewInstances = [
        ...updatedDataviewInstances,
        ...(newDataviewInstances as UrlDataviewInstance[]),
      ]
      dispatchQueryParams({ dataviewInstances: upsertedDataviewInstances })
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
