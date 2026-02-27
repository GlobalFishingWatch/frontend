import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { Dataset, DataviewConfig, DataviewInstance } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { LEGACY_TO_LATEST_DATAVIEWS } from 'data/dataviews'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk, selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/datasets/datasets.utils'
import type { DataviewWithFilters } from 'features/dataviews/dataviews.filters'
import { isDataviewFilterSupported } from 'features/dataviews/dataviews.filters'
import { fetchDataviewByIdThunk, selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

export function useMigrateToLatestDataview() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const allDataviews = useSelector(selectAllDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)

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
          datasets = await dispatch(fetchDatasetsByIdsThunk({ ids: datasetIds })).unwrap()
        }
      }
      const hasDatasets =
        dataviewInstance.config?.datasets && dataviewInstance.config?.datasets?.length > 0
      const filters = Object.keys(dataviewInstance.config?.filters || {}).reduce(
        (acc, key) => {
          const allowed = isDataviewFilterSupported(
            { ...dataview, datasets } as DataviewWithFilters,
            key as SupportedDatasetFilter
          )
          if (allowed) {
            acc[key] = dataviewInstance.config?.filters?.[key]
          }
          return acc
        },
        {} as NonNullable<DataviewConfig['filters']>
      )
      upsertDataviewInstance({
        id: `${dataviewId}${LAYER_LIBRARY_ID_SEPARATOR}${Date.now()}`,
        dataviewId: dataviewId,
        config: {
          ...(hasDatasets && {
            datasets: dataviewInstance.config?.datasets?.map((d) => deprecatedDatasets[d] || d),
          }),
          filters,
        },
      })
      setIsLoading(false)
    },
    [allDataviews, deprecatedDatasets, dispatch, upsertDataviewInstance]
  )
  return useMemo(
    () => ({ migrateToLatestDataviewInstance, isLoading }),
    [migrateToLatestDataviewInstance, isLoading]
  )
}
