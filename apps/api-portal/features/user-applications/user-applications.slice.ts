import { createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  AsyncError,
  asyncInitialState,
  AsyncReducer,
  AsyncReducerStatus,
  createAsyncSlice,
} from 'lib/async-slice'
import { AppState } from 'app/store'
import { stringify } from 'qs'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { UserApplication } from '@globalfishingwatch/api-types'
import { selectUserData } from 'features/user/user.slice'

export enum UserApplicationsStatus {
  AsyncReducerStatus,
}
export type UserApplicationsState = AsyncReducer<UserApplication>

const initialState: UserApplicationsState = {
  ...asyncInitialState,
}

export interface UserApplications {
  id: number
  data: UserApplication[]
}
export interface UserApplicationFetchArguments {
  userId?: number
  limit?: number
  offset?: number
}
export interface UserApplicationFetchResponse {
  offset: number
  metadata: any
  total: number
  limit: number | null
  nextOffset: number
  entries: UserApplication[]
}
export const fetchUserApplicationsThunk = createAsyncThunk(
  'user-applications/fetch',
  async (
    { userId, limit = 0, offset = 0 }: UserApplicationFetchArguments,
    { rejectWithValue, getState, signal }
  ) => {
    try {
      const query = stringify({
        'user-id': userId,
        ...((limit && { limit }) || {}),
        ...((offset && { offset }) || {}),
      })
      const url = `/v2/auth/user-applications?${query}`
      return await GFWAPI.fetch<UserApplicationFetchResponse>(url, {
        signal,
      })
        .then((response) => response?.entries)
        .catch((error) => {
          return null
        })
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: `User Applications - ${e.message}`,
      })
    }
  },
  {
    condition: (_, { getState, extra }) => {
      const { userApplications } = getState() as AppState
      const fetchStatus = userApplications.status
      if (
        fetchStatus === AsyncReducerStatus.Finished ||
        fetchStatus === AsyncReducerStatus.Loading
      ) {
        // Already fetched or in progress, don't need to re-fetch
        return false
      }
      return true
    },
  }
)

export type UserApplicationCreateArguments = Omit<UserApplication, 'id' | 'token' | 'createdAt'>

export const createUserApplicationsThunk = createAsyncThunk<
  UserApplication,
  UserApplicationCreateArguments,
  {
    rejectValue: AsyncError
  }
>(
  'user-applications/create',
  async (newUserApplication: UserApplicationCreateArguments, { rejectWithValue, signal }) => {
    try {
      const url = `/v2/auth/user-applications`
      return await GFWAPI.fetch<UserApplication>(url, {
        method: 'POST',
        body: newUserApplication as any,
        signal,
      })
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: `User Applications - ${e.message}`,
      })
    }
  }
)

export interface UserApplicationDeleteArguments {
  id: number
}
export const deleteUserApplicationsThunk = createAsyncThunk<
  UserApplication,
  UserApplicationDeleteArguments,
  {
    rejectValue: AsyncError
  }
>(
  'user-applications/delete',
  async ({ id }: UserApplicationDeleteArguments, { rejectWithValue, signal }) => {
    try {
      const url = `/v2/auth/user-applications/${id}`
      const userApplication = await GFWAPI.fetch<UserApplication>(url, {
        method: 'DELETE',
        responseType: 'default',
        signal,
      })
      console.log(userApplication)
      return { ...userApplication, id }
    } catch (e: any) {
      return rejectWithValue({
        status: e.status || e.code,
        message: `User Applications - ${e.message}`,
      })
    }
  }
)

const { slice: userApplicationsSlice, entityAdapter } = createAsyncSlice<
  UserApplicationsState,
  UserApplications
>({
  name: 'user-applications',
  initialState,
  thunks: {
    fetchThunk: fetchUserApplicationsThunk,
    createThunk: createUserApplicationsThunk,
    deleteThunk: deleteUserApplicationsThunk,
  },
})
export const selectUserApplicationsIds = (state: AppState) => state.userApplications.ids
export const selectUserApplications = (state: AppState) => state.userApplications.entities
export const selectUserApplicationsStatus = (state: AppState) => state.userApplications.status

export const selectUserApplicationsRequiredInfoCompleted = createSelector(
  [selectUserData],
  (user) => user && user.intendedUse && user.whoEndUsers && user.problemToResolve && !!user.apiTerms
)

export const userApplicationsEntityAdapter = entityAdapter
export default userApplicationsSlice.reducer
