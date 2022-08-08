import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'

export type ModalId = 'feedback' | 'screenshot'

export type ModalsOpenState = Record<ModalId, boolean>

const initialState: ModalsOpenState = {
  feedback: false,
  screenshot: false,
}

const modalsOpen = createSlice({
  name: 'debug',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<{ id: ModalId; open: boolean }>) => {
      state[action.payload.id] = action.payload.open
    },
  },
})

export const { setModalOpen } = modalsOpen.actions

export const selectFeedbackModalOpen = (state: RootState) => state.modals.feedback
export const selectScreenshotModalOpen = (state: RootState) => state.modals.screenshot

export default modalsOpen.reducer
