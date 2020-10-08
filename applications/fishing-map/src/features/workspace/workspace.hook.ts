import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { WorkspaceDataviewConfig } from '@globalfishingwatch/dataviews-client'
import { selectDataviewsConfig } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useDataviewsConfigConnect = () => {
  const urlDataviewsConfig = useSelector(selectDataviewsConfig)
  const { dispatchQueryParams } = useLocationConnect()
  const updateUrlDataviewConfig = useCallback(
    (dataviewConfig: Partial<WorkspaceDataviewConfig>) => {
      const currentDataviewConfig = urlDataviewsConfig?.find(
        (urlDataviewConfig) => urlDataviewConfig.id === dataviewConfig.id
      )
      if (currentDataviewConfig) {
        const dataviewsConfig = urlDataviewsConfig.map((urlDataviewConfig) => {
          if (urlDataviewConfig.id !== dataviewConfig.id) return urlDataviewConfig
          return {
            ...urlDataviewConfig,
            ...dataviewConfig,
          }
        })
        dispatchQueryParams({ dataviewsConfig })
      } else {
        dispatchQueryParams({ dataviewsConfig: [...(urlDataviewsConfig || []), dataviewConfig] })
      }
    },
    [dispatchQueryParams, urlDataviewsConfig]
  )
  return { updateUrlDataviewConfig }
}
