import { API_VERSION,GFWAPI } from '@globalfishingwatch/api-client'
import type {
  Dataset,
  DataviewDatasetConfig,
  EndpointParamType} from '@globalfishingwatch/api-types';
import {
  DatasetTypes
} from '@globalfishingwatch/api-types'

const arrayQueryParams: EndpointParamType[] = ['4wings-datasets', 'sql']
// Generates an URL by interpolating a dataset endpoint template with a dataview datasetConfig

export const resolveEndpoint = (
  dataset: Dataset,
  datasetConfig = {} as DataviewDatasetConfig,
  { absolute = false } = {} as { absolute: boolean }
) => {
  const endpoint = dataset.endpoints?.find((endpoint) => {
    return endpoint.id === datasetConfig.endpoint
  })

  if (!endpoint) return null

  let url = endpoint.pathTemplate
  datasetConfig.params?.forEach((param) => {
    url = url.replace(`{{${param.id}}}`, param.value as string)
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

        // TODO check if we can remove this once map only uses v3 in dev and pro
        if (
          endpoint.id === 'list-vessels' &&
          endpointQuery.id === 'vessel-groups' &&
          API_VERSION === 'v2'
        ) {
          resolvedQuery.set(query.id, queryArray.join(','))
        } else {
          queryArray.forEach((queryArrItem, i) => {
            const queryArrId = `${query.id}[${i}]`
            resolvedQuery.set(queryArrId, queryArrItem)
          })
        }
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
      !resolvedQuery.toString().includes('dataset') &&
      datasetConfig.datasetId
    ) {
      const datasetString = API_VERSION === 'v2' ? 'datasets' : 'datasets[0]'
      resolvedQuery.set(datasetString, datasetConfig.datasetId)
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
