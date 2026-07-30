import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { isEqual } from 'es-toolkit'

import type {
  Dataset,
  Dataview,
  DataviewConfig,
  DataviewInstance,
} from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/map/config'
import { LEGACY_TO_LATEST_DATAVIEWS } from 'data/map/dataviews'
import { fetchDatasetsByIdsThunk, selectDeprecatedDatasets } from 'features/_map/datasets/datasets.slice'
import { getDatasetsInDataviews } from 'features/_map/datasets/datasets.utils'
import type { DataviewWithFilters } from 'features/_map/dataviews/dataviews.filters'
import { isDataviewFilterSupported } from 'features/_map/dataviews/dataviews.filters'
import { fetchDataviewByIdThunk, selectAllDataviews } from 'features/_map/dataviews/dataviews.slice'
import {
  selectDataviewInstancesResolvedVisible,
  selectDeprecatedDataviewInstances,
} from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { useDataviewInstancesConnect } from 'features/_map/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'

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

const getSupportedFilters = (
  filters: DataviewConfig['filters'] | undefined,
  dataview: DataviewWithFilters,
  datasets: Dataset[]
) =>
  Object.keys(filters || {}).reduce(
    (acc, key) => {
      const allowed = isDataviewFilterSupported(
        { ...dataview, datasets } as DataviewWithFilters,
        key as SupportedDatasetFilter
      )
      if (allowed) {
        acc[key] = filters?.[key]
      }
      return acc
    },
    {} as NonNullable<DataviewConfig['filters']>
  )

export const MIGRATION_EXCLUDED_CATEGORIES = [
  DataviewCategory.Vessels,
  DataviewCategory.VesselGroups,
]

export function useMigrateToLatestDataview() {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()
  const allDataviews = useSelector(selectAllDataviews)
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const deprecatedDatasets = useSelector(selectDeprecatedDatasets)
  const deprecatedDataviewInstances = useSelector(selectDeprecatedDataviewInstances)
  const workspaceDataviewInstances = useSelector(selectDataviewInstancesResolvedVisible)

  const getMigratedDataviewInstances = useCallback(
    async (
      dataviewInstance: DataviewInstance | UrlDataviewInstance,
      instanceIdSuffix = Date.now(),
      dataviewFetchCache?: Map<string, Promise<Dataview>>
    ): Promise<Partial<UrlDataviewInstance>[]> => {
      const dataviewId = LEGACY_TO_LATEST_DATAVIEWS[dataviewInstance.slug!] || dataviewInstance.slug
      let dataview = allDataviews.find((d) => d.slug === dataviewId)
      if (dataviewId && !dataview) {
        if (dataviewFetchCache?.has(dataviewId)) {
          dataview = await dataviewFetchCache.get(dataviewId)!
        } else {
          const fetchPromise = dispatch(fetchDataviewByIdThunk(dataviewId)).unwrap()
          dataviewFetchCache?.set(dataviewId, fetchPromise)
          dataview = await fetchPromise
        }
      }
      let datasets: Dataset[] = dataview?.datasets || []
      if (dataview && !datasets.length) {
        const datasetIds = getDatasetsInDataviews([dataview])
        if (datasetIds.length > 0) {
          datasets = await dispatch(
            fetchDatasetsByIdsThunk({ ids: datasetIds })
          ).unwrap()
        }
      }
      const hasDatasets =
        dataviewInstance.config?.datasets && dataviewInstance.config?.datasets?.length > 0
      const filters = getSupportedFilters(
        dataviewInstance.config?.filters,
        dataview as DataviewWithFilters,
        datasets
      )
      return [
        {
          id: `${dataviewId}${LAYER_LIBRARY_ID_SEPARATOR}${instanceIdSuffix}`,
          dataviewId: dataviewId,
          config: {
            ...(dataviewInstance.config?.color && { color: dataviewInstance.config.color }),
            ...(dataviewInstance.config?.colorRamp && {
              colorRamp: dataviewInstance.config.colorRamp,
            }),
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
    },
    [allDataviews, deprecatedDatasets, dispatch]
  )

  const migrateToLatestDataviewInstance = useCallback(
    async (dataviewInstance: DataviewInstance | UrlDataviewInstance) => {
      setIsLoading(true)
      const dataviewInstances = await getMigratedDataviewInstances(dataviewInstance)
      upsertDataviewInstance(dataviewInstances)
      setIsLoading(false)
    },
    [getMigratedDataviewInstances, upsertDataviewInstance]
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
      const targetDataview = allDataviews.find((d) => d.slug === dataviewId)
      const expectedFilters = targetDataview
        ? getSupportedFilters(
            dataviewInstance.config?.filters,
            targetDataview as DataviewWithFilters,
            targetDataview.datasets || []
          )
        : dataviewInstance.config?.filters
      const migratedInstanceExists = workspaceDataviewInstances?.some(
        (instance) =>
          instance.dataviewId === dataviewId &&
          areDataviewSourcesEqual(instance.config?.datasets, migratedDatasets) &&
          areDataviewFiltersEqual(instance.config?.filters, expectedFilters)
      )
      return !!migratedInstanceExists
    },
    [allDataviews, deprecatedDatasets, workspaceDataviewInstances]
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
    const dataviewFetchCache = new Map<string, Promise<Dataview>>()
    const dataviewInstances = (
      await Promise.all(
        migratableDataviewInstances.map((dataviewInstance, index) => {
          if (getIsDataviewMigrated(dataviewInstance)) {
            return [{ id: dataviewInstance.id, config: { visible: false } }]
          }
          return getMigratedDataviewInstances(
            dataviewInstance,
            migrationTimestamp + index,
            dataviewFetchCache
          )
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
