// import { bindActionCreators } from 'redux'
import { useCallback } from 'react'
import { AsyncError } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { OfflineVessel } from 'types/vessel'
import {
  CreateOfflineVessel,
  createOfflineVesselThunk,
  deleteOfflineVesselThunk,
  fetchOfflineVesselByIdThunk,
  fetchOfflineVesselsThunk,
  updateOfflineVesselThunk,
} from './offline-vessels.slice'

export const useOfflineVesselsAPI = () => {
  const dispatch = useAppDispatch()

  const dispatchFetchOfflineVessels = useCallback(async (): Promise<{
    payload?: OfflineVessel[]
    error?: AsyncError
  }> => {
    const action = await dispatch(fetchOfflineVesselsThunk([]))
    if (fetchOfflineVesselsThunk.fulfilled.match(action)) {
      return { payload: action.payload }
    } else {
      return { error: action.payload }
    }
  }, [dispatch])

  const dispatchFetchOfflineVessel = useCallback(
    async (id: string): Promise<{ payload?: OfflineVessel; error?: AsyncError }> => {
      const action = await dispatch(fetchOfflineVesselByIdThunk(id))
      if (fetchOfflineVesselByIdThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload }
      }
    },
    [dispatch]
  )

  const dispatchCreateOfflineVessel = useCallback(
    async (
      createOfflineVessel: CreateOfflineVessel
    ): Promise<{ payload?: OfflineVessel; error?: AsyncError }> => {
      const action = await dispatch(createOfflineVesselThunk(createOfflineVessel))
      if (createOfflineVesselThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload }
      }
    },
    [dispatch]
  )

  const dispatchUpdateOfflineVessel = useCallback(
    async (
      updatedOfflineVessel: OfflineVessel
    ): Promise<{ payload?: OfflineVessel; error?: AsyncError }> => {
      const action = await dispatch(updateOfflineVesselThunk(updatedOfflineVessel))
      if (updateOfflineVesselThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload }
      }
    },
    [dispatch]
  )

  const dispatchDeleteOfflineVessel = useCallback(
    (id: string) => {
      dispatch(deleteOfflineVesselThunk(id))
    },
    [dispatch]
  )

  return {
    dispatchFetchOfflineVessels,
    dispatchFetchOfflineVessel,
    dispatchCreateOfflineVessel,
    dispatchUpdateOfflineVessel,
    dispatchDeleteOfflineVessel,
  }
}
