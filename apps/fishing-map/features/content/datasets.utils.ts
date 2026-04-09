// migrated from https://github.com/GlobalFishingWatch/crowdin-datasets-internationalization

import { stringify } from 'qs'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { APIPagination, Dataset, DatasetFilters } from '@globalfishingwatch/api-types'
import { removeDatasetVersion } from '@globalfishingwatch/datasets-client'

import { DEFAULT_PAGINATION_PARAMS } from 'data/config'
import { sdk } from 'features/content/strapi-sdk'
import { Locale } from 'types'

type ParsedSchemaValue = { keyword: string; enum?: Record<string, string> }
type ParsedSchema = Record<string, ParsedSchemaValue>

interface ParsedDataset {
  dataset_id: string
  name: string
  description: string
  schema?: ParsedSchema
}

const strapiDatasets = sdk.collection('datasets')

async function fetchAllStrapiDatasets(): Promise<any[]> {
  const pageSize = 50
  let page = 1
  const allData: any[] = []

  while (true) {
    const response = await strapiDatasets.find({
      fields: ['dataset_id'],
      pagination: { page, pageSize },
    })
    allData.push(...response.data)
    if (response.data.length < pageSize) break
    page++
  }

  return allData
}

async function filterDatasets(datasets: Dataset[]): Promise<Dataset[]> {
  const existing = await fetchAllStrapiDatasets()

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.configuration?.frontend?.translate === true &&
      !existing.some((d: any) => d.dataset_id === removeDatasetVersion(dataset.id))
  )
  return filteredDatasets
}
function normalizeFilterId(id: string): string {
  const parts = id.split('.')
  return parts.length > 1 ? parts[1] : id
}

const filtersToIgnore: string[] = [
  'flag',
  'vessel-groups',
  'id',
  'vessel_id',
  'next_port_id',
  'transmissionDateFrom',
  'transmissionDateTo',
  'shipname',
  'nShipname',
  'callsign',
  'geartype',
  'geartypes',
  'shiptypes',
  'registryInfo.geartypes',
  'registryInfo.shiptypes',
  'combinedSourcesInfo.shiptypes.name',
  'combinedSourcesInfo.geartypes.name',
  'selfReportedInfo.geartype',
  'selfReportedInfo.shiptype',
  'selfReportedInfo.geartype.name',
  'selfReportedInfo.shiptype.name',
  'selfReportedInfo.flag',
  'selfReportedInfo.id',
  'selfReportedInfo.transmissionDateFrom',
  'selfReportedInfo.transmissionDateTo',
  'selfReportedInfo.callsign',
  'selfReportedInfo.nShipname',
  'selfReportedInfo.shipname',
]

function parseFilters(filters: DatasetFilters | undefined): ParsedSchema {
  if (!filters || typeof filters !== 'object') {
    return {}
  }

  const schemaParsed: ParsedSchema = {}
  Object.values(filters)
    .flat()
    .forEach((filter) => {
      const { id, enum: enumValues = [] } = filter
      if (filter.enabled !== false && !filtersToIgnore.includes(id)) {
        schemaParsed[id] = {
          keyword: normalizeFilterId(id),
        }
        if (enumValues.length > 0) {
          schemaParsed[id].enum = Object.fromEntries(enumValues.map((v) => [String(v), String(v)]))
        }
      }
    })

  return Object.fromEntries(Object.entries(schemaParsed).sort(([a], [b]) => a.localeCompare(b)))
}

function parseDatasets(datasets: Dataset[]): ParsedDataset[] {
  return datasets.map((dataset) => {
    const { id, name, description, filters } = dataset
    const idWithoutVersion = removeDatasetVersion(id)
    const datasetParsed: ParsedDataset = {
      dataset_id: idWithoutVersion,
      name,
      description,
    }
    const parsedFilters = parseFilters(filters)
    if (Object.keys(parsedFilters).length > 0) {
      datasetParsed.schema = parsedFilters
    }
    return datasetParsed
  })
}

function sortDatasetsById(datasets: Dataset[]): Dataset[] {
  return [...datasets].sort((a, b) => a.id.localeCompare(b.id))
}

export async function internationalizeDatasets(): Promise<void> {
  const datasetsParams = {
    cache: false,
    ...DEFAULT_PAGINATION_PARAMS,
  }
  const initialDatasetsResponse = await GFWAPI.fetch<Response>(
    `/datasets?${stringify(datasetsParams, { arrayFormat: 'comma' })}`,
    { responseType: 'default' }
  )
  const initialDatasets = (await initialDatasetsResponse.json()) as APIPagination<Dataset>

  const datasetsFiltered = await filterDatasets(initialDatasets.entries)
  const datasetsSorted = sortDatasetsById(datasetsFiltered)
  const datasetsParsed = parseDatasets(datasetsSorted)
  for (const dataset of datasetsParsed) {
    try {
      const newDataset = await strapiDatasets.create(dataset)
      for (const locale of Object.values(Locale)) {
        // skipping english locale as it's the default one in Strapi
        if (locale !== 'en') {
          await strapiDatasets.update(newDataset.data.documentId, dataset, { locale: locale })
        }
      }
    } catch (error) {
      console.error(`Failed to create dataset ${dataset.dataset_id}:`, error)
    }
  }
}
