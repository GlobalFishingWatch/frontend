import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI, {
  getAccessTokenFromUrl,
  removeAccessTokenFromUrl,
} from '@globalfishingwatch/api-client'
import { UserData } from '@globalfishingwatch/api-types'
import { RootState } from 'store'
import { AsyncReducerStatus } from 'types'
import { selectPrevLocation } from 'routes/routes.selectors'
import { updateLocation } from 'routes/routes.actions'
import { HOME, ROUTE_TYPES, USER } from 'routes/routes'

interface UserState {
  logged: boolean
  status: AsyncReducerStatus
  data: UserData | null
}

const initialState: UserState = {
  logged: false,
  status: AsyncReducerStatus.Idle,
  data: null,
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
  async (_, { dispatch, getState }) => {
    await GFWAPI.logout()
    await dispatch(fetchUserThunk({ guest: true }))
    // const prevLocation = selectPrevLocation(getState() as RootState)
    // dispatch(
    //   updateLocation(prevLocation.type === USER ? HOME : (prevLocation.type as ROUTE_TYPES), {
    //     payload: prevLocation.payload,
    //     query: prevLocation.query,
    //     replaceQuery: true,
    //   })
    // )
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
    builder.addCase(logoutUserThunk.fulfilled, (state) => {
      state.logged = false
      state.data = null
    })
  },
})

export const selectUserData = (state: RootState) => state.user.data
export const selectUserStatus = (state: RootState) => state.user.status
export const selectUserLogged = (state: RootState) => state.user.logged

export default userSlice.reducer
