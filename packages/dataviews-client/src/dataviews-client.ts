import template from 'lodash/template'
import { stringify } from 'qs'
import { FetchOptions } from '@globalfishingwatch/api-client'
import { vessels } from '@globalfishingwatch/pbf/decoders/vessels'
import { Dataview, WorkspaceDataview, Resource } from './types'
import { RESOURCE_TYPES_BY_VIEW_TYPE } from './config'
import resolveDataviews from './resolve-dataviews'

const BASE_URL = '/dataviews'

type PostDataview = Omit<Dataview, 'id'>

export default class DataviewsClient {
  _fetch: (input: string, init?: FetchOptions) => Promise<Response>

  constructor(_fetch: (input: string, init?: FetchOptions) => Promise<Response>) {
    this._fetch = _fetch
  }

  getDataviews(ids: number[] = []): Promise<Dataview[]> {
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

        dataset.endpoints
          ?.filter((endpoint) => endpoint.downloadable)
          .filter((endpoint) => {
            const allowedEndpointTypes = RESOURCE_TYPES_BY_VIEW_TYPE[dataviewType]
            if (!allowedEndpointTypes || !allowedEndpointTypes.includes(endpoint.type)) return false
            return true
          })
          .forEach((endpoint) => {
            const urlTemplateCompiled = template(endpoint.urlTemplate, {
              interpolate: /{{([\s\S]+?)}}/g,
            })
            let resolvedUrl: string

            const resolvedDatasetParams = {
              dataset: dataset.id,
              ...datasetParams,
            }

            // template compilation will fail if template needs an override an and override has not been defined
            try {
              resolvedUrl = urlTemplateCompiled(resolvedDatasetParams)
              resources.push({
                dataviewId: dataview.id,
                type: endpoint.type,
                datasetId: dataset.id,
                resolvedUrl,
                datasetParamId: datasetParams.id as string,
              })
            } catch (e) {
              console.error('Could not use urlTemplate, maybe a datasetParam is missing?')
              console.error('dataview:', dataview.id, dataview.name)
              console.error('urlTemplate:', endpoint.urlTemplate)
              console.error('datasetParams:', datasetParams)
              console.error('resolvedDatasetParams:', resolvedDatasetParams)
            }
          })
      })
    })
    const promises = resources.map((resource) => {
      const promise = this._fetch(resource.resolvedUrl, { json: false })
      let thennable
      if (resource.type === 'track') {
        thennable = promise
          .then((r) => r.arrayBuffer())
          .then((buffer) => {
            const track = vessels.Track.decode(new Uint8Array(buffer))
            return track.data
          })
      } else {
        thennable = promise.then((response) => response.json())
      }

      return thennable.then((data: unknown) => {
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
