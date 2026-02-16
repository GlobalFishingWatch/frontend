import type {
  Dataset,
  DatasetFilter,
  DatasetFilters,
  VesselIdentitySourceEnum,
} from '@globalfishingwatch/api-types'

import type { SupportedDatasetFilter } from './filters'

export const getFlattenDatasetFilters = (
  filters: DatasetFilters | null | undefined
): DatasetFilter[] => {
  if (!filters) return []

  return Object.values(filters).flatMap((typeFilters) => {
    return Array.isArray(typeFilters) ? typeFilters : []
  })
}

export const getDatasetFiltersAllowed = (dataset: Dataset) => {
  if (!dataset?.filters) {
    return []
  }
  const flattenFilters = getFlattenDatasetFilters(dataset.filters)
  return flattenFilters.flatMap((filter) => (filter.enabled ? filter.id : []))
}

export const getDatasetFilterItem = (
  dataset: Dataset,
  filter: SupportedDatasetFilter
): DatasetFilter | null => {
  const filters = getFlattenDatasetFilters(dataset.filters)
  const filterItem = filters.find((f) => f.id === filter)
  if (filterItem) {
    return filterItem
  }

  return null
}

export const datasetHasFilter = (dataset: Dataset, filter: SupportedDatasetFilter) => {
  if (filter === 'vessel-groups') {
    // returning true as the filter fields enum comes from the dynamic fetch list passed as props
    return true
  }
  if (filter === 'flag') {
    const fieldsAllowed = getDatasetFiltersAllowed(dataset)
    return fieldsAllowed.some((f) => f.includes(filter))
  }
  const filterConfig = getDatasetFilterItem(dataset, filter)
  if (!filterConfig) {
    return false
  }
  if (
    filterConfig.type === 'range' ||
    filterConfig.array === true ||
    filterConfig.type === 'boolean'
  ) {
    const filterEnum = filterConfig?.enum
    return filterEnum !== undefined && filterEnum.length > 0
  }
  return filterConfig.type === 'string' || filterConfig.type === 'number'
}

export const isFilterInFiltersAllowed = ({
  filter,
  filtersAllowed,
  infoSource,
}: {
  filter: SupportedDatasetFilter
  filtersAllowed: string[]
  infoSource?: VesselIdentitySourceEnum
}): boolean => {
  return filtersAllowed?.some((f) => {
    return (
      f === filter ||
      f.includes(filter) ||
      f === `${infoSource}.${filter}` ||
      (filter === 'owner' && f === 'registryOwners.name') ||
      (filter === 'shiptypes' && f === 'combinedSourcesInfo.shiptypes.name') ||
      (filter === 'geartypes' && f === 'combinedSourcesInfo.geartypes.name')
    )
  })
}

export const datasetHasFilterAllowed = (dataset: Dataset, filter: SupportedDatasetFilter) => {
  return isFilterInFiltersAllowed({
    filter,
    filtersAllowed: getDatasetFiltersAllowed(dataset),
  })
}
