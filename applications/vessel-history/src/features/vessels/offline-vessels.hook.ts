import { useCallback } from 'react'
import { event as uaEvent } from 'react-ga'
import { DateTime, Interval } from 'luxon'
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
    (offlineVessel: OfflineVessel, page: string) => {
      const now = DateTime.now()
      const savedOn = DateTime.fromISO(offlineVessel.savedOn);
      const i = Interval.fromDateTimes(savedOn, now);
      uaEvent({
        category: 'Offline Access',
        action: 'Remove saved vessel for offline view',
        label: JSON.stringify({ page }),
        value: Math.floor(i.length('days'))
      })
      dispatch(deleteOfflineVesselThunk(offlineVessel.profileId))
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
