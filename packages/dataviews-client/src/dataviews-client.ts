import uniq from 'lodash/uniq'
import template from 'lodash/template'

import { DataviewWorkspace, Dataview, Dataset } from './types'

const DOWNLOADABLE_ENDPOINTS_TYPES = ['track', 'info', 'events']

export default class DataviewsClient {
  _dataviews = new Map<string, DataviewWorkspace>()
  _library = new Map<string, DataviewWorkspace>()
  _endpointsLoaded = new Map<string, boolean>()
  _fetch: any

  constructor(_fetch: any, library?: DataviewWorkspace[]) {
    this._fetch = _fetch

    // if dataview library is provided, convert it to a Map
    if (library) {
      this._library = new Map<string, DataviewWorkspace>(
        library.map((dataview) => [dataview.id, dataview])
      )
    }
  }

  // Loads data for all current and visible dataviews
  // Returns an array of promises, depending on
  // - dv loading status (cant load data on a unresolved dv)
  // - dv visibility
  // - dv endpoints vs a whitelist of downloadable endpoints (ie tracks, info, but not tiles)
  loadData(): Promise<any>[] {
    // for each existing dataview
    const promises: Promise<any>[] = []
    this._dataviews.forEach((dataviewWorkspace: DataviewWorkspace) => {
      const dataview = dataviewWorkspace.dataview as Dataview
      // skip dataview if override sets it to false
      if (dataviewWorkspace.overrides.visible === false) {
        return
      }
      dataview.datasets?.forEach((dataset: Dataset) => {
        dataset.endpoints
          ?.filter((endpoint) => DOWNLOADABLE_ENDPOINTS_TYPES.includes(endpoint.type))
          .forEach((endpoint) => {
            const urlTemplateCompiled = template(endpoint.urlTemplate, {
              interpolate: /{{([\s\S]+?)}}/g,
            })
            let resolvedUrl: string

            // template compilation will fail if template needs an override an and override has not been defined
            try {
              resolvedUrl = urlTemplateCompiled(dataviewWorkspace.datasetParams)

              // skip loading endpoint if it has been previously done
              if (this._endpointsLoaded.get(resolvedUrl) === true) return

              const promise = this._fetch(resolvedUrl).then((response: Response) => {
                this._endpointsLoaded.set(resolvedUrl, true)
                return { response, dataviewWorkspace, endpoint, dataset }
              })
              promises.push(promise)
            } catch (e) {
              console.error('Could not use urlTemplate, maybe a datasetParam is missing?')
              console.error('dataview id:', dataviewWorkspace.id)
              console.error('urlTemplate:', endpoint.urlTemplate)
              console.error('overrides:', dataviewWorkspace.overrides)
            }
          })
      })
    })
    return promises
  }

  // Loads dataview/dataset info
  // Returns null if nothing changed
  // Else returns a promise that returns an array of resolved dataviews
  load(inputDataviews_: string | any[]): null | Promise<any> {
    // transform string dvs if needed
    //
    // for each existing dataview
    //    if dataview not anymore in input dataviews
    //      remove from existing dataviews, mark dvs as changed
    //
    // for each input dataview
    //    if dv was already existing
    //      check delta with previous overrides, if delta is true:
    //        mark dvs as changed
    //        update dv overrides / aka merge dv config with overrides
    //    else
    //      if exist in defaultDataviewsLibrary, and use config
    //      else
    //           add to to-be-loaded endpoints
    //
    // check changed state of each DV
    //    if nothing has to be loaded AND nothing has changed, return null
    //       thunk will need to not dispatch an action
    //    if nothing has to be loaded, resolve promise instantly with resolved dvs
    let inputDataviews: any[] = inputDataviews_ as any[]
    if (!Array.isArray(inputDataviews_)) {
      try {
        inputDataviews = JSON.parse(inputDataviews_ as string)
      } catch (e) {
        console.error('Could not parse URL workspace')
      }
    }

    const inputDataviewsDict = new Map<string, DataviewWorkspace>(
      inputDataviews.map((inputDataview) => [inputDataview.id, inputDataview])
    )

    let hasUpdates = false
    const loadDataviewsForIds: string[] = []
    let loadDatasetsForIds: string[] = []

    this._dataviews.forEach((dataview, id) => {
      if (!inputDataviewsDict.has(id)) {
        hasUpdates = true
        this._dataviews.delete(id)
      }
    })

    inputDataviewsDict.forEach((inputDataview, id) => {
      if (this._dataviews.has(id)) {
        // TODO update whn overrides update
        // const overrides = getOverrideUpdates(this._dataviews.get(id)?.overrides, inputDataview.overrides)
        // if (overrides) {
        //   this._dataviews.get(id)!.overrides = overrides
        //   hasUpdates = true
        // }
      } else {
        hasUpdates = true
        let libraryParams: DataviewWorkspace = { id: '' }
        if (this._library.has(id)) {
          libraryParams = { ...this._library.get(id) } as DataviewWorkspace
        }

        const ids = [id]
        const datasetParamsId =
          (libraryParams.datasetParams || {}).id || (inputDataview.datasetParams || {}).id
        if (datasetParamsId) {
          ids.push(datasetParamsId)
        }
        const uid = ids.join('_')

        const newDataview: DataviewWorkspace = {
          ...libraryParams,
          ...inputDataview,
          id: uid,
          overrides: {
            ...(libraryParams.overrides || {}),
            ...(inputDataview.overrides || {}),
          },
          datasetParams: {
            ...(libraryParams.datasetParams || {}),
            ...(inputDataview.datasetParams || {}),
          },
        }

        // no config -> load whole dataview
        if (!newDataview.dataview?.config) {
          loadDataviewsForIds.push(id)
          // no dataset --> only load dataset
        } else if (!newDataview.dataview?.datasets && newDataview.dataview.datasetsIds) {
          loadDatasetsForIds = loadDatasetsForIds.concat(newDataview.dataview.datasetsIds)
        }

        loadDatasetsForIds = uniq(loadDatasetsForIds as any)

        this._dataviews.set(id, newDataview)
      }
    })

    if (!hasUpdates) return null

    const promises = []

    if (loadDataviewsForIds.length) {
      const dataviewsUrl = `/dataviews?ids=${loadDataviewsForIds.join(',')}`
      console.log(dataviewsUrl)
      const fetchDataviews = this._fetch(dataviewsUrl)
        .then((response: Response) => response.json())
        .then((data: any) => {
          console.log('data from /dataviews')
          // TODO hydrate this._dataviews + use overrides for dataviews (visual stuff)
          console.log(data)
          const resolvedDataviews: Dataview[] = data as Dataview[]
          this._dataviews.forEach((dataviewWorkspace: DataviewWorkspace) => {
            const resolvedDataview = resolvedDataviews.find(
              (dataview) => dataview.id === dataviewWorkspace.id
            )
            dataviewWorkspace.dataview = {
              ...dataviewWorkspace.dataview,
              ...resolvedDataview,
            } as Dataview
          })
        })
      promises.push(fetchDataviews)
    }

    if (loadDatasetsForIds.length) {
      const datasetsUrl = `/datasets?ids=${loadDatasetsForIds.join(',')}`
      const fetchdatasets = this._fetch(datasetsUrl)
        .then((response: Response) => response.json())
        .then((data: any) => {
          const datasets = data as Dataset[]
          // populate each dataview with matching datasets
          this._dataviews.forEach((dataviewWorkspace: DataviewWorkspace) => {
            const dataview = dataviewWorkspace.dataview as Dataview
            dataview.datasets = []
            datasets.forEach((dataset) => {
              if (dataview.datasetsIds?.includes(dataset.id)) {
                dataview.datasets?.push({ ...dataset })
              }
            })
          })
        })
      promises.push(fetchdatasets)
    }

    return Promise.all(promises).then(() => {
      const resolvedDataviews: Dataview[] = Array.from(this._dataviews).map((item) => {
        const dataviewWorkspace = item[1]
        return dataviewWorkspace
      })
      return resolvedDataviews
    })
  }
}
