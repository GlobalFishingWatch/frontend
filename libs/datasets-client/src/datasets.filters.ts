import {
  type Dataset,
  type DatasetFilter,
  type DatasetFilters,
  type DatasetTypes,
  PORT_SOURCES,
  PORT_SOURCES_FILTER_ID,
  type VesselIdentitySourceEnum,
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

const PORTS_DATASET_ID = 'public-global-ports'
const PORT_SOURCES_DATASET_FILTER: DatasetFilter = {
  id: PORT_SOURCES_FILTER_ID,
  label: PORT_SOURCES_FILTER_ID,
  type: 'string',
  enum: [...PORT_SOURCES],
  enabled: true,
}

// Dataset filters plus the virtual ones the app adds on top of the API config
const getDatasetFilters = (dataset: Pick<Dataset, 'id' | 'filters'>): DatasetFilter[] => {
  const filters = getFlattenDatasetFilters(dataset?.filters)
  return dataset?.id?.split(':')[0] === PORTS_DATASET_ID
    ? [...filters, PORT_SOURCES_DATASET_FILTER]
    : filters
}

export const getDatasetFiltersAllowed = (dataset: Dataset) => {
  return getDatasetFilters(dataset).flatMap((filter) => (filter.enabled ? filter.id : []))
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
  const filters = getDatasetFilters(dataset)
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
