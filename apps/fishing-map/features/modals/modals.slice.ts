import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'reducers'

import type { DatasetGeometryType, DataviewCategory } from '@globalfishingwatch/api-types'

type ModalId =
  | 'feedback'
  | 'vesselCorrection'
  | 'screenshot'
  | 'layerLibrary'
  | 'datasetUpload'
  | 'editWorkspace'
  | 'createWorkspace'
  | 'workspaceGenerator'

type LayerLibraryMode = DataviewCategory | false
export type DatasetUploadStyle = 'default' | 'transparent'
export type DatasetUploadConfig = {
  id?: string
  dataviewId?: string
  type?: DatasetGeometryType
  style?: DatasetUploadStyle
  fileRejected?: boolean
}

type ModalsOpenState = {
  feedback: boolean
  vesselCorrection: boolean
  screenshot: boolean
  layerLibrary: LayerLibraryMode
  editWorkspace: boolean
  createWorkspace: boolean
  datasetUpload: { open: boolean } & DatasetUploadConfig
  workspaceGenerator: boolean
}

const initialState: ModalsOpenState = {
  feedback: false,
  vesselCorrection: false,
  screenshot: false,
  layerLibrary: false,
  editWorkspace: false,
  createWorkspace: false,
  datasetUpload: {
    open: false,
    id: undefined,
    type: undefined,
    style: 'default',
  },
  workspaceGenerator: false,
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
      state.datasetUpload = { ...state.datasetUpload, ...action.payload }
    },
  },
})

export const { setModalOpen, setDatasetUploadConfig } = modals.actions

export const selectFeedbackModalOpen = (state: RootState) => state.modals.feedback
export const selectLayerLibraryModal = (state: RootState) => state.modals.layerLibrary
export const selectLayerLibraryModalOpen = (state: RootState) => state.modals.layerLibrary !== false
export const selectWorkspaceGeneratorModalOpen = (state: RootState) =>
  state.modals.workspaceGenerator
export const selectDatasetUploadModalConfig = (state: RootState) => state.modals.datasetUpload
export const selectDatasetUploadModalOpen = (state: RootState) => state.modals.datasetUpload?.open
export const selectEditWorkspaceModalOpen = (state: RootState) => state.modals.editWorkspace
export const selectCreateWorkspaceModalOpen = (state: RootState) => state.modals.createWorkspace
export const selectScreenshotModalOpen = (state: RootState) => state.modals.screenshot
export const selectVesselCorrectionModalOpen = (state: RootState) => state.modals.vesselCorrection

export default modals.reducer
