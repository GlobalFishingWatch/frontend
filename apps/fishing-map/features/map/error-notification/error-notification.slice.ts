import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'

export type ErrorNotification = {
  latitude: number
  longitude: number
  label: string
}

type ErrorNotificationSlice = {
  isNotifyingError: boolean
  error: ErrorNotification | null
}

const initialState: ErrorNotificationSlice = {
  isNotifyingError: false,
  error: null,
}

const slice = createSlice({
  name: 'errorNotification',
  initialState,
  reducers: {
    setErrorNotification: (state, action: PayloadAction<Partial<ErrorNotification>>) => {
      state.error = { ...state.error, ...(action.payload as ErrorNotification) }
    },
    toggleErrorNotifying: (state) => {
      state.isNotifyingError = !state.isNotifyingError
    },
    setIsNotifyingError: (state, action: PayloadAction<boolean>) => {
      state.isNotifyingError = action.payload
    },
    resetErrorNotification: (state) => {
      state.error = null
    },
  },
})

export const {
  setErrorNotification,
  toggleErrorNotifying,
  setIsNotifyingError,
  resetErrorNotification,
} = slice.actions

export const selectIsNotifyingError = (state: RootState) => state.errorNotification.isNotifyingError
export const selectErrorNotification = (state: RootState) => state.errorNotification.error

export default slice.reducer
