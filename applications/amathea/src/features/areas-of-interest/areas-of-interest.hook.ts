import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectAll, fetchAOIThunk } from './areas-of-interest.slice'
import { getCurrentAOI } from './areas-of-interest.selectors'

export const useAOIConnect = () => {
  const dispatch = useDispatch()
  const aoiList = useSelector(selectAll)
  const currentAOI = useSelector(getCurrentAOI)
  const fetchAOI = useCallback(() => {
    dispatch(fetchAOIThunk())
  }, [dispatch])
  return { aoiList, currentAOI, fetchAOI }
}
