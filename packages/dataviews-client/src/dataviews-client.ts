import uniq from 'lodash/uniq'
import template from 'lodash/template'
import { Dataview, WorkspaceDataview, Resource } from './types'

export default class DataviewsClient {
  _fetch: (url: string) => Promise<Response>

  constructor(_fetch: (url: string) => Promise<Response>) {
    this._fetch = _fetch
  }

  getDataviews(
    ids: string[] = [],
    workspaceDataviews: WorkspaceDataview[] = []
  ): Promise<Dataview[]> {
    const dataviewsUrl = ids.length ? `/dataviews/${ids.join(',')}` : '/dataviews/'
    const fetchDataviews = this._fetch(dataviewsUrl)
      .then((response: Response) => response.json())
      .then((data: unknown) => {
        return data as Dataview[]
      })

    return fetchDataviews
  }

  // addDataview(dataview: Dataview): Promise<Dataview> {}

  // updateDataview(dataview: Dataview): Promise<Dataview> {}

  getResources(
    dataviews: Dataview[],
    workspaceDataviews: WorkspaceDataview[] = []
  ) /*: Promise<Resource>[]*/ {
    const resources: Resource[] = []
    dataviews.forEach((dataview) => {
      const workspaceDataview = workspaceDataviews.find(
        (workspaceDataview) => workspaceDataview.id === dataview.id
      )
      const datasetsParams = workspaceDataview ? workspaceDataview.datasetsParams : []
      dataview.datasets?.forEach((dataset, datasetIndex) => {
        const defaultDatasetParams = dataview.defaultDatasetsParams
          ? dataview.defaultDatasetsParams[datasetIndex]
          : {}
        const datasetParams = datasetsParams?.length ? datasetsParams[datasetIndex] : {}

        dataset.endpoints
          ?.filter((endpoint) => endpoint.downloadable)
          .forEach((endpoint) => {
            const urlTemplateCompiled = template(endpoint.urlTemplate, {
              interpolate: /{{([\s\S]+?)}}/g,
            })
            let resolvedUrl: string

            const resolvedDatasetParams = {
              dataset: dataset.id,
              ...defaultDatasetParams,
              ...datasetParams,
            }

            // template compilation will fail if template needs an override an and override has not been defined
            try {
              resolvedUrl = urlTemplateCompiled(resolvedDatasetParams)
              resources.push({
                dataviewId: dataview.id,
                datasetId: dataset.id,
                resolvedUrl,
                mainDatasetParamId:
                  (datasetParams.id as string) || (defaultDatasetParams.id as string),
              })
            } catch (e) {
              console.error('Could not use urlTemplate, maybe a datasetParam is missing?')
              console.error('dataview:', dataview.id, dataview.name)
              console.error('urlTemplate:', endpoint.urlTemplate)
              console.error('defaultDatasetParams:', defaultDatasetParams)
              console.error('datasetParams:', datasetParams)
              console.error('resolvedDatasetParams:', resolvedDatasetParams)
            }
          })
      })
    })
    console.log(resources)
  }
}
