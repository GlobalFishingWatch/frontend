import { createSelector } from '@reduxjs/toolkit'
import { WorkspaceCategory } from 'data/workspaces'
import { selectBigQueryActive } from 'features/bigquery/bigquery.slice'
import { selectDebugActive } from 'features/debug/debug.slice'
import {
  selectDownloadActivityModalOpen,
  selectDownloadTrackModalOpen,
} from 'features/download/download.selectors'
import { selectEditorActive } from 'features/editor/editor.slice'
import {
  selectDatasetUploadModalOpen,
  selectFeedbackModalOpen,
  selectLayerLibraryModalOpen,
  selectScreenshotModalOpen,
} from 'features/modals/modals.slice'
import { selectVesselGroupModalOpen } from 'features/vessel-groups/vessel-groups.slice'
import { WelcomeContentKey } from 'features/welcome/welcome.content'
import {
  selectLocationCategory,
  selectIsAnyVesselLocation,
  selectIsStandaloneSearchLocation,
} from 'routes/routes.selectors'

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
    selectLayerLibraryModalOpen,
    selectDatasetUploadModalOpen,
    selectScreenshotModalOpen,
    selectVesselGroupModalOpen,
    selectDownloadTrackModalOpen,
    selectDownloadActivityModalOpen,
  ],
  (
    feedbackModalOpen,
    layerLibraryModalOpen,
    datasetUploadModalOpen,
    screenshotModalOpen,
    vesselGroupsModalOpen,
    downloadTrackModalOpen,
    downloadActivityModalOpen
  ) => {
    return {
      feedback: feedbackModalOpen,
      layerLibrary: layerLibraryModalOpen,
      datataset: datasetUploadModalOpen,
      screenshot: screenshotModalOpen,
      vesselGroups: vesselGroupsModalOpen,
      downloadTrack: downloadTrackModalOpen,
      downloadActivity: downloadActivityModalOpen,
    }
  }
)

export const selectWelcomeModalKey = createSelector(
  [selectLocationCategory, selectIsAnyVesselLocation, selectIsStandaloneSearchLocation],
  (locationCategory, isAnyVesselLocation, isStandaloneSearchLocation): WelcomeContentKey => {
    return isAnyVesselLocation || isStandaloneSearchLocation
      ? 'vessel-profile'
      : locationCategory || WorkspaceCategory.FishingActivity
  }
)

export const selectAnyAppModalOpen = createSelector([selectAppModals], (modals) => {
  return Object.values(modals).some((m) => m === true)
})
