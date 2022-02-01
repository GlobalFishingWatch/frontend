import { createAction } from 'typesafe-actions'
import { PortalConfig, APIDataset } from 'types/api/models'
import { LatestSearch, MapDimensions } from './app.reducer'

export const setMapDownloadVisible = createAction('SET_MAP_DOWNLOAD_VISIBLE')<boolean>()

export const setMapDimensions = createAction('SET_MAP_DIMENSIONS')<MapDimensions>()

export const setSidebarSize = createAction('SET_SIDEBAR_SIZE')<number>()

export const saveLatestSearchs = createAction('SAVE_LATEST_SEARCHS')<LatestSearch[]>()

export const fetchDatasetInit = createAction('FETCH_DATASET_INIT')()

export const fetchDatasetComplete = createAction('FETCH_DATASET_COMPLETE')<{
  dataset: APIDataset
}>()

export const fetchDatasetError = createAction('FETCH_DATASET_ERROR')<{
  error: string
}>()

export const fetchConfigInit = createAction('FETCH_CONFIG_INIT')()

export const fetchConfigComplete = createAction('FETCH_CONFIG_COMPLETE')<{
  config: PortalConfig
}>()

export const fetchConfigError = createAction('FETCH_CONFIG_ERROR')<{
  error: string
}>()

const appActions = {
  setMapDownloadVisible,
  setMapDimensions,
  setSidebarSize,
  saveLatestSearchs,
  fetchDatasetInit,
  fetchDatasetComplete,
  fetchDatasetError,
  fetchConfigInit,
  fetchConfigComplete,
  fetchConfigError,
}

export default appActions
