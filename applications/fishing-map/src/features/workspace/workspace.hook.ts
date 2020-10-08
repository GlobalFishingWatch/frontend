import { useSelector } from 'react-redux'
import { useCallback } from 'react'
import { WorkspaceDataviewConfig } from '@globalfishingwatch/dataviews-client'
import { selectDataviewsConfig } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { selectWorkspaceDataviewConfig } from './workspace.selectors'

export const useDataviewsConfigConnect = () => {
  const urlDataviewsConfig = useSelector(selectDataviewsConfig)
  const workspaceDataviewsConfig = useSelector(selectWorkspaceDataviewConfig)
  const { dispatchQueryParams } = useLocationConnect()

  const updateDataviewConfig = useCallback(
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

  const deleteDataviewConfig = useCallback(
    (id: string) => {
      const dataviewsConfig = (urlDataviewsConfig || []).filter(
        (urlDataviewConfig) => urlDataviewConfig.id !== id
      )
      const workspaceDataviewConfig = workspaceDataviewsConfig?.find(
        (dataviewConfig) => dataviewConfig.id === id
      )
      if (workspaceDataviewConfig) {
        dataviewsConfig.push({ id, deleted: true })
      }
      dispatchQueryParams({ dataviewsConfig })
    },
    [dispatchQueryParams, urlDataviewsConfig, workspaceDataviewsConfig]
  )
  return { updateDataviewConfig, deleteDataviewConfig }
}
