import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'

export type ModalId = 'feedback' | 'screenshot' | 'layerLibrary'

export type ModalsOpenState = Record<ModalId, boolean>

const initialState: ModalsOpenState = {
  feedback: false,
  screenshot: false,
  layerLibrary: false,
}

const modalsOpen = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<{ id: ModalId; open: boolean }>) => {
      state[action.payload.id] = action.payload.open
    },
  },
})

export const { setModalOpen } = modalsOpen.actions

export const selectFeedbackModalOpen = (state: RootState) => state.modals.feedback
export const selectLayerLibraryModalOpen = (state: RootState) => state.modals.layerLibrary
export const selectScreenshotModalOpen = (state: RootState) => state.modals.screenshot

export default modalsOpen.reducer
