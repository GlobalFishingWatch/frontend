// import { bindActionCreators } from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataset, DatasetCategory } from '@globalfishingwatch/api-types/dist'
import { AsyncError } from 'utils/async-slice'
import {
  selectContextAreasDataviews,
  selectEnvironmentalDataviews,
  selectTemporalgridDataviews,
} from 'features/workspace/workspace.selectors'
import {
  getContextDataviewInstance,
  getEnvironmentDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import {
  CreateDataset,
  createDatasetThunk,
  DatasetModals,
  deleteDatasetThunk,
  fetchDatasetByIdThunk,
  selectDatasetCategory,
  selectDatasetModal,
  selectEditingDatasetId,
  setDatasetCategory,
  setDatasetModal,
  setEditingDatasetId,
  updateDatasetThunk,
} from './datasets.slice'

export const useNewDatasetConnect = () => {
  const contextDataviews = useSelector(selectContextAreasDataviews)
  const activityDataviews = useSelector(selectTemporalgridDataviews)
  const enviromentalDataviews = useSelector(selectEnvironmentalDataviews)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const addNewDatasetToWorkspace = useCallback(
    (dataset: Dataset) => {
      let dataviewInstance
      if (dataset.category === DatasetCategory.Context) {
        const usedColors = contextDataviews?.flatMap((dataview) => dataview.config?.color || [])
        dataviewInstance = getContextDataviewInstance(dataset.id, usedColors)
      } else {
        const usedRamps = [...(enviromentalDataviews || []), ...(activityDataviews || [])].flatMap(
          (dataview) => dataview.config?.colorRamp || []
        )
        dataviewInstance = getEnvironmentDataviewInstance(dataset.id, usedRamps)
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
  const dispatch = useDispatch()

  const dispatchFetchDataset = useCallback(
    async (id: string): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const { payload, error }: any = await dispatch(fetchDatasetByIdThunk(id))
      if (error) {
        return { error: payload }
      }
      return { payload }
    },
    [dispatch]
  )

  const dispatchCreateDataset = useCallback(
    async (createDataset: CreateDataset): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const { payload, error }: any = await dispatch(createDatasetThunk(createDataset))
      if (error) {
        return { error: payload }
      }
      return { payload }
    },
    [dispatch]
  )

  const dispatchUpdateDataset = useCallback(
    async (
      updatedDataset: Partial<Dataset>
    ): Promise<{ payload?: Dataset; error?: AsyncError }> => {
      const { payload, error }: any = await dispatch(updateDatasetThunk(updatedDataset))
      if (error) {
        return { error: payload }
      }
      return { payload }
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
