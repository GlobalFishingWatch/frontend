import { camelCase } from 'es-toolkit'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type {
  Dataset,
  DataviewDatasetConfig,
  EndpointParamType,
} from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'

import { getEndpointsByDatasetType } from './endpoints'

const arrayQueryParams: EndpointParamType[] = ['sql']

// Generates an URL by interpolating a dataset endpoint template with a dataview datasetConfig
export const resolveEndpoint = (
  dataset: Dataset,
  datasetConfig = {} as DataviewDatasetConfig,
  { absolute = false } = {} as { absolute: boolean }
) => {
  // TODO:DR (dataset-refactor) decide if we keep using dataset.endpoints or we use the new getEndpointByType()
  const endpoints = dataset.endpoints ?? getEndpointsByDatasetType({ type: dataset.type })
  const endpoint = endpoints?.find((endpoint) => {
    return endpoint.id === datasetConfig.endpoint
  })

  if (!endpoint) {
    console.error(
      `Endpoint not found for dataset ${dataset.type} and endpoint ${datasetConfig.endpoint}`
    )
    return null
  }

  let url = endpoint.pathTemplate
  datasetConfig.params?.forEach((param) => {
    const datasetConfigurationId = camelCase(param.id) as keyof typeof dataset.configuration
    const value = param.value ?? dataset.configuration?.[datasetConfigurationId]
    url = url.replace(`{{${param.id}}}`, value as string)
  })

  url = url.replace('{{x}}', '{x}').replace('{{y}}', '{y}').replace('{{z}}', '{z}')

  if (datasetConfig.query) {
    const resolvedQuery = new URLSearchParams()
    datasetConfig.query.forEach((query) => {
      const endpointQuery = endpoint.query.find((q) => q.id === query.id)
      if (
        endpointQuery &&
        (endpointQuery.array === true || arrayQueryParams.includes(endpointQuery.type))
      ) {
        const queryArray = Array.isArray(query.value)
          ? (query.value as string[])
          : [query.value as string]

        queryArray.forEach((queryArrItem, i) => {
          const queryArrId = `${query.id}[${i}]`
          resolvedQuery.set(queryArrId, queryArrItem)
        })
      } else {
        if (Array.isArray(query.value)) {
          query.value.forEach((queryArrItem, i) => {
            const queryArrId = `${query.id}[${i}]`
            resolvedQuery.set(queryArrId, queryArrItem as string)
          })
        } else {
          resolvedQuery.set(query.id, query.value.toString())
        }
      }
    })
    // To avoid duplicating query in every config when we already have the datasetId
    if (
      endpoint.query.some((q) => q.id === 'datasets') &&
      !resolvedQuery.toString().includes('datasets') &&
      datasetConfig.datasetId
    ) {
      resolvedQuery.set('datasets[0]', datasetConfig.datasetId)
    } else if (
      // Also check v3 new single dataset param
      endpoint.query.some((q) => q.id === 'dataset') &&
      !resolvedQuery.toString().includes('dataset') &&
      datasetConfig.datasetId
    ) {
      resolvedQuery.set('dataset', datasetConfig.datasetId)
    }
    url = `${url}?${resolvedQuery.toString()}`
  } else if (dataset.type !== DatasetTypes.Fourwings) {
    if (endpoint.query.some((q) => q.id === 'dataset')) {
      // Fallback when no dataset query is defined but we already know which dataset want to search in
      url = `${url}?dataset=${dataset.id}`
    } else if (endpoint.query.some((q) => q.id === 'datasets')) {
      // Fallback when no dataset query is defined but we already know which datasets want to search in
      url = `${url}?datasets=${dataset.id}`
    }
  }

  return GFWAPI.generateUrl(decodeURI(url) as string, { absolute })
}
