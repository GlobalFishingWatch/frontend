import { useCallback } from 'react'
import { AsyncError } from 'utils/async-slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { OfflineVesselActivity } from 'types/activity'
import {
  CreateOfflineVesselActivity,
  createOfflineVesselActivityThunk,
  deleteOfflineVesselActivityThunk,
  fetchOfflineVesselActivityByIdThunk,
  //fetchOfflineVesselsActivityThunk,
  updateOfflineVesselActivityThunk,
} from './offline-vessels-activity.slice'

export const useOfflineVesselsActivityAPI = () => {
  const dispatch = useAppDispatch()

  /*const dispatchFetchOfflineVesselsActivity = useCallback(async (): Promise<{
    payload?: OfflineVesselActivity
    error?: AsyncError
  }> => {
    const action = await dispatch(fetchOfflineVesselsActivityThunk([]))
    if (fetchOfflineVesselsActivityThunk.fulfilled.match(action)) {
      return { payload: action.payload }
    } else {
      return { error: action.payload }
    }
  }, [dispatch])*/

  const dispatchFetchOfflineVesselActivity = useCallback(
    async (id: string): Promise<{ payload?: OfflineVesselActivity; error?: AsyncError }> => {
      const action = await dispatch(fetchOfflineVesselActivityByIdThunk(id))
      if (fetchOfflineVesselActivityByIdThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload }
      }
    },
    [dispatch]
  )

  const dispatchCreateOfflineVesselActivity = useCallback(
    async (
      createOfflineVesselActivity: CreateOfflineVesselActivity
    ): Promise<{ payload?: OfflineVesselActivity; error?: AsyncError }> => {
      const action = await dispatch(createOfflineVesselActivityThunk(createOfflineVesselActivity))
      if (createOfflineVesselActivityThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload }
      }
    },
    [dispatch]
  )

  const dispatchUpdateOfflineVesselActivity = useCallback(
    async (
      updatedOfflineVessel: OfflineVesselActivity
    ): Promise<{ payload?: OfflineVesselActivity; error?: AsyncError }> => {
      const action = await dispatch(updateOfflineVesselActivityThunk(updatedOfflineVessel))
      if (updateOfflineVesselActivityThunk.fulfilled.match(action)) {
        return { payload: action.payload }
      } else {
        return { error: action.payload }
      }
    },
    [dispatch]
  )

  const dispatchDeleteOfflineVesselActivity = useCallback(
    (id: string) => {
      dispatch(deleteOfflineVesselActivityThunk(id))
    },
    [dispatch]
  )

  return {
    //dispatchFetchOfflineVesselsActivity,
    dispatchFetchOfflineVesselActivity,
    dispatchCreateOfflineVesselActivity,
    dispatchUpdateOfflineVesselActivity,
    dispatchDeleteOfflineVesselActivity,
  }
}
