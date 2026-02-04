import type { AdvancedSearchQueryFieldKey } from '@globalfishingwatch/api-client'
import type { Dataset } from '@globalfishingwatch/api-types'
import {
  getDatasetFiltersAllowed,
  isFilterInFiltersAllowed,
} from '@globalfishingwatch/datasets-client'

import type { DataviewWithFilters } from 'features/dataviews/dataviews.filters'
import type { VesselSearchState } from 'features/search/search.types'

export const ADVANCED_SEARCH_FIELDS = ['ssvid', 'imo', 'callsign', 'owner'] as const

export const schemaFilterIds: (keyof VesselSearchState)[] = [
  'flag',
  'fleet',
  'origin',
  'shiptypes',
  'geartypes',
  'codMarinha',
  'targetSpecies',
  'nationalId',
]

export const getSearchDataview = (
  datasets: Dataset[],
  searchFilters: VesselSearchState,
  sources?: string[]
): DataviewWithFilters => {
  return {
    config: {
      datasets: sources?.length ? sources?.map((id) => id) : datasets.map((d) => d.id),
      filters: Object.fromEntries(
        schemaFilterIds.map((id) => {
          const filters = searchFilters[id]
          if (Array.isArray(filters)) {
            return [id, filters?.map((f) => f)]
          }
          return [id, filters]
        })
      ),
    },
    datasets,
  }
}

const DEFAULT_SEARCH_FIELDS_NEEDED: AdvancedSearchQueryFieldKey[] = [
  'shipname',
  'mmsi',
  'imo',
  'callsign',
]
export const isDatasetSearchFieldNeededSupported = (
  dataset: Dataset,
  fields = DEFAULT_SEARCH_FIELDS_NEEDED
) => {
  const fieldsAllowed = getDatasetFiltersAllowed(dataset)
  const isSupported = fields.some((filter) =>
    isFilterInFiltersAllowed({ filter, filtersAllowed: fieldsAllowed })
  )
  return isSupported
}
