import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { DatasetGeometryType, DataviewCategory } from '@globalfishingwatch/api-types'

import type { RootState } from 'reducers'

type ModalId =
  | 'feedback'
  | 'vesselCorrection'
  | 'screenshot'
  | 'layerLibrary'
  | 'datasetUpload'
  | 'editWorkspace'
  | 'createWorkspace'
  | 'downloadTrack'

/**
 * Which GFW-only secret menu is open.
 *
 * These flags live here rather than in editor.slice / bigquery.slice because Modals.tsx is rendered by
 * PlatformLayout on every route: reading them from those slices put both in the always-loaded graph and
 * blocked them from being lazily injected. Those slices keep their own data and react to the actions
 * below — see their extraReducers.
 */
export type BigQueryModalMode = 'default' | 'turning-tides'

export type LayerLibraryMode = DataviewCategory | false
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
  layerLibrary: {
    open: LayerLibraryMode
    singleCategory: boolean
  }
  editWorkspace: boolean
  createWorkspace: boolean
  datasetUpload: { open: boolean } & DatasetUploadConfig
  editor: boolean
  bigQuery: BigQueryModalMode | false
  downloadTrack: boolean
}

const initialState: ModalsOpenState = {
  feedback: false,
  vesselCorrection: false,
  screenshot: false,
  layerLibrary: {
    open: false,
    singleCategory: false,
  },
  editWorkspace: false,
  createWorkspace: false,
  datasetUpload: {
    open: false,
    id: undefined,
    type: undefined,
    style: 'default',
  },
  editor: false,
  bigQuery: false,
  downloadTrack: false,
}

const modals = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    setModalOpen: (
      state,
      action: PayloadAction<{
        id: ModalId
        open: boolean | LayerLibraryMode
        singleCategory?: boolean
      }>
    ) => {
      const { id, open, singleCategory } = action.payload
      if (id === 'layerLibrary') {
        state[id].open = open as LayerLibraryMode
        state[id].singleCategory = singleCategory ?? false
      } else if (id === 'datasetUpload') {
        state[id].open = open as boolean
      } else {
        state[id] = open as boolean
      }
    },
    setDatasetUploadConfig: (state, action: PayloadAction<DatasetUploadConfig>) => {
      state.datasetUpload = { ...state.datasetUpload, ...action.payload }
    },
    toggleEditorMenu: (state) => {
      state.editor = !state.editor
    },
    /**
     * Deliberately preserves the previous `active = !active; mode = 'default'` semantics: hitting the
     * BigQuery combo while the Turning Tides modal is open closes *both* rather than switching modes.
     * Odd, but it is what shipped, so it is not changed here.
     */
    toggleBigQueryModal: (state) => {
      state.bigQuery = state.bigQuery !== false ? false : 'default'
    },
    toggleTurningTidesModal: (state) => {
      state.bigQuery = state.bigQuery !== false ? false : 'turning-tides'
    },
    closeBigQueryModal: (state) => {
      state.bigQuery = false
    },
  },
})

export const {
  closeBigQueryModal,
  setDatasetUploadConfig,
  setModalOpen,
  toggleBigQueryModal,
  toggleEditorMenu,
  toggleTurningTidesModal,
} = modals.actions

export const selectFeedbackModalOpen = (state: RootState) => state.modals.feedback
export const selectLayerLibraryModal = (state: RootState) => state.modals.layerLibrary.open
export const selectLayerLibraryModalOpen = (state: RootState) =>
  state.modals.layerLibrary.open !== false
export const selectLayerLibraryUniqueCategory = (state: RootState) =>
  state.modals.layerLibrary.singleCategory
export const selectDatasetUploadModalConfig = (state: RootState) => state.modals.datasetUpload
export const selectDatasetUploadModalOpen = (state: RootState) => state.modals.datasetUpload?.open
export const selectEditWorkspaceModalOpen = (state: RootState) => state.modals.editWorkspace
export const selectCreateWorkspaceModalOpen = (state: RootState) => state.modals.createWorkspace
export const selectScreenshotModalOpen = (state: RootState) => state.modals.screenshot
export const selectVesselCorrectionModalOpen = (state: RootState) => state.modals.vesselCorrection
export const selectEditorMenuOpen = (state: RootState) => state.modals.editor
/**
 * Previously derived from downloadTrack.slice's `ids.length > 0`. It lives here because Modals.tsx and
 * modals.selectors are always loaded, and deriving it kept downloadTrack.slice eagerly registered. The
 * two sites that open/close the modal dispatch this alongside the slice action they already dispatch.
 */
export const selectDownloadTrackModalOpen = (state: RootState) => state.modals.downloadTrack
export const selectBigQueryModalOpen = (state: RootState) => state.modals.bigQuery === 'default'
export const selectTurningTidesModalOpen = (state: RootState) =>
  state.modals.bigQuery === 'turning-tides'

export default modals.reducer
