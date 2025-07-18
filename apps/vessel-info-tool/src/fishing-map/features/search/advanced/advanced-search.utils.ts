import type { Dataset } from '@globalfishingwatch/api-types'

import type { SchemaFieldDataview } from 'features/datasets/datasets.utils'
import { isFieldInFieldsAllowed } from 'features/datasets/datasets.utils'
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
): SchemaFieldDataview => {
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

const DEFAULT_SEARCH_FIELDS_NEEDED = ['shipname', 'mmsi', 'imo', 'callsign']
export const isDatasetSearchFieldNeededSupported = (
  dataset: Dataset,
  fields = DEFAULT_SEARCH_FIELDS_NEEDED
) => {
  const isSupported = fields.some((field) =>
    isFieldInFieldsAllowed({ field, fieldsAllowed: dataset.fieldsAllowed })
  )
  return isSupported
}
