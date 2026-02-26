import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { LEGACY_TO_LATEST_DATAVIEWS } from 'data/dataviews'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectDeprecatedDatasets } from 'features/datasets/datasets.slice'
import { fetchDataviewsByIdsThunk, selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

export function useMigrateToLatestDataview() {
  const dispatch = useAppDispatch()
  const allDataviews = useSelector(selectAllDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)

  const migrateToLatestDataviewInstance = useCallback(
    (dataviewInstance: DataviewInstance | UrlDataviewInstance) => {
      const dataviewId = LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.slug!] || dataviewInstance.slug
      const newDataview = allDataviews.find((d) => d.slug === dataviewId)
      if (dataviewId && !newDataview) {
        dispatch(fetchDataviewsByIdsThunk([dataviewId]))
      }
      const hasDatasets =
        dataviewInstance.config?.datasets && dataviewInstance.config?.datasets?.length > 0
      const hasFilters =
        dataviewInstance.config?.filters && Object.keys(dataviewInstance.config?.filters).length > 0
      if (hasFilters) {
        console.log(
          'TODO: show a toast with the filters that are not supported and remove from the config'
        )
      }
      upsertDataviewInstance({
        id: `${dataviewId}${LAYER_LIBRARY_ID_SEPARATOR}${Date.now()}`,
        dataviewId: dataviewId,
        config: {
          ...(hasDatasets && {
            datasets: dataviewInstance.config?.datasets?.map((d) => deprecatedDatasets[d] || d),
          }),
          ...(hasFilters && {
            filters: dataviewInstance.config?.filters,
          }),
        },
      })
    },
    [allDataviews, deprecatedDatasets, dispatch, upsertDataviewInstance]
  )
  return useMemo(() => ({ migrateToLatestDataviewInstance }), [migrateToLatestDataviewInstance])
}
