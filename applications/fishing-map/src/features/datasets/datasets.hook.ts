// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import { Dataset, DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types/dist'
import { AsyncError } from 'utils/async-slice'
import {
  selectContextAreasDataviews,
  selectEnvironmentalDataviews,
  selectActivityDataviews,
} from 'features/dataviews/dataviews.selectors'
import {
  getContextDataviewInstance,
  getEnvironmentDataviewInstance,
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

const DATASET_REFRESH_TIMEOUT = 10000

export const useNewDatasetConnect = () => {
  const contextDataviews = useSelector(selectContextAreasDataviews)
  const activityDataviews = useSelector(selectActivityDataviews)
  const enviromentalDataviews = useSelector(selectEnvironmentalDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const addNewDatasetToWorkspace = useCallback(
    (dataset: Dataset) => {
      let dataviewInstance
      debugger
      if (dataset.category === DatasetCategory.Context) {
        const usedColors = contextDataviews?.flatMap((dataview) => dataview.config?.color || [])
        dataviewInstance = getContextDataviewInstance(dataset.id, usedColors)
      } else if (
        dataset.category === DatasetCategory.Environment &&
        dataset.configuration?.geometryType === 'polygons'
      ) {
        const usedRamps = [...(enviromentalDataviews || []), ...(activityDataviews || [])].flatMap(
          (dataview) => dataview.config?.colorRamp || []
        )
        dataviewInstance = getEnvironmentDataviewInstance(dataset.id, usedRamps)
      } else if (
        dataset.category === DatasetCategory.Environment &&
        dataset.configuration?.geometryType === 'tracks'
      ) {
        dataviewInstance = getUserTrackDataviewInstance(dataset)
      }
      if (dataviewInstance) {
        upsertDataviewInstance(dataviewInstance)
      }
    },
    [contextDataviews, enviromentalDataviews, activityDataviews, upsertDataviewInstance]
  )

  return { addNewDatasetToWorkspace }
}

export const useDatasetModalConnect = () => {
  const dispatch = useDispatch()
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
        return { error: action.payload }
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
        return { error: action.payload }
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
        return { error: action.payload }
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
      return { error: action.payload }
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
