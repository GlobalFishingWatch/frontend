import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI, {
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { Dataset, UserData } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { DATASETS_CACHE } from 'features/datasets/datasets.slice'
import { AsyncError } from 'utils/async-slice'

interface UserState {
  logged: boolean
  status: AsyncReducerStatus
  data: UserData | null
  datasets: {
    status: AsyncReducerStatus
    data: Dataset[] | undefined
    error: AsyncError | undefined
  }
}

const initialState: UserState = {
  logged: false,
  status: AsyncReducerStatus.Idle,
  data: null,
  datasets: {
    status: AsyncReducerStatus.Idle,
    data: undefined,
    error: undefined,
  },
}

export const GUEST_USER_TYPE = 'guest'

export const fetchGuestUser = async () => {
  const permissions = await fetch(
    `${GFWAPI.getBaseUrl()}/auth/acl/permissions/anonymous`
  ).then((r) => r.json())
  const user: UserData = { id: 0, type: GUEST_USER_TYPE, permissions }
  return user
}

export const fetchUserThunk = createAsyncThunk(
  'user/fetch',
  async ({ guest }: { guest: boolean } = { guest: false }) => {
    if (guest) {
      return await fetchGuestUser()
    }
    const accessToken = getAccessTokenFromUrl()
    if (accessToken) {
      removeAccessTokenFromUrl()
    }

    try {
      return await GFWAPI.login({ accessToken })
    } catch (e) {
      return await fetchGuestUser()
    }
  }
)

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async ({ redirectToLogin }: { redirectToLogin: boolean } = { redirectToLogin: false }) => {
    try {
      await GFWAPI.logout()
    } catch (e) {
      console.warn(e)
    }
    if (redirectToLogin) {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }
)

export const fetchUserDatasetsThunk = createAsyncThunk(
  'user/datasets',
  async (_, { rejectWithValue }) => {
    try {
      const datasets = await GFWAPI.fetch<Dataset[]>(
        `/v1/datasets?include=endpoints&cache=${DATASETS_CACHE}`
      )
      return datasets
    } catch (e) {
      return rejectWithValue({ status: e.status || e.code, message: e.message })
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserThunk.pending, (state) => {
      state.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchUserThunk.fulfilled, (state, action) => {
      state.status = AsyncReducerStatus.Finished
      state.logged = true
      state.data = action.payload
    })
    builder.addCase(fetchUserThunk.rejected, (state) => {
      state.status = AsyncReducerStatus.Error
    })
    builder.addCase(fetchUserDatasetsThunk.pending, (state) => {
      state.datasets.status = AsyncReducerStatus.Loading
    })
    builder.addCase(fetchUserDatasetsThunk.fulfilled, (state, action) => {
      state.datasets.status = AsyncReducerStatus.Finished
      state.datasets.data = action.payload
    })
    builder.addCase(fetchUserDatasetsThunk.rejected, (state) => {
      state.datasets.status = AsyncReducerStatus.Error
    })
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.logged = false
      state.data = null
    })
  },
})

export const selectUserData = (state: RootState) => state.user.data
export const selectUserStatus = (state: RootState) => state.user.status
export const selectAllUserDatasets = (state: RootState) => state.user.datasets.data
export const selectUserDatasetsStatus = (state: RootState) => state.user.datasets.status
export const selectUserLogged = (state: RootState) => state.user.logged

export default userSlice.reducer
