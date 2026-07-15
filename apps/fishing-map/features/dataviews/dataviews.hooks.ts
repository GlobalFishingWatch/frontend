import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEqual } from 'es-toolkit'

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
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

const normalizeDataviewFilters = (filters?: DataviewConfig['filters']) =>
  Object.entries(filters || {}).reduce(
    (acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Array.isArray(value) ? [...value].sort() : value
      }
      return acc
    },
    {} as NonNullable<DataviewConfig['filters']>
  )

const areDataviewFiltersEqual = (
  filtersA?: DataviewConfig['filters'],
  filtersB?: DataviewConfig['filters']
) => isEqual(normalizeDataviewFilters(filtersA), normalizeDataviewFilters(filtersB))

const areDataviewSourcesEqual = (sourcesA?: string[], sourcesB?: string[]) =>
  isEqual([...(sourcesA || [])].sort(), [...(sourcesB || [])].sort())

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
            fetchDatasetsByIdsThunk({ ids: datasetIds, fetchUserDatasetsMode: 'all' })
          ).unwrap()
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

      const migratedDatasets = dataviewInstance.config?.datasets?.map(
        (d) => deprecatedDatasets[d] || d
      )
      const migratedInstanceExists = workspaceDataviewInstances?.some(
        (instance) =>
          instance.dataviewId === dataviewId &&
          areDataviewSourcesEqual(instance.config?.datasets, migratedDatasets) &&
          areDataviewFiltersEqual(instance.config?.filters, dataviewInstance.config?.filters)
      )
      return !!migratedInstanceExists
    },
    [deprecatedDatasets, workspaceDataviewInstances]
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

  const migrateAllDataviewInstances = useCallback(async () => {
    setIsLoading(true)
    const migratableDataviewInstances = (deprecatedDataviewInstances || [])
      .filter(
        (dataviewInstance) =>
          LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.slug!] &&
          !MIGRATION_EXCLUDED_CATEGORIES.includes(dataviewInstance.category!)
      )
      .toReversed()
    const migrationTimestamp = Date.now()
    const dataviewInstances = (
      await Promise.all(
        migratableDataviewInstances.map((dataviewInstance, index) => {
          if (getIsDataviewMigrated(dataviewInstance)) {
            return [{ id: dataviewInstance.id, config: { visible: false } }]
          }
          return getMigratedDataviewInstances(dataviewInstance, migrationTimestamp + index)
        })
      )
    ).flat()
    if (dataviewInstances.length) {
      upsertDataviewInstance(dataviewInstances)
    }
    setIsLoading(false)
    return dataviewInstances
  }, [
    deprecatedDataviewInstances,
    getIsDataviewMigrated,
    getMigratedDataviewInstances,
    upsertDataviewInstance,
  ])

  return useMemo(
    () => ({
      isLoading,
      getIsDataviewMigrated,
      onMigrateDataviewClick,
      migrateAllDataviewInstances,
    }),
    [getIsDataviewMigrated, isLoading, migrateAllDataviewInstances, onMigrateDataviewClick]
  )
}
