import { Dataset } from '@globalfishingwatch/api-types'
import { SchemaFieldDataview } from 'features/datasets/datasets.utils'
import { VesselSearchState } from 'types'

export const schemaFilterIds: (keyof VesselSearchState)[] = [
  'flag',
  'fleet',
  'origin',
  'shiptypes',
  'geartypes',
  'codMarinha',
  'targetSpecies',
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
