import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { DataviewCategory } from '@globalfishingwatch/api-types'

export type ModalId = 'feedback' | 'screenshot' | 'layerLibrary'

export type ModalsOpenState = {
  feedback: boolean
  screenshot: boolean
  layerLibrary: DataviewCategory | false
}

const initialState: ModalsOpenState = {
  feedback: false,
  screenshot: false,
  layerLibrary: false,
}

const modalsOpen = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalOpen: (
      state,
      action: PayloadAction<{ id: ModalId; open: boolean | DataviewCategory }>
    ) => {
      const { id, open } = action.payload
      if (id === 'layerLibrary') {
        state[id] = open as DataviewCategory
      } else {
        state[id] = open as boolean
      }
    },
  },
})

export const { setModalOpen } = modalsOpen.actions

export const selectFeedbackModalOpen = (state: RootState) => state.modals.feedback
export const selectLayerLibraryModal = (state: RootState) => state.modals.layerLibrary
export const selectLayerLibraryModalOpen = (state: RootState) => state.modals.layerLibrary !== false
export const selectScreenshotModalOpen = (state: RootState) => state.modals.screenshot

export default modalsOpen.reducer
