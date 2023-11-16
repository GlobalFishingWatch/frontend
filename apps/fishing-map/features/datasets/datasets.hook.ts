import { useSelector, batch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { Dataset, DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types'
import { AsyncError } from 'utils/async-slice'
import {
  getContextDataviewInstance,
  getEnvironmentDataviewInstance,
  getUserPointsDataviewInstance,
  getUserTrackDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import {
  CreateDataset,
  upsertDatasetThunk,
  DatasetModals,
  deleteDatasetThunk,
  fetchDatasetByIdThunk,
  fetchLastestCarrierDatasetThunk,
  selectCarrierLatestDataset,
  selectCarrierLatestDatasetStatus,
  selectDatasetModal,
  selectEditingDatasetId,
  setDatasetCategory,
  setDatasetModal,
  setEditingDatasetId,
  updateDatasetThunk,
} from './datasets.slice'

export interface NewDatasetProps {
  onSelect?: (dataset?: Dataset) => void
}

const DATASET_REFRESH_TIMEOUT = 10000

export const getDataviewInstanceByDataset = (dataset: Dataset) => {
  if (dataset.category === DatasetCategory.Context) {
    return dataset.configuration?.geometryType === 'points'
      ? getUserPointsDataviewInstance(dataset.id)
      : getContextDataviewInstance(dataset.id)
  } else if (dataset.category === DatasetCategory.Environment) {
    if (dataset.configuration?.geometryType === 'polygons') {
      return getEnvironmentDataviewInstance(dataset.id)
    } else if (dataset.configuration?.geometryType === 'tracks') {
      return getUserTrackDataviewInstance(dataset)
    }
  }
}

export const useAddDataviewFromDatasetToWorkspace = () => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const addDataviewFromDatasetToWorkspace = useCallback(
    (dataset: Dataset) => {
      const dataviewInstance = getDataviewInstanceByDataset(dataset)
      if (dataviewInstance) {
        upsertDataviewInstance(dataviewInstance)
      } else {
        console.warn(`Dataview instance was not instanciated correctly. With dataset ${dataset.id}`)
      }
    },
    [upsertDataviewInstance]
  )

  return { addDataviewFromDatasetToWorkspace }
}

export const useDatasetModalConnect = () => {
  const dispatch = useAppDispatch()
  const datasetModal = useSelector(selectDatasetModal)
  const editingDatasetId = useSelector(selectEditingDatasetId)

  const dispatchDatasetModal = useCallback(
    (datasetModal: DatasetModals) => {
      dispatch(setDatasetModal(datasetModal))
    },
    [dispatch]
  )

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
    datasetModal,
    dispatchDatasetModal,
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

  const dispatchUpsertDataset = useCallback(
    async (createDataset: CreateDataset): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const action = await dispatch(upsertDatasetThunk(createDataset))
      if (upsertDatasetThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload as AsyncError }
      }
    },
    [dispatch]
  )

  const dispatchUpdateDataset = useCallback(
    async (
      updatedDataset: Partial<Dataset>
    ): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const action = await dispatch(updateDatasetThunk(updatedDataset))
      if (updateDatasetThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload as AsyncError }
      }
    },
    [dispatch]
  )

  const dispatchDeleteDataset = useCallback(
    (id: string) => {
      dispatch(deleteDatasetThunk(id))
    },
    [dispatch]
  )

  return {
    dispatchFetchDataset,
    dispatchUpsertDataset,
    dispatchUpdateDataset,
    dispatchDeleteDataset,
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

export const useAutoRefreshImportingDataset = (
  dataset?: Dataset,
  refreshTimeout = DATASET_REFRESH_TIMEOUT
) => {
  const { dispatchFetchDataset } = useDatasetsAPI()
  useEffect(() => {
    let timeOut: any
    if (dataset && dataset.status === DatasetStatus.Importing) {
      timeOut = setTimeout(() => {
        dispatchFetchDataset(dataset.id)
      }, refreshTimeout)
    }
    return () => {
      if (timeOut) {
        clearTimeout(timeOut)
      }
    }
  }, [dataset, dispatchFetchDataset, refreshTimeout])
}

export const useAddDataset = ({ onSelect }: NewDatasetProps) => {
  const { dispatchDatasetModal } = useDatasetModalConnect()
  return () => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: 'Start uploading user dataset',
    })
    batch(() => {
      dispatchDatasetModal('new')
    })
    if (onSelect) {
      onSelect()
    }
  }
}
