import template from 'lodash/template'
import { stringify } from 'qs'
import { FetchOptions } from '@globalfishingwatch/api-client'
import { Dataview, WorkspaceDataview, Resource } from './types'

const BASE_URL = '/dataviews'

type PostDataview = Omit<Dataview, 'id'>

export default class DataviewsClient {
  _fetch: (input: string, init?: FetchOptions) => Promise<Response>

  constructor(_fetch: (input: string, init?: FetchOptions) => Promise<Response>) {
    this._fetch = _fetch
  }

  getDataviews(ids: string[] = []): Promise<Dataview[]> {
    const baseUrl = ids.length ? `${BASE_URL}/${ids.join(',')}` : BASE_URL
    const params = {
      include: 'dataset,dataset.endpoints',
    }
    const paramsUrl = stringify(params)
    const url = [baseUrl, paramsUrl].join('?')

    const fetchDataviews = this._fetch(url, {
      json: false,
    })
      .then((response: Response) => response.json())
      .then((data: unknown) => {
        return data as Dataview[]
      })

    return fetchDataviews
  }

  _writeDataview(dataview: Dataview, method: 'POST' | 'PATCH' | 'DELETE'): Promise<Dataview> {
    const whitelistedDataview: PostDataview = {
      name: dataview.name,
      description: dataview.description,
      defaultView: dataview.defaultView,
      defaultDatasetsParams: dataview.defaultDatasetsParams,
    }
    const baseUrl = method === 'POST' ? BASE_URL : `${BASE_URL}/${dataview.id}`
    const fetchOptions: FetchOptions = {
      headers: {
        'Content-Type': 'application/json',
      } as any,
      method,
    }
    if (method !== 'DELETE') {
      fetchOptions.body = whitelistedDataview as any
    }
    const write = this._fetch(baseUrl, fetchOptions).then((data: unknown) => {
      return data as Dataview
    })
    return write
  }

  updateDataview(dataview: Dataview, savedOnce: boolean): Promise<Dataview> {
    return this._writeDataview(dataview, savedOnce ? 'PATCH' : 'POST')
  }

  deleteDataview(dataview: Dataview): Promise<Dataview> {
    return this._writeDataview(dataview, 'DELETE')
  }

  getResources(
    dataviews: Dataview[],
    workspaceDataviews: WorkspaceDataview[] = []
  ): { resources: Resource[]; promises: Promise<Resource>[] } {
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
    const promises = resources.map((resource) => {
      // TODO Do appropriate stuff when datasetParams have valuesArray or binary (tracks)
      // See existing implementation of this in Track inspector's dataviews thunk:
      // https://github.com/GlobalFishingWatch/track-inspector/blob/develop/src/features/dataviews/dataviews.thunks.ts#L58
      return this._fetch(resource.resolvedUrl).then((data: unknown) => {
        const resourceWithData = {
          ...resource,
          data,
        }
        return resourceWithData
      })
    })
    return { resources, promises }
  }
}
