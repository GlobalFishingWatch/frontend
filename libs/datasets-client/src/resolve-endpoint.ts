import { camelCase } from 'es-toolkit'

import { GFWAPI } from '@globalfishingwatch/api-client'
import type { Dataset, DataviewDatasetConfig } from '@globalfishingwatch/api-types'

import { getEndpointsByDatasetType } from './endpoints'

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
  const datasetConfigParams = [...(datasetConfig.params ?? [])]
  const datasetConfigQuery = [...(datasetConfig.query ?? [])]
  const endpointDatasetParams = endpoint.params.find(
    (param) => param.id === 'dataset' || param.id === 'datasets'
  )
  const endpointDatasetQuery = endpoint.query.find(
    (query) => query.id === 'dataset' || query.id === 'datasets'
  )

  url = url.replace('{{x}}', '{x}').replace('{{y}}', '{y}').replace('{{z}}', '{z}')

  const hasDatasetConfigDatasetParm =
    datasetConfig.params?.some((param) => param.id === 'dataset' || param.id === 'datasets') ||
    datasetConfig.query?.some((query) => query.id === 'dataset' || query.id === 'datasets')
  // This avoids duplicating query in every config when we already have the datasetId
  if (
    (endpointDatasetParams || endpointDatasetQuery) &&
    !hasDatasetConfigDatasetParm &&
    datasetConfig.datasetId
  ) {
    const endpointDatasetConfig = endpointDatasetParams
      ? endpointDatasetParams
      : endpointDatasetQuery!
    const endpointDatasetParam = {
      id: endpointDatasetConfig.id,
      value: endpointDatasetConfig.array ? [datasetConfig.datasetId] : datasetConfig.datasetId,
    }
    if (endpointDatasetParams) {
      datasetConfigParams.push(endpointDatasetParam)
    } else {
      datasetConfigQuery.push(endpointDatasetParam)
    }
  }

  if (datasetConfigParams?.length) {
    datasetConfigParams?.forEach((param) => {
      const datasetConfigurationId = camelCase(param.id) as keyof typeof dataset.configuration
      const value = param.value ?? dataset.configuration?.[datasetConfigurationId]
      url = url.replace(`{{${param.id}}}`, value as string)
    })
  }

  if (datasetConfigQuery?.length) {
    const resolvedQuery = new URLSearchParams()
    datasetConfigQuery.forEach((query) => {
      const endpointQuery = endpoint.query.find((q) => q.id === query.id)
      if (endpointQuery?.array === true || Array.isArray(query.value)) {
        const queryArray = Array.isArray(query.value)
          ? (query.value as string[])
          : [query.value as string]

        queryArray.forEach((queryArrItem, i) => {
          const queryArrId = `${query.id}[${i}]`
          resolvedQuery.set(queryArrId, queryArrItem)
        })
      } else {
        resolvedQuery.set(query.id, query.value.toString())
      }
    })

    const query = resolvedQuery.toString()
    url = query ? `${url}?${query}` : url
  }

  return GFWAPI.generateUrl(decodeURI(url) as string, { absolute })
}
