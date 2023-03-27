import { createSelector } from '@reduxjs/toolkit'
import { selectBigQueryActive } from 'features/bigquery/bigquery.slice'
import { selectDatasetModal } from 'features/datasets/datasets.slice'
import { selectDebugActive } from 'features/debug/debug.slice'
import {
  selectDownloadActivityModalOpen,
  selectDownloadTrackModalOpen,
} from 'features/download/download.selectors'
import { selectEditorActive } from 'features/editor/editor.slice'
import { selectFeedbackModalOpen, selectScreenshotModalOpen } from 'features/modals/modals.slice'
import { selectVesselGroupModalOpen } from 'features/vessel-groups/vessel-groups.slice'

export const selectSecretModals = createSelector(
  [selectDebugActive, selectEditorActive, selectBigQueryActive],
  (debugModalOpen, editorModalOpen, bigQueryModalOpen) => {
    return {
      debug: debugModalOpen,
      editor: editorModalOpen,
      bigQuery: bigQueryModalOpen,
    }
  }
)
export const selectAppModals = createSelector(
  [
    selectFeedbackModalOpen,
    selectDatasetModal,
    selectScreenshotModalOpen,
    selectVesselGroupModalOpen,
    selectDownloadTrackModalOpen,
    selectDownloadActivityModalOpen,
  ],
  (
    feedbackModalOpen,
    datasetModal,
    screenshotModalOpen,
    vesselGroupsModalOpen,
    downloadTrackModalOpen,
    downloadActivityModalOpen
  ) => {
    return {
      feedback: feedbackModalOpen,
      datataset: datasetModal !== undefined,
      screenshot: screenshotModalOpen,
      vesselGroups: vesselGroupsModalOpen,
      downloadTrack: downloadTrackModalOpen,
      downloadActivity: downloadActivityModalOpen,
    }
  }
)

export const selectAnyAppModalOpen = createSelector([selectAppModals], (modals) => {
  return Object.values(modals).some((m) => m === true)
})
