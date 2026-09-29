import type {
  Dataset,
  DatasetFilter,
  DatasetFilters,
  DatasetTypes,
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

// Vessel identity datasets expose some filters under a different id than the one used in the app
const FILTER_ID_ALIASES: Partial<Record<SupportedDatasetFilter, string>> = {
  owner: 'registryOwners.name',
  shiptypes: 'combinedSourcesInfo.shiptypes.name',
  geartypes: 'combinedSourcesInfo.geartypes.name',
}

// Candidate ids for a filter, most specific first
const getDatasetFilterIds = (
  filter: SupportedDatasetFilter,
  infoSource?: VesselIdentitySourceEnum
): string[] => {
  return [
    infoSource ? `${infoSource}.${filter}` : undefined,
    FILTER_ID_ALIASES[filter],
    filter,
  ].filter((id): id is string => id !== undefined)
}

export const getDatasetFilterItem = <T extends DatasetTypes = DatasetTypes>(
  dataset: Dataset<T>,
  filter: SupportedDatasetFilter,
  infoSource?: VesselIdentitySourceEnum
): DatasetFilter | null => {
  if (!dataset?.filters) {
    return null
  }
  const filters = getFlattenDatasetFilters(dataset.filters)
  for (const id of getDatasetFilterIds(filter, infoSource)) {
    const filterItem = filters.find((f) => f.id === id)
    if (filterItem) {
      return filterItem
    }
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
  const filterIds = getDatasetFilterIds(filter, infoSource)
  return filtersAllowed?.some((f) => f.includes(filter) || filterIds.includes(f))
}

export const datasetHasFilterAllowed = (dataset: Dataset, filter: SupportedDatasetFilter) => {
  return isFilterInFiltersAllowed({
    filter,
    filtersAllowed: getDatasetFiltersAllowed(dataset),
  })
}
