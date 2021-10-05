import { template } from 'lodash'
import { stringify } from 'qs'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import {
  Dataview,
  Resource,
  DataviewInstance,
  ResourceResponseType,
  Dataset,
} from '@globalfishingwatch/api-types'
import resolveDataviews from './resolve-dataviews'

const BASE_URL = '/v1/dataviews'

export type DataviewsClientFetch = typeof GFWAPI.fetch
export default class DataviewsClient {
  _fetch: DataviewsClientFetch

  constructor(_fetch?: DataviewsClientFetch) {
    const defaultFetch: DataviewsClientFetch = (url, init) => {
      return GFWAPI.fetch(url, init)
    }
    this._fetch = _fetch || defaultFetch
  }

  getDataviews(id?: number): Promise<Dataview[]> {
    const baseUrl = id ? `${BASE_URL}/${id}` : BASE_URL
    const paramsUrl = stringify({
      include: 'datasets,datasets.endpoints',
    })
    const url = [baseUrl, paramsUrl].join('?')
    const fetchDataviews = this._fetch<Dataview[]>(url)

    return fetchDataviews
  }

  _writeDataview(dataview: Dataview, method: 'POST' | 'PATCH' | 'DELETE'): Promise<Dataview> {
    const whitelistedDataview = {
      name: dataview.name,
      datasets: dataview.datasets?.length ? dataview.datasets?.map(({ id }) => ({ id })) : [],
      description: dataview.description,
      config: dataview.config,
      datasetsConfig: dataview.datasetsConfig,
    }
    const baseUrl = method === 'POST' ? BASE_URL : `${BASE_URL}/${dataview.id}`
    const fetchOptions: FetchOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      method,
    }
    if (method !== 'DELETE') {
      fetchOptions.body = whitelistedDataview as any
    }
    const write = this._fetch<Dataview>(baseUrl, fetchOptions)
    return write
  }

  updateDataview(dataview: Dataview, savedOnce: boolean): Promise<Dataview> {
    return this._writeDataview(dataview, savedOnce ? 'PATCH' : 'POST')
  }

  deleteDataview(dataview: Dataview): Promise<Dataview> {
    return this._writeDataview(dataview, 'DELETE')
  }

  // TODO support for a list of already downloaded resources
  // TODO uniq by URL
  getResources(
    workspaceDataviewInstances: DataviewInstance[],
    dataviews: Dataview[],
    datasets: Dataset[]
  ): { resources: Resource[]; promises: Promise<Resource>[] } {
    const resources: Resource[] = []
    const resolvedDataviews = resolveDataviews(workspaceDataviewInstances, dataviews, datasets)
    if (resolvedDataviews) {
      resolvedDataviews.forEach((dataview) => {
        const { datasetsConfig } = dataview
        dataview.datasets?.forEach((dataset) => {
          const datasetParams = datasetsConfig?.find(
            (datasetConfig) => datasetConfig.datasetId === dataset.id
          )
          if (datasetParams) {
            const endpointParamType = datasetParams?.endpoint

            dataset.endpoints
              ?.filter((endpoint) => endpoint.downloadable && endpoint.id === endpointParamType)
              .forEach((endpoint) => {
                // TODO: include query params here too
                const pathTemplateCompiled = template(endpoint.pathTemplate, {
                  interpolate: /{{([\s\S]+?)}}/g,
                })
                let resolvedUrl: string
                // template compilation will fail if template needs an override an and override has not been defined
                try {
                  resolvedUrl = pathTemplateCompiled(datasetParams?.params)
                  if (datasetParams?.query?.length) {
                    resolvedUrl += `?${stringify(datasetParams?.query)}`
                  }
                  const binaryQuery = datasetParams?.query?.find((query) => query.id === 'binary')
                  const formatQuery = datasetParams?.query?.find((query) => query.id === 'format')
                  resources.push({
                    dataset,
                    dataviewId: dataview.id,
                    responseType:
                      binaryQuery?.value === true
                        ? dataset.type?.includes('track') && formatQuery?.value === 'valueArray'
                          ? 'vessel'
                          : 'arrayBuffer'
                        : 'json',
                    url: resolvedUrl,
                    datasetConfig: datasetParams,
                  })
                } catch (e: any) {
                  console.error(
                    'Could not use pathTemplate, maybe a datasetParam endpoint config is missing?'
                  )
                  console.error('dataview:', dataview.id, dataview.name)
                  console.error('pathTemplate:', endpoint.pathTemplate)
                  console.error('datasetParams:', datasetParams)
                }
              })
          } else {
            console.error('Could not find datasetParams')
            console.error('datasetParams:', datasetParams)
          }
        })
      })
    }
    const promises = resources.map((resource) => {
      // TODO Do appropriate stuff when datasetParams have valuesArray or binary (tracks)
      // See existing implementation of this in Track inspector's dataviews thunk:
      // https://github.com/GlobalFishingWatch/track-inspector/blob/develop/src/features/dataviews/dataviews.thunks.ts#L58
      return this._fetch(resource.url, {
        responseType: resource.responseType as ResourceResponseType,
      }).then((data: unknown) => {
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
