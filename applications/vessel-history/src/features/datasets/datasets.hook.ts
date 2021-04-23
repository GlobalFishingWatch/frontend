// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { Dataset, DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types/dist'
import { AsyncError } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  fetchDatasetByIdThunk,
  fetchLastestCarrierDatasetThunk,
  selectCarrierLatestDataset,
  selectCarrierLatestDatasetStatus,
  selectDatasetCategory,
  selectEditingDatasetId,
  setDatasetCategory,
  setEditingDatasetId,
} from './datasets.slice'

const DATASET_REFRESH_TIMEOUT = 10000

export const useDatasetModalConnect = () => {
  const dispatch = useDispatch()
  const datasetCategory = useSelector(selectDatasetCategory)
  const editingDatasetId = useSelector(selectEditingDatasetId)

  const dispatchDatasetCategory = useCallback(
    (datasetCategory: DatasetCategory) => {
      dispatch(setDatasetCategory(datasetCategory))
    },
    [dispatch]
  )

  const dispatchEditingDatasetId = useCallback(
    (id: string) => {
      dispatch(setEditingDatasetId(id))
    },
    [dispatch]
  )

  return {
    datasetCategory,
    dispatchDatasetCategory,
    editingDatasetId,
    dispatchEditingDatasetId,
  }
}

export const useDatasetsAPI = () => {
  const dispatch = useAppDispatch()

  const dispatchFetchDataset = useCallback(
    async (id: string): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const action = await dispatch(fetchDatasetByIdThunk(id))
      if (fetchDatasetByIdThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload as AsyncError }
      }
    },
    [dispatch]
  )

  return {
    dispatchFetchDataset,
  }
}

export const useCarrierLatestConnect = () => {
  const dispatch = useAppDispatch()
  const carrierLatest = useSelector(selectCarrierLatestDataset)
  const carrierLatestStatus = useSelector(selectCarrierLatestDatasetStatus)

  const dispatchFetchLatestCarrier = useCallback(async (): Promise<{
    payload?: Dataset
    error?: AsyncError
  }> => {
    const action = await dispatch(fetchLastestCarrierDatasetThunk())
    if (fetchLastestCarrierDatasetThunk.fulfilled.match(action)) {
      return { payload: action.payload }
    } else {
      return { error: action.payload as AsyncError }
    }
  }, [dispatch])

  return {
    carrierLatest,
    carrierLatestStatus,
    dispatchFetchLatestCarrier,
  }
}

export const useAutoRefreshImportingDataset = (dataset?: Dataset) => {
  const { dispatchFetchDataset } = useDatasetsAPI()
  useEffect(() => {
    let timeOut: any
    if (dataset && dataset.status === DatasetStatus.Importing) {
      timeOut = setTimeout(() => {
        dispatchFetchDataset(dataset.id)
      }, DATASET_REFRESH_TIMEOUT)
    }
    return () => {
      if (timeOut) {
        clearTimeout(timeOut)
      }
    }
  }, [dataset, dispatchFetchDataset])
}
