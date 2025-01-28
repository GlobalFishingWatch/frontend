import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetCategory, DatasetStatus } from '@globalfishingwatch/api-types'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import { FourwingsAggregationOperation } from '@globalfishingwatch/deck-layers'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  getBigQuery4WingsDataviewInstance,
  getBigQueryEventsDataviewInstance,
  getContextDataviewInstance,
  getUserPointsDataviewInstance,
  getUserPolygonsDataviewInstance,
  getUserTrackDataviewInstance,
} from 'features/dataviews/dataviews.utils'
import type { DatasetUploadConfig } from 'features/modals/modals.slice'
import {
  selectDatasetUploadModalConfig,
  selectDatasetUploadModalOpen,
  setDatasetUploadConfig,
  setModalOpen,
} from 'features/modals/modals.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import type { AsyncError } from 'utils/async-slice'

import type { UpsertDataset } from './datasets.slice'
import {
  deleteDatasetThunk,
  fetchDatasetByIdThunk,
  fetchLastestCarrierDatasetThunk,
  selectCarrierLatestDataset,
  selectCarrierLatestDatasetStatus,
  updateDatasetThunk,
  upsertDatasetThunk,
} from './datasets.slice'
import { getIsBQEditorDataset } from './datasets.utils'

interface NewDatasetProps {
  onSelect?: (dataset?: Dataset) => void
}

const DATASET_REFRESH_TIMEOUT = 10000

export const getDataviewInstanceByDataset = (dataset: Dataset) => {
  const isBQEditorLayer = getIsBQEditorDataset(dataset)
  if (isBQEditorLayer) {
    return dataset.category === DatasetCategory.Activity
      ? getBigQuery4WingsDataviewInstance(dataset.id, {
          aggregationOperation:
            (dataset.configuration?.aggregationOperation as FourwingsAggregationOperation) ||
            FourwingsAggregationOperation.Sum,
        })
      : getBigQueryEventsDataviewInstance(dataset.id)
  }
  const config = getDatasetConfiguration(dataset)
  if (config?.geometryType === 'points') {
    return getUserPointsDataviewInstance(dataset)
  } else if (config?.geometryType === 'polygons') {
    return getUserPolygonsDataviewInstance(dataset.id)
  } else if (config?.geometryType === 'tracks') {
    return getUserTrackDataviewInstance(dataset)
  }
  return getContextDataviewInstance(dataset.id)
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

  return useMemo(() => ({ addDataviewFromDatasetToWorkspace }), [addDataviewFromDatasetToWorkspace])
}

export const useDatasetModalOpenConnect = () => {
  const dispatch = useAppDispatch()
  const datasetModalOpen = useSelector(selectDatasetUploadModalOpen)

  const dispatchDatasetModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setModalOpen({ id: 'datasetUpload', open }))
    },
    [dispatch]
  )

  return useMemo(
    () => ({
      datasetModalOpen,
      dispatchDatasetModalOpen,
    }),
    [datasetModalOpen, dispatchDatasetModalOpen]
  )
}

export const useDatasetModalConfigConnect = () => {
  const dispatch = useAppDispatch()
  const datasetModal = useSelector(selectDatasetUploadModalConfig)

  const dispatchDatasetModalConfig = useCallback(
    (config: DatasetUploadConfig) => {
      dispatch(setDatasetUploadConfig(config))
    },
    [dispatch]
  )

  return useMemo(
    () => ({
      ...datasetModal,
      dispatchDatasetModalConfig,
    }),
    [datasetModal, dispatchDatasetModalConfig]
  )
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
    async (createDataset: UpsertDataset): Promise<{ payload?: Dataset; error?: AsyncError }> => {
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

  return useMemo(
    () => ({
      dispatchFetchDataset,
      dispatchUpsertDataset,
      dispatchUpdateDataset,
      dispatchDeleteDataset,
    }),
    [dispatchDeleteDataset, dispatchFetchDataset, dispatchUpdateDataset, dispatchUpsertDataset]
  )
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

  return useMemo(
    () => ({
      carrierLatest,
      carrierLatestStatus,
      dispatchFetchLatestCarrier,
    }),
    [carrierLatest, carrierLatestStatus, dispatchFetchLatestCarrier]
  )
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

export const useAddDataset = ({ onSelect } = {} as NewDatasetProps) => {
  const dispatch = useAppDispatch()
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()

  const onAddClick = useCallback(() => {
    trackEvent({
      category: TrackCategory.ReferenceLayer,
      action: 'Start uploading user dataset',
    })
    dispatchDatasetModalOpen(true)
    dispatch(setDatasetUploadConfig({ style: 'default' }))
    if (onSelect) {
      onSelect()
    }
  }, [dispatch, dispatchDatasetModalOpen, onSelect])

  return onAddClick
}
