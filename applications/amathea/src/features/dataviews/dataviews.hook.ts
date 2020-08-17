import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { Dataview } from '@globalfishingwatch/dataviews-client/dist/types'
import {
  selectAllDataviews,
  fetchDataviewsThunk,
  createDataviewThunk,
  deleteDataviewThunk,
  DataviewDraft,
  setDraftDataview as setDraftDataviewAction,
  resetDraftDataview as resetDraftDataviewAction,
  selectDraftDataview,
  updateDataviewThunk,
  selectDataviewStatus,
  selectDataviewStatusId,
} from './dataviews.slice'

export const useDraftDataviewConnect = () => {
  const dispatch = useDispatch()
  const draftDataview = useSelector(selectDraftDataview)
  const setDraftDataview = useCallback(
    (draftDataview: Partial<DataviewDraft>) => {
      dispatch(setDraftDataviewAction(draftDataview))
    },
    [dispatch]
  )
  const resetDraftDataview = useCallback(() => {
    dispatch(resetDraftDataviewAction(undefined))
  }, [dispatch])
  return { draftDataview, setDraftDataview, resetDraftDataview }
}

export const useDataviewsConnect = () => {
  const dataviewsStatus = useSelector(selectDataviewStatus)
  const dataviewsStatusId = useSelector(selectDataviewStatusId)
  const dataviewsList = useSelector(selectAllDataviews)
  return { dataviewsStatus, dataviewsStatusId, dataviewsList }
}

export const useDataviewsAPI = () => {
  const dispatch = useDispatch()

  const fetchDataviews = useCallback(() => {
    dispatch(fetchDataviewsThunk())
  }, [dispatch])
  const createDataview = useCallback(
    async (dataview: DataviewDraft): Promise<Dataview> => {
      const { payload }: any = await dispatch(createDataviewThunk(dataview))
      return payload
    },
    [dispatch]
  )
  const updateDataview = useCallback(
    async (dataview: DataviewDraft): Promise<Dataview> => {
      const { payload }: any = await dispatch(updateDataviewThunk(dataview))
      return payload
    },
    [dispatch]
  )
  const deleteDataview = useCallback(
    (id: number) => {
      dispatch(deleteDataviewThunk(id))
    },
    [dispatch]
  )
  return { fetchDataviews, createDataview, updateDataview, deleteDataview }
}
