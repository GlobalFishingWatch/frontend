import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import orderBy from 'lodash/orderBy'
import uniqBy from 'lodash/uniqBy'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { AppState } from 'types/redux.types'
import { APIDataset } from 'types/api/models'
import { DATASET_ID, fetchAPI } from 'data/api'
import { getDataset } from 'redux-modules/router/route.selectors'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { NOT_FOUND_ERROR } from 'data/constants'
import {
  getDatasetData,
  getDatasetLoading,
  getConfigLoading,
  getConfigData,
  getDatasetError,
  getConfigError,
} from './app.selectors'
import {
  fetchDatasetInit,
  fetchDatasetComplete,
  fetchDatasetError,
  fetchConfigInit,
  fetchConfigComplete,
  fetchConfigError,
} from './app.actions'

export const datasetThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const loading = getDatasetLoading(state)
  const dataset = getDatasetData(state)
  const datasetId = getDataset(state)
  const error = getDatasetError(state)

  if (!loading && !error && dataset === null) {
    try {
      dispatch(fetchDatasetInit())
      const url = `/datasets/${datasetId || DATASET_ID}`
      const dataset = await fetchAPI<APIDataset>(url, dispatch)
      if (dataset) {
        dispatch(fetchDatasetComplete({ dataset }))
        dispatch(updateQueryParams({ dataset: dataset.id }))
        // if (datasetId !== dataset.id) {
        // TODO: add UI button to update the dataset version when outdated
        // }
      } else {
        dispatch(fetchDatasetError({ error: NOT_FOUND_ERROR }))
      }
    } catch (e) {
      const error = (e.status = 404 ? NOT_FOUND_ERROR : e.message)
      dispatch(fetchDatasetError({ error }))
    }
  }
}

export const configThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const loading = getConfigLoading(state)
  const config = getConfigData(state)
  const errorConfig = getConfigError(state)
  const dataset = getDatasetData(state)
  // Don't request config until dataset data is fetched
  if (!loading && dataset !== null && !errorConfig && config === null) {
    dispatch(fetchConfigInit())
    try {
      const config = await fetchAPI(`/datasets/${dataset.id}/config`, dispatch)
      if (config.ports) {
        Object.keys(config.ports).forEach((portKey: string) => {
          config.ports[portKey] = orderBy(uniqBy(config.ports[portKey], 'id'), 'label')
        })
      }
      const keysLabelOrder = ['flagStates', 'rfmos', 'eezs']
      keysLabelOrder.forEach((key) => {
        config[key] = orderBy(config[key], 'label')
      })
      dispatch(fetchConfigComplete({ config }))
    } catch (e) {
      dispatch(fetchConfigError({ error: e.msg || 'Error fetching config' }))
    }
  }
}
