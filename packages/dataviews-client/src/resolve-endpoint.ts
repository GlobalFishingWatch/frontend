import { Dataset, DataviewDatasetConfig } from './types'

// Generates an URL by interpolating a dataset endpoint template with a dataview datasetConfig
export default (dataset: Dataset, datasetConfig: DataviewDatasetConfig) => {
  const endpoint = dataset.endpoints?.find((endpoint) => endpoint.id === datasetConfig.endpoint)

  if (!endpoint) return null

  const template = endpoint.pathTemplate

  let url = template
  datasetConfig.params.forEach((param) => {
    url = url.replace(`{{${param.id}}}`, param.value as string)
  })

  if (datasetConfig.query) {
    const resolvedQuery = new URLSearchParams()
    datasetConfig.query.forEach((query) => {
      // if (query)
      const endpointQuery = endpoint.query.find((q) => q.id === query.id)
      if (endpointQuery && endpointQuery.type === '4wings-datasets') {
        ;(query.value as string[]).forEach((queryArrItem, i) => {
          const queryArrId = `${query.id}[${i}]`
          resolvedQuery.set(queryArrId, queryArrItem)
        })
      } else {
        resolvedQuery.set(query.id, query.value.toString())
      }
    })
    url = `${url}?${resolvedQuery.toString()}`
  }

  return url
}
