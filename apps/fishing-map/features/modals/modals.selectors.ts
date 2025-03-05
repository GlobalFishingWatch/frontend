import { createSelector } from '@reduxjs/toolkit'

import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import {
  selectDownloadActivityModalOpen,
  selectDownloadTrackModalOpen,
} from 'features/download/download.selectors'
import {
  selectDatasetUploadModalOpen,
  selectFeedbackModalOpen,
  selectLayerLibraryModalOpen,
  selectScreenshotModalOpen,
} from 'features/modals/modals.slice'
import { selectVesselGroupModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import type { WelcomeContentKey } from 'features/welcome/welcome.content'
import {
  selectIsAnyVesselLocation,
  selectIsStandaloneSearchLocation,
  selectLocationCategory,
} from 'routes/routes.selectors'

const selectAppModals = createSelector(
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
      : locationCategory || DEFAULT_WORKSPACE_CATEGORY
  }
)

export const selectAnyAppModalOpen = createSelector([selectAppModals], (modals) => {
  return Object.values(modals).some((m) => m === true)
})
