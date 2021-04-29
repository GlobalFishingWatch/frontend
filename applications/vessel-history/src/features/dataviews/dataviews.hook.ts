import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useLocationConnect } from 'routes/routes.hook'
import { dataviewInstances as allDataviewInstances } from './dataviews.config'

export const useDataviewInstancesConnect = () => {
  // const allDataviewInstances = useSelector(selectUrlDataviewInstances)
  const { dispatchQueryParams } = useLocationConnect()

  // const removeDataviewInstance = useCallback(
  //   (id: string) => {
  //     const dataviewInstances = allDataviewInstances?.filter(
  //       (urlDataviewInstance) => urlDataviewInstance.id !== id
  //     )
  //     dispatchQueryParams({ dataviewInstances })
  //   },
  //   [dispatchQueryParams, allDataviewInstances]
  // )

  // TODO review if this is still needed or we switch to add / update
  const upsertDataviewInstance = useCallback(
    (dataviewInstance: Partial<UrlDataviewInstance>) => {
      const currentDataviewInstance = allDataviewInstances?.find(
        (urlDataviewInstance) => urlDataviewInstance.id === dataviewInstance.id
      )
      if (currentDataviewInstance) {
        const dataviewInstances = allDataviewInstances.map((urlDataviewInstance) => {
          if (urlDataviewInstance.id !== dataviewInstance.id) return urlDataviewInstance
          return {
            ...urlDataviewInstance,
            ...dataviewInstance,
            config: {
              ...urlDataviewInstance.config,
              ...dataviewInstance.config,
            },
          }
        })
        // dispatchQueryParams({ dataviewInstances })
      } else {
        // dispatchQueryParams({
        //   dataviewInstances: [
        //     dataviewInstance as UrlDataviewInstance,
        //     ...(allDataviewInstances || []),
        //   ],
        // })
      }
    },
    [dispatchQueryParams, allDataviewInstances]
  )

  // const workspaceDataviewInstances = useSelector(selectWorkspaceDataviewInstances)
  // const deleteDataviewInstance = useCallback(
  //   (id: string) => {
  //     const dataviewInstances = (allDataviewInstances || []).filter(
  //       (urlDataviewInstance) => urlDataviewInstance.id !== id
  //     )
  //     const workspaceDataviewInstance = workspaceDataviewInstances?.find(
  //       (dataviewInstance) => dataviewInstance.id === id
  //     )
  //     if (workspaceDataviewInstance) {
  //       dataviewInstances.push({ id, deleted: true })
  //     }
  //     dispatchQueryParams({ dataviewInstances })
  //   },
  //   [dispatchQueryParams, allDataviewInstances, workspaceDataviewInstances]
  // )
  return {
    upsertDataviewInstance,
    // removeDataviewInstance,
    // deleteDataviewInstance,
  }
}
