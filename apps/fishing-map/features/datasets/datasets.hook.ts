import { useSelector, batch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { event as uaEvent } from 'react-ga'
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
import {
  CreateDataset,
  createDatasetThunk,
  DatasetModals,
  deleteDatasetThunk,
  fetchDatasetByIdThunk,
  fetchLastestCarrierDatasetThunk,
  selectCarrierLatestDataset,
  selectCarrierLatestDatasetStatus,
  selectDatasetCategory,
  selectDatasetModal,
  selectEditingDatasetId,
  setDatasetCategory,
  setDatasetModal,
  setEditingDatasetId,
  updateDatasetThunk,
} from './datasets.slice'
import type { NewDatasetTooltipProps } from './NewDatasetTooltip'

const DATASET_REFRESH_TIMEOUT = 10000

export const useAddDataviewFromDatasetToWorkspace = () => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const addDataviewFromDatasetToWorkspace = useCallback(
    (dataset: Dataset) => {
      let dataviewInstance
      if (dataset.category === DatasetCategory.Context) {
        dataviewInstance =
          dataset.configuration?.geometryType === 'points'
            ? getUserPointsDataviewInstance(dataset.id)
            : getContextDataviewInstance(dataset.id)
      } else if (dataset.category === DatasetCategory.Environment) {
        if (dataset.configuration?.geometryType === 'polygons') {
          dataviewInstance = getEnvironmentDataviewInstance(dataset.id)
        } else if (dataset.configuration?.geometryType === 'tracks') {
          dataviewInstance = getUserTrackDataviewInstance(dataset)
        }
      }
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
  const datasetCategory = useSelector(selectDatasetCategory)
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
    datasetCategory,
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

  const dispatchCreateDataset = useCallback(
    async (createDataset: CreateDataset): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const action = await dispatch(createDatasetThunk(createDataset))
      if (createDatasetThunk.fulfilled.match(action)) {
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
    dispatchCreateDataset,
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

export const useAddDataset = ({ datasetCategory, onSelect }: NewDatasetTooltipProps) => {
  const { dispatchDatasetModal, dispatchDatasetCategory } = useDatasetModalConnect()
  return () => {
    if (datasetCategory === DatasetCategory.Context) {
      uaEvent({
        category: 'Reference layer',
        action: 'Start upload reference layer flow',
        label: datasetCategory,
      })
    }
    batch(() => {
      dispatchDatasetModal('new')
      dispatchDatasetCategory(datasetCategory)
    })
    if (onSelect) {
      onSelect()
    }
  }
}
