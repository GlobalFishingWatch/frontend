import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { DatasetGeometryType, DataviewCategory } from '@globalfishingwatch/api-types'

export type ModalId = 'feedback' | 'screenshot' | 'layerLibrary' | 'datasetUpload'

export type LayerLibraryMode = DataviewCategory | false
export type DatasetUploadConfig = {
  id?: string
  type?: DatasetGeometryType
}

export type ModalsOpenState = {
  feedback: boolean
  screenshot: boolean
  layerLibrary: LayerLibraryMode
  datasetUpload: { open: boolean } & DatasetUploadConfig
}

const initialState: ModalsOpenState = {
  feedback: false,
  screenshot: false,
  layerLibrary: false,
  datasetUpload: {
    open: false,
    id: undefined,
    type: undefined,
  },
}

const modals = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalOpen: (
      state,
      action: PayloadAction<{ id: ModalId; open: boolean | LayerLibraryMode }>
    ) => {
      const { id, open } = action.payload
      if (id === 'layerLibrary') {
        state[id] = open as LayerLibraryMode
      } else if (id === 'datasetUpload') {
        state[id].open = open as boolean
      } else {
        state[id] = open as boolean
      }
    },
    setDatasetUploadConfig: (state, action: PayloadAction<DatasetUploadConfig>) => {
      if (Object.keys(action.payload).includes('id')) {
        state.datasetUpload.id = action.payload.id
      }
      if (Object.keys(action.payload).includes('type')) {
        state.datasetUpload.type = action.payload.type
      }
    },
  },
})

export const { setModalOpen, setDatasetUploadConfig } = modals.actions

export const selectFeedbackModalOpen = (state: RootState) => state.modals.feedback
export const selectLayerLibraryModal = (state: RootState) => state.modals.layerLibrary
export const selectLayerLibraryModalOpen = (state: RootState) => state.modals.layerLibrary !== false
export const selectDatasetUploadModalId = (state: RootState) => state.modals.datasetUpload?.id
export const selectDatasetUploadModalType = (state: RootState) => state.modals.datasetUpload?.type
export const selectDatasetUploadModalOpen = (state: RootState) => state.modals.datasetUpload?.open
export const selectScreenshotModalOpen = (state: RootState) => state.modals.screenshot

export default modals.reducer
