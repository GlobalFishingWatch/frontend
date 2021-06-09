import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import db from 'offline-store'
import { RootState } from 'store'
import { OfflineVesselActivity } from 'types/activity'
import { AsyncError, asyncInitialState, AsyncReducer, createAsyncSlice } from 'utils/async-slice'
export interface OfflineVesselActivityState extends AsyncReducer<OfflineVesselActivity> {
  profileIds: (string | undefined)[]
}

const initialState: OfflineVesselActivityState = {
  ...asyncInitialState,
  profileIds: [],
}

export type CreateOfflineVesselActivity = { activity: OfflineVesselActivity }
export const createOfflineVesselActivityThunk = createAsyncThunk<
  OfflineVesselActivity,
  CreateOfflineVesselActivity,
  {
    rejectValue: AsyncError
  }
>('offlineVesselsActivity/create', async ({ activity }, { rejectWithValue }) => {
  try {
    console.log(activity)
    db.activity.add(activity)
    return activity
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})

export const deleteOfflineVesselActivityThunk = createAsyncThunk<
  OfflineVesselActivity,
  string,
  {
    rejectValue: AsyncError
  }
>('offlineVesselsActivity/delete', async (profileId: string, { rejectWithValue }) => {
  try {
    const result = await db.activity.get(profileId)
    if (result === undefined) {
      throw new Error('Vessel not found')
    }
    await db.activity.delete(profileId)
    return { ...result }
  } catch (e: any) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${profileId} - ${e.message}`,
    })
  }
})

/*export const fetchOfflineVesselsActivityThunk = createAsyncThunk<
  OfflineVesselActivity,
  string[],
  {
    rejectValue: AsyncError
  }
>('offlineVesselsActivity/fetch', async (profileIds: string[], { rejectWithValue, getState }) => {
  const existingIds = selectProfileIds(getState() as RootState) as string[]
  const uniqIds = Array.from(new Set([...profileIds, ...existingIds])).filter((id) => !!id)
  try {
    if (uniqIds.length) {
      return await db.activity.where('profileId').anyOfIgnoreCase(uniqIds).toArray()
    } else {
      return await db.activity.toArray()
    }
  } catch (e: any) {
    return rejectWithValue({ status: e.status || e.code, message: e.message })
  }
})*/

export const fetchOfflineVesselActivityByIdThunk = createAsyncThunk<
  OfflineVesselActivity,
  string,
  {
    rejectValue: AsyncError
  }
>('offlineVesselsActivity/fetchById', async (profileId: string, { rejectWithValue }) => {
  try {
    const result = await db.activity.get(profileId)
    if (result === undefined) {
      throw new Error('Vessel not found')
    }
    return result
  } catch (e: any) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${profileId} - ${e.message}`,
    })
  }
})

export const updateOfflineVesselActivityThunk = createAsyncThunk<
  OfflineVesselActivity,
  OfflineVesselActivity,
  {
    rejectValue: AsyncError
  }
>('offlineVesselsActivity/update', async (activity: OfflineVesselActivity, { rejectWithValue }) => {
  try {
    await db.activity.put(activity, activity.profileId)
    return activity
  } catch (e: any) {
    return rejectWithValue({
      status: e.status || e.code,
      message: `${activity.profileId} - ${e.message}`,
    })
  }
})

const { slice: vesselsSlice, entityAdapter } = createAsyncSlice<OfflineVesselActivityState, OfflineVesselActivity>({
  name: 'offlineVesselsActivity',
  initialState,
  thunks: {
    createThunk: createOfflineVesselActivityThunk,
    deleteThunk: deleteOfflineVesselActivityThunk,
    //fetchThunk: fetchOfflineVesselsActivityThunk,
    updateThunk: updateOfflineVesselActivityThunk,
    fetchByIdThunk: fetchOfflineVesselActivityByIdThunk,
  },
})

export const { selectById, selectAll, selectEntities, selectTotal } =
  entityAdapter.getSelectors<RootState>((state) => state.offlineVesselsActivity)

export const selectOfflineVesselById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    return selectById(state, id)
  })
)

export const selectOfflineVesselsActivity = (state: RootState) => state.offlineVesselsActivity.entities
export const selectProfileIds = (state: RootState) => state.offlineVessels.profileIds
export default vesselsSlice.reducer
