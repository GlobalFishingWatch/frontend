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
      resolvedQuery.set(query.id, query.value.toString())
    })
    url = `${url}?${resolvedQuery.toString()}`
  }

  return url
}
