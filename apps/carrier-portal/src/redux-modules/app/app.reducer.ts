import { createReducer } from 'typesafe-actions'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import uniqBy from 'lodash/uniqBy'
import { SearchTypes } from 'types/app.types'
import { PortalConfig, APIDataset } from 'types/api/models'
import { LATEST_SEARCH_STORAGE_KEY } from 'data/constants'
import {
  setMapDownloadVisible,
  setMapDimensions,
  fetchDatasetInit,
  fetchDatasetComplete,
  fetchDatasetError,
  fetchConfigInit,
  fetchConfigComplete,
  fetchConfigError,
  saveLatestSearchs,
  setSidebarSize,
} from './app.actions'

export interface LatestSearch {
  type: SearchTypes
  items: {
    id: string
    label: string
  }[]
}

export interface MapDimensions {
  width: number
  height: number
}

interface EventsReducer {
  map: { dimensions: MapDimensions | null; mapDownloadVisible: boolean }
  sidebarSize: number
  config: PortalConfig | null
  dataset: APIDataset | null
  loadingConfig: boolean
  loadingDataset: boolean
  errorConfig: string
  errorDataset: string
  latestSearchs: LatestSearch[]
}

export const initialState: EventsReducer = {
  map: { dimensions: null, mapDownloadVisible: false },
  sidebarSize: 0,
  config: null,
  dataset: null,
  loadingDataset: false,
  loadingConfig: false,
  errorConfig: '',
  errorDataset: '',
  latestSearchs: JSON.parse(localStorage.getItem(LATEST_SEARCH_STORAGE_KEY) || 'null'),
}

export default createReducer(initialState)
  .handleAction(setMapDimensions, (state, action) => {
    const map = { ...state.map, dimensions: action.payload }
    return { ...state, map }
  })
  .handleAction(setSidebarSize, (state, action) => {
    return { ...state, sidebarSize: action.payload }
  })
  .handleAction(setMapDownloadVisible, (state, action) => {
    const map = { ...state.map, mapDownloadVisible: action.payload }
    return { ...state, map }
  })
  .handleAction(fetchDatasetInit, (state) => {
    return { ...state, loadingDataset: true }
  })
  .handleAction(fetchDatasetComplete, (state, action) => {
    return { ...state, loadingDataset: false, dataset: action.payload.dataset }
  })
  .handleAction(fetchDatasetError, (state, action) => {
    return { ...state, loadingDataset: false, errorDataset: action.payload.error }
  })
  .handleAction(fetchConfigInit, (state) => {
    return { ...state, loadingConfig: true }
  })
  .handleAction(fetchConfigComplete, (state, action) => {
    return { ...state, loadingConfig: false, config: action.payload.config }
  })
  .handleAction(fetchConfigError, (state, action) => {
    return { ...state, loadingConfig: false, errorConfig: action.payload.error }
  })
  .handleAction(saveLatestSearchs, (state, action) => {
    const allSearchs = groupBy(action.payload.concat(state.latestSearchs || []), 'type')
    const latestSearchs = Object.keys(allSearchs).map((type: any) => {
      const allItems = flatMap(allSearchs[type].map((s) => s.items))
      return {
        type,
        items: uniqBy(allItems, 'id').slice(0, 5),
      }
    })

    localStorage.setItem(LATEST_SEARCH_STORAGE_KEY, JSON.stringify(latestSearchs || []))

    return { ...state, latestSearchs }
  })
