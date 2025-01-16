import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import db from 'offline/offline-store'
import type { RootState } from 'store'

import {
  parseAPIError,
  parseAPIErrorMessage,
  parseAPIErrorStatus,
} from '@globalfishingwatch/api-client'

import type { OfflineVessel } from 'types/vessel'
import type { AsyncError, AsyncReducer} from 'utils/async-slice';
import { asyncInitialState, createAsyncSlice } from 'utils/async-slice'

export interface OfflineVesselState extends AsyncReducer<OfflineVessel> {
  profileIds: (string | undefined)[]
}

const initialState: OfflineVesselState = {
  ...asyncInitialState,
  profileIds: [],
}

export type CreateOfflineVessel = { vessel: OfflineVessel }
export const createOfflineVesselThunk = createAsyncThunk<
  OfflineVessel,
  CreateOfflineVessel,
  {
    rejectValue: AsyncError
  }
>('offlineVessels/create', async ({ vessel }, { rejectWithValue }) => {
  try {
    db.vessels.add(vessel, vessel.profileId)
    return vessel
  } catch (e: any) {
    return rejectWithValue(parseAPIError(e))
  }
})

export const deleteOfflineVesselThunk = createAsyncThunk<
  OfflineVessel,
  string,
  {
    rejectValue: AsyncError
  }
>('offlineVessels/delete', async (profileId: string, { rejectWithValue }) => {
  try {
    const result = await db.vessels.get(profileId)
    if (result === undefined) {
      throw new Error('Vessel not found')
    }
    await db.vessels.delete(profileId)
    return { ...result }
  } catch (e: any) {
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${profileId} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

export const fetchOfflineVesselsThunk = createAsyncThunk<
  OfflineVessel[],
  string[],
  {
    rejectValue: AsyncError
  }
>('offlineVessels/fetch', async (profileIds: string[], { rejectWithValue, getState }) => {
  const existingIds = selectProfileIds(getState() as RootState) as string[]
  const uniqIds = Array.from(new Set([...profileIds, ...existingIds])).filter((id) => !!id)
  try {
    if (uniqIds.length) {
      return await db.vessels.where('profileId').anyOfIgnoreCase(uniqIds).toArray()
    } else {
      return await db.vessels.toArray()
    }
  } catch (e: any) {
    return rejectWithValue(parseAPIError(e))
  }
})

export const fetchOfflineVesselByIdThunk = createAsyncThunk<
  OfflineVessel,
  string,
  {
    rejectValue: AsyncError
  }
>('offlineVessels/fetchById', async (profileId: string, { rejectWithValue }) => {
  try {
    const result = await db.vessels.get(profileId)
    if (result === undefined) {
      throw new Error('Vessel not found')
    }
    return result
  } catch (e: any) {
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${profileId} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

export const updateOfflineVesselThunk = createAsyncThunk<
  OfflineVessel,
  OfflineVessel,
  {
    rejectValue: AsyncError
  }
>('offlineVessels/update', async (vessel: OfflineVessel, { rejectWithValue }) => {
  try {
    await db.vessels.put(vessel, vessel.profileId)
    return vessel
  } catch (e: any) {
    return rejectWithValue({
      status: parseAPIErrorStatus(e),
      message: `${vessel.profileId} - ${parseAPIErrorMessage(e)}`,
    })
  }
})

const { slice: vesselsSlice, entityAdapter } = createAsyncSlice<OfflineVesselState, OfflineVessel>({
  name: 'offlineVessels',
  initialState,
  thunks: {
    createThunk: createOfflineVesselThunk,
    deleteThunk: deleteOfflineVesselThunk,
    fetchThunk: fetchOfflineVesselsThunk,
    updateThunk: updateOfflineVesselThunk,
    fetchByIdThunk: fetchOfflineVesselByIdThunk,
  },
  createEntityAdapterOptions: {
    selectId: (vessel) => vessel.profileId,
  },
})

export const { selectById, selectAll, selectEntities, selectTotal } =
  entityAdapter.getSelectors<RootState>((state) => state.offlineVessels)

export function selectAllOfflineVessels(state: RootState) {
  return selectAll(state)
}

export const selectOfflineVesselById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    return selectById(state, id)
  })
)

export const selectOfflineVessels = (state: RootState) => state.offlineVessels.entities
export const selectProfileIds = (state: RootState) => state.offlineVessels.profileIds
export default vesselsSlice.reducer
