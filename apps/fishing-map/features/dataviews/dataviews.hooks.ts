import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { Dataset, DataviewConfig, DataviewInstance } from '@globalfishingwatch/api-types'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { LEGACY_TO_LATEST_DATAVIEWS } from 'data/dataviews'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk, selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import type { SchemaFieldDataview, SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import { getDatasetsInDataviews, isDataviewSchemaSupported } from 'features/datasets/datasets.utils'
import { fetchDataviewByIdThunk, selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

export function useMigrateToLatestDataview() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const allDataviews = useSelector(selectAllDataviews)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const workspaceDataviewInstances = useSelector(selectDataviewInstancesResolvedVisible)

  const migrateToLatestDataviewInstance = useCallback(
    async (dataviewInstance: DataviewInstance | UrlDataviewInstance) => {
      const dataviewId = LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.slug!] || dataviewInstance.slug
      let dataview = allDataviews.find((d) => d.slug === dataviewId)
      if (dataviewId && !dataview) {
        setIsLoading(true)
        dataview = await dispatch(fetchDataviewByIdThunk(dataviewId)).unwrap()
      }
      let datasets: Dataset[] = dataview?.datasets || []
      if (dataview && !datasets.length) {
        const datasetIds = getDatasetsInDataviews([dataview])
        if (datasetIds.length > 0) {
          datasets = await dispatch(
            fetchDatasetsByIdsThunk({ ids: datasetIds, onlyUserDatasets: false })
          ).unwrap()
        }
      }
      const hasDatasets =
        dataviewInstance.config?.datasets && dataviewInstance.config?.datasets?.length > 0
      const filters = Object.keys(dataviewInstance.config?.filters || {}).reduce(
        (acc, key) => {
          const allowed = isDataviewSchemaSupported(
            { ...dataview, datasets } as SchemaFieldDataview,
            key as SupportedDatasetSchema
          )
          if (allowed) {
            acc[key] = dataviewInstance.config?.filters?.[key]
          }
          return acc
        },
        {} as NonNullable<DataviewConfig['filters']>
      )
      const dataviewInstances = [
        {
          id: `${dataviewId}${LAYER_LIBRARY_ID_SEPARATOR}${Date.now()}`,
          dataviewId: dataviewId,
          config: {
            ...(hasDatasets && {
              datasets: dataviewInstance.config?.datasets?.map((d) => deprecatedDatasets[d] || d),
            }),
            filters,
          },
        },
        {
          id: dataviewInstance.id,
          config: {
            visible: false,
          },
        },
      ]
      upsertDataviewInstance(dataviewInstances)
      setIsLoading(false)
    },
    [allDataviews, deprecatedDatasets, dispatch, upsertDataviewInstance]
  )

  const getIsDataviewMigrated = useCallback(
    (dataviewInstance: DataviewInstance | UrlDataviewInstance) => {
      const dataviewId = LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.slug!] || dataviewInstance.slug

      if (!LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.slug!]) {
        return true
      }

      const migratedInstanceExists = workspaceDataviewInstances?.some(
        (instance) => instance.dataviewId === dataviewId
      )

      return !!migratedInstanceExists
    },
    [workspaceDataviewInstances]
  )

  const onMigrateDataviewClick = useCallback(
    (dataviewInstance: DataviewInstance | UrlDataviewInstance) => {
      const alreadyMigratedDataview = getIsDataviewMigrated(dataviewInstance)
      if (alreadyMigratedDataview) {
        deleteDataviewInstance(dataviewInstance.id)
      } else {
        migrateToLatestDataviewInstance(dataviewInstance)
      }
    },
    [deleteDataviewInstance, getIsDataviewMigrated, migrateToLatestDataviewInstance]
  )

  return useMemo(
    () => ({
      isLoading,
      getIsDataviewMigrated,
      onMigrateDataviewClick,
    }),
    [getIsDataviewMigrated, isLoading, onMigrateDataviewClick]
  )
}
