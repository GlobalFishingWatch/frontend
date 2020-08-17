import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  selectAllAOI,
  fetchAOIThunk,
  deleteAOIThunk,
  selectAOIStatus,
  selectAOIStatusId,
} from './areas-of-interest.slice'
import { getCurrentAOI } from './areas-of-interest.selectors'

export const useAOIConnect = () => {
  const aoiStatus = useSelector(selectAOIStatus)
  const aoiStatusId = useSelector(selectAOIStatusId)
  const aoiList = useSelector(selectAllAOI)
  const currentAOI = useSelector(getCurrentAOI)
  return { aoiStatus, aoiStatusId, aoiList, currentAOI }
}

export const useAOIAPI = () => {
  const dispatch = useDispatch()

  const fetchAOI = useCallback(() => {
    dispatch(fetchAOIThunk())
  }, [dispatch])

  const deleteAOI = useCallback(
    (id: number) => {
      dispatch(deleteAOIThunk(id))
    },
    [dispatch]
  )
  return { fetchAOI, deleteAOI }
}
