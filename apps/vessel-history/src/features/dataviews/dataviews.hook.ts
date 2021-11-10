import { useCallback } from 'react'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useLocationConnect } from 'routes/routes.hook'
import { dataviewInstances as allDataviewInstances } from './dataviews.config'

export const useDataviewInstancesConnect = () => {
  const { dispatchQueryParams } = useLocationConnect()

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
        dispatchQueryParams({ dataviewInstances })
      } else {
        dispatchQueryParams({
          dataviewInstances: [
            dataviewInstance as UrlDataviewInstance,
            ...(allDataviewInstances || []),
          ],
        })
      }
    },
    [dispatchQueryParams]
  )

  return {
    upsertDataviewInstance,
    // removeDataviewInstance,
    // deleteDataviewInstance,
  }
}
