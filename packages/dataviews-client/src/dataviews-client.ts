import template from 'lodash/template'
import { stringify } from 'qs'
import GFWAPI, { FetchOptions } from '@globalfishingwatch/api-client'
import { vessels } from '@globalfishingwatch/pbf/decoders/vessels'
import { Dataview, WorkspaceDataview, Resource, DatasetParams } from './types'
import { RESOURCE_TYPES_BY_VIEW_TYPE } from './config'
import resolveDataviews from './resolve-dataviews'

const BASE_URL = '/dataviews'

type PostDataview = Omit<Dataview, 'id'>
export type DataviewsClientFetch = typeof GFWAPI.fetch
export default class DataviewsClient {
  _fetch: DataviewsClientFetch

  constructor(_fetch?: DataviewsClientFetch) {
    const defaultFetch: DataviewsClientFetch = (url, init) => {
      return GFWAPI.fetch(url, init)
    }
    this._fetch = _fetch || defaultFetch
  }

  getDataviews(ids: number[] = []): Promise<Dataview[]> {
    const baseUrl = ids.length ? `${BASE_URL}/${ids.join(',')}` : BASE_URL
    const params = {
      include: 'dataset,dataset.endpoints',
    }
    const paramsUrl = stringify(params)
    const url = [baseUrl, paramsUrl].join('?')
    const fetchDataviews = this._fetch<Dataview[]>(url)

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
      },
      method,
    }
    if (method !== 'DELETE') {
      fetchOptions.body = whitelistedDataview
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
    dataviews: Dataview[],
    workspaceDataviews: WorkspaceDataview[] = []
  ): { resources: Resource[]; promises: Promise<Resource>[] } {
    const resources: Resource[] = []
    const resolvedDataviews = resolveDataviews(dataviews, workspaceDataviews)
    resolvedDataviews.forEach((dataview) => {
      const datasetsParams = dataview.datasetsParams
      const dataviewType = dataview.view?.type || dataview.defaultView?.type || ''

      dataview.datasets?.forEach((dataset, datasetIndex) => {
        const datasetParams = datasetsParams?.length ? datasetsParams[datasetIndex] : {}
        const endpointParamType = datasetParams.endpoint

        dataset.endpoints
          ?.filter((endpoint) => endpoint.downloadable && endpoint.type === endpointParamType)
          .filter((endpoint) => {
            const allowedEndpointTypes = RESOURCE_TYPES_BY_VIEW_TYPE[dataviewType]
            if (!allowedEndpointTypes || !allowedEndpointTypes.includes(endpoint.type)) return false
            return true
          })
          .forEach((endpoint) => {
            // TODO: include query params here too
            const pathTemplateCompiled = template(endpoint.pathTemplate, {
              interpolate: /{{([\s\S]+?)}}/g,
            })
            let resolvedUrl: string

            const resolvedDatasetParams: DatasetParams = {
              dataset: dataset.id,
              ...(datasetParams?.params as DatasetParams),
            }

            const resolvedDatasetQuery = stringify({
              ...(datasetParams?.query as DatasetParams),
            })

            // template compilation will fail if template needs an override an and override has not been defined
            try {
              resolvedUrl = pathTemplateCompiled(resolvedDatasetParams)
              if (resolvedDatasetQuery.length) {
                resolvedUrl += `?${resolvedDatasetQuery}`
              }
              resources.push({
                dataviewId: dataview.id,
                type: endpoint.type,
                datasetId: dataset.id,
                resolvedUrl,
                responseType: resolvedDatasetParams.binary
                  ? endpoint.type === 'track'
                    ? 'vessel'
                    : 'arrayBuffer'
                  : 'json',
                datasetParamId:
                  (datasetParams.id as string) || (resolvedDatasetParams.id as string),
              })
            } catch (e) {
              console.error('Could not use pathTemplate, maybe a datasetParam is missing?')
              console.error('dataview:', dataview.id, dataview.name)
              console.error('pathTemplate:', endpoint.pathTemplate)
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
      return this._fetch(resource.resolvedUrl, {
        responseType: resource.responseType,
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
